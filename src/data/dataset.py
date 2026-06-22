"""Real SoLEXS + HEL1OS ingestion for flare forecasting.

The dataset normalizes organizer CSV/HDF5 files into a canonical internal time
series, aligns both instruments on a common cadence, creates sliding windows,
and returns the established PyTorch sample contract.

Assumptions / contract
----------------------
* Timestamp fields are named like ``timestamp``, ``time``, ``datetime``,
  ``date_time``, ``utc``, or ``date``. Values may be ISO strings, epoch seconds,
  or epoch milliseconds.
* Flux/bin columns should include an instrument name, e.g. ``solexs_bin_0`` or
  ``hel1os_flux_3``. If a file name contains only one instrument name, numeric
  non-metadata columns are assigned to that instrument.
* Default alignment cadence is 1 second. Duplicate timestamps are averaged.
* Bad data policy: +/-inf and negative flux values become NaN; NaNs are linearly
  interpolated on the shared time axis; windows with >20% original missing/bad
  values are dropped by default.
* Annotation files are optional. If provided, they need start/onset, end, and
  class columns. A window is quiet (0) when no event overlaps it; otherwise the
  highest overlapping severity wins: C=1, M=2, X=3. Without annotations, labels
  default to quiet and metadata marks ``labels_defaulted=True``.
"""

from __future__ import annotations

import csv
import logging
import math
import re
import warnings
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import numpy as np
import torch
from torch.utils.data import Dataset

LOGGER = logging.getLogger(__name__)

LABEL_MAP = {"C": 1, "M": 2, "X": 3}
TIMESTAMP_CANDIDATES = ("timestamp", "time", "datetime", "date_time", "utc", "date", "t")
METADATA_TOKENS = ("time", "flag", "label", "id", "class", "peak")


@dataclass
class InstrumentTable:
    timestamps_ns: np.ndarray
    solexs: np.ndarray | None
    hel1os: np.ndarray | None
    source_file: str


class FlareDataset(Dataset):
    """Windowed real-data dataset for SoLEXS and HEL1OS streams."""

    def __init__(
        self,
        data_path: str | Path,
        annotation_path: str | Path | None = None,
        window_size: int = 60,
        stride: int = 10,
        cadence: str = "1s",
        max_missing_ratio: float = 0.20,
    ) -> None:
        if window_size <= 0:
            raise ValueError("window_size must be positive")
        if stride <= 0:
            raise ValueError("stride must be positive")
        if not 0 <= max_missing_ratio <= 1:
            raise ValueError("max_missing_ratio must be in [0, 1]")
        self.data_path = Path(data_path)
        self.annotation_path = Path(annotation_path) if annotation_path else None
        self.window_size = int(window_size)
        self.stride = int(stride)
        self.cadence = cadence
        self.cadence_ns = self._parse_cadence_ns(cadence)
        self.max_missing_ratio = float(max_missing_ratio)
        self.samples = self._load_data()

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> dict[str, Any]:
        sample = self.samples[idx]
        return {
            "solexs": torch.as_tensor(sample["solexs_flux"], dtype=torch.float32),
            "hel1os": torch.as_tensor(sample["hel1os_flux"], dtype=torch.float32),
            "label": torch.as_tensor(sample["label"], dtype=torch.long),
            "metadata": sample["metadata"],
        }

    def _load_data(self) -> list[dict[str, Any]]:
        files = self._discover_data_files(self.data_path)
        if not files:
            raise FileNotFoundError(f"No CSV/HDF5 data files found at {self.data_path}")
        tables = [self._load_file(path) for path in files]
        aligned = self._align_modalities(tables)
        annotations = self._load_annotations(self.annotation_path)
        samples = self._generate_windows(aligned, annotations)
        if not samples:
            raise ValueError("No valid windows generated; check schema, window size, cadence, or missing-data threshold")
        return samples

    def _discover_data_files(self, path: Path) -> list[Path]:
        if path.is_file():
            return [path]
        if not path.exists():
            raise FileNotFoundError(f"data_path does not exist: {path}")
        return sorted(
            p
            for p in path.rglob("*")
            if p.suffix.lower() in {".csv", ".h5", ".hdf5", ".hdf"} and not self._looks_like_annotation(p)
        )

    def _load_file(self, path: Path) -> InstrumentTable:
        if path.suffix.lower() == ".csv":
            return self._load_csv(path)
        if path.suffix.lower() in {".h5", ".hdf5", ".hdf"}:
            return self._load_hdf5(path)
        raise ValueError(f"Unsupported file format: {path}")

    def _load_csv(self, path: Path) -> InstrumentTable:
        with path.open("r", encoding="utf-8-sig", newline="") as fh:
            rows = list(csv.DictReader(fh))
        if not rows:
            raise ValueError(f"CSV file is empty or missing a header: {path}")
        columns = list(rows[0].keys())
        time_col = self._find_timestamp_column(columns)
        if time_col is None:
            raise ValueError(f"No timestamp column found in {path}; columns={columns}")

        timestamps = np.array([self._parse_timestamp(row.get(time_col, ""), path) for row in rows], dtype=np.int64)
        valid_time = timestamps > 0
        solexs_cols, hel1os_cols = self._detect_channel_columns(columns, path)
        if not solexs_cols and not hel1os_cols:
            raise ValueError(
                f"No SoLEXS/HEL1OS numeric channels detected in {path}. Use names like solexs_bin_0/hel1os_bin_0."
            )

        solexs = self._rows_to_matrix(rows, solexs_cols) if solexs_cols else None
        hel1os = self._rows_to_matrix(rows, hel1os_cols) if hel1os_cols else None
        if solexs is not None:
            solexs = solexs[valid_time]
        if hel1os is not None:
            hel1os = hel1os[valid_time]
        return InstrumentTable(timestamps[valid_time], solexs, hel1os, str(path))

    def _load_hdf5(self, path: Path) -> InstrumentTable:
        try:
            import h5py  # type: ignore
        except ImportError as exc:
            raise ImportError("HDF5 support requires h5py. Install project requirements.txt.") from exc

        arrays: dict[str, np.ndarray] = {}
        with h5py.File(path, "r") as h5:
            def visit(name: str, obj: Any) -> None:
                if isinstance(obj, h5py.Dataset):
                    arr = np.asarray(obj)
                    if arr.ndim in (1, 2):
                        arrays[name] = arr

            h5.visititems(visit)
        if not arrays:
            raise ValueError(f"HDF5 file contains no 1D/2D datasets: {path}")

        time_key = self._find_timestamp_column(arrays.keys())
        if time_key is None:
            raise ValueError(f"No timestamp dataset found in {path}; keys={sorted(arrays)}")
        timestamps = np.array([self._parse_timestamp(v, path) for v in arrays[time_key]], dtype=np.int64)
        valid_time = timestamps > 0

        solexs_parts: list[np.ndarray] = []
        hel1os_parts: list[np.ndarray] = []
        for key, arr in arrays.items():
            if key == time_key or len(arr) != len(timestamps):
                continue
            clean = self._clean_name(key)
            matrix = arr.reshape(len(arr), 1) if arr.ndim == 1 else arr
            matrix = self._sanitize_flux(matrix.astype(float, copy=False))[valid_time]
            if "solexs" in clean:
                solexs_parts.append(matrix)
            elif "hel1os" in clean or "helios" in clean:
                hel1os_parts.append(matrix)
            elif "solexs" in path.stem.lower() and not any(tok in clean for tok in METADATA_TOKENS):
                solexs_parts.append(matrix)
            elif ("hel1os" in path.stem.lower() or "helios" in path.stem.lower()) and not any(tok in clean for tok in METADATA_TOKENS):
                hel1os_parts.append(matrix)

        solexs = np.concatenate(solexs_parts, axis=1) if solexs_parts else None
        hel1os = np.concatenate(hel1os_parts, axis=1) if hel1os_parts else None
        if solexs is None and hel1os is None:
            raise ValueError(f"No instrument datasets detected in {path}; keys={sorted(arrays)}")
        return InstrumentTable(timestamps[valid_time], solexs, hel1os, str(path))

    def _align_modalities(self, tables: list[InstrumentTable]) -> dict[str, Any]:
        solexs_bins = max((t.solexs.shape[1] for t in tables if t.solexs is not None), default=0)
        hel1os_bins = max((t.hel1os.shape[1] for t in tables if t.hel1os is not None), default=0)
        if solexs_bins == 0:
            raise ValueError("No SoLEXS channels found after loading files")
        if hel1os_bins == 0:
            raise ValueError("No HEL1OS channels found after loading files")

        by_time: dict[int, dict[str, Any]] = {}
        for table in tables:
            for i, ts in enumerate(table.timestamps_ns):
                slot = by_time.setdefault(int(ts), {"solexs": [], "hel1os": [], "sources": set()})
                slot["sources"].add(table.source_file)
                if table.solexs is not None:
                    slot["solexs"].append(self._pad_vector(table.solexs[i], solexs_bins))
                if table.hel1os is not None:
                    slot["hel1os"].append(self._pad_vector(table.hel1os[i], hel1os_bins))
        if not by_time:
            raise ValueError("All rows were dropped due to invalid timestamps")

        start = min(by_time)
        end = max(by_time)
        axis = np.arange(start, end + self.cadence_ns, self.cadence_ns, dtype=np.int64)
        solexs = np.full((len(axis), solexs_bins), np.nan, dtype=float)
        hel1os = np.full((len(axis), hel1os_bins), np.nan, dtype=float)
        sources = np.array(["" for _ in axis], dtype=object)

        index = {int(ts): i for i, ts in enumerate(axis)}
        for ts, slot in by_time.items():
            # Snap to nearest cadence position only if within half cadence.
            snapped = int(round((ts - start) / self.cadence_ns) * self.cadence_ns + start)
            if abs(snapped - ts) > self.cadence_ns / 2 or snapped not in index:
                continue
            j = index[snapped]
            if slot["solexs"]:
                solexs[j] = self._nanmean_no_warning(np.vstack(slot["solexs"]))
            if slot["hel1os"]:
                hel1os[j] = self._nanmean_no_warning(np.vstack(slot["hel1os"]))
            sources[j] = ";".join(sorted(slot["sources"]))

        combined_missing = np.concatenate([np.isnan(solexs), np.isnan(hel1os)], axis=1).mean(axis=1)
        solexs_interp = self._interpolate_matrix(solexs)
        hel1os_interp = self._interpolate_matrix(hel1os)
        return {
            "timestamps_ns": axis,
            "solexs": solexs_interp,
            "hel1os": hel1os_interp,
            "missing_ratio": combined_missing,
            "sources": sources,
        }

    def _load_annotations(self, annotation_path: Path | None) -> list[dict[str, Any]]:
        if annotation_path is None:
            warnings.warn("No flare annotations found; all windows default to quiet label 0.", RuntimeWarning)
            return []
        files = [annotation_path] if annotation_path.is_file() else sorted(annotation_path.rglob("*"))
        events: list[dict[str, Any]] = []
        for path in files:
            if path.suffix.lower() == ".csv":
                with path.open("r", encoding="utf-8-sig", newline="") as fh:
                    rows = list(csv.DictReader(fh))
            elif path.suffix.lower() in {".h5", ".hdf5", ".hdf"}:
                rows = self._read_hdf5_records(path)
            else:
                continue
            if not rows:
                continue
            cols = list(rows[0].keys())
            start_col = self._find_first_column(cols, ("start_time", "onset", "begin", "event_start", "start"))
            end_col = self._find_first_column(cols, ("end_time", "end", "event_end", "stop"))
            class_col = self._find_first_column(cols, ("flare_class", "class", "goes_class", "label"))
            id_col = self._find_first_column(cols, ("event_id", "flare_id", "id"))
            peak_col = self._find_first_column(cols, ("peak_flux", "flux_peak", "peak"))
            if not start_col or not end_col or not class_col:
                raise ValueError(f"Annotation file needs start/end/class columns: {path}; columns={cols}")
            for n, row in enumerate(rows):
                flare_class = self._class_token(row.get(class_col, ""))
                events.append(
                    {
                        "start_time": self._parse_timestamp(row.get(start_col, ""), path),
                        "end_time": self._parse_timestamp(row.get(end_col, ""), path),
                        "flare_class": flare_class,
                        "label": LABEL_MAP.get(flare_class, 0),
                        "event_id": row.get(id_col, str(n)) if id_col else str(n),
                        "peak_flux": self._parse_float(row.get(peak_col, "")) if peak_col else None,
                    }
                )
        return [e for e in events if e["start_time"] > 0 and e["end_time"] > 0]

    def _read_hdf5_records(self, path: Path) -> list[dict[str, Any]]:
        """Read simple columnar annotation HDF5 files into row dictionaries."""
        try:
            import h5py  # type: ignore
        except ImportError as exc:
            raise ImportError("HDF5 annotation support requires h5py. Install project requirements.txt.") from exc
        columns: dict[str, np.ndarray] = {}
        with h5py.File(path, "r") as h5:
            def visit(name: str, obj: Any) -> None:
                if isinstance(obj, h5py.Dataset) and obj.ndim == 1:
                    columns[Path(name).name] = np.asarray(obj)

            h5.visititems(visit)
        if not columns:
            return []
        n = min(len(v) for v in columns.values())
        rows: list[dict[str, Any]] = []
        for i in range(n):
            row: dict[str, Any] = {}
            for key, values in columns.items():
                value = values[i]
                row[key] = value.decode("utf-8", errors="ignore") if isinstance(value, bytes) else value
            rows.append(row)
        return rows

    def _generate_windows(self, aligned: dict[str, Any], annotations: list[dict[str, Any]]) -> list[dict[str, Any]]:
        timestamps = aligned["timestamps_ns"]
        samples: list[dict[str, Any]] = []
        labels_defaulted = len(annotations) == 0
        for start in range(0, len(timestamps) - self.window_size + 1, self.stride):
            end = start + self.window_size
            miss = float(np.nanmean(aligned["missing_ratio"][start:end]))
            if miss > self.max_missing_ratio:
                continue
            solexs = aligned["solexs"][start:end].astype(np.float32)
            hel1os = aligned["hel1os"][start:end].astype(np.float32)
            if np.isnan(solexs).any() or np.isnan(hel1os).any():
                continue
            start_ns = int(timestamps[start])
            end_ns = int(timestamps[end - 1])
            label, event = self._assign_window_label(start_ns, end_ns, annotations)
            window_sources = sorted({s for s in aligned["sources"][start:end] if s})
            samples.append(
                {
                    "solexs_flux": solexs,
                    "hel1os_flux": hel1os,
                    "label": int(label),
                    "metadata": {
                        "window_index": len(samples),
                        "start_time": self._iso_from_ns(start_ns),
                        "end_time": self._iso_from_ns(end_ns),
                        "timestamps": [self._iso_from_ns(int(ts)) for ts in timestamps[start:end]],
                        "event_id": event.get("event_id"),
                        "flare_class": event.get("flare_class"),
                        "peak_flux": event.get("peak_flux"),
                        "source_file": ";".join(window_sources),
                        "quality_flags": {
                            "missingness_ratio": miss,
                            "interpolation_used": bool(miss > 0),
                            "labels_defaulted": labels_defaulted,
                        },
                        "day": self._iso_from_ns(start_ns)[:10],
                    },
                }
            )
        return samples

    def _assign_window_label(self, start_ns: int, end_ns: int, annotations: list[dict[str, Any]]) -> tuple[int, dict[str, Any]]:
        overlaps = [e for e in annotations if e["start_time"] <= end_ns and e["end_time"] >= start_ns]
        if not overlaps:
            return 0, {}
        best = max(overlaps, key=lambda e: int(e.get("label", 0)))
        return int(best.get("label", 0)), best

    @staticmethod
    def _rows_to_matrix(rows: list[dict[str, str]], cols: list[str]) -> np.ndarray:
        return FlareDataset._sanitize_flux(np.array([[FlareDataset._parse_float(row.get(c, "")) for c in cols] for row in rows], dtype=float))

    @staticmethod
    def _sanitize_flux(arr: np.ndarray) -> np.ndarray:
        arr = arr.astype(float, copy=True)
        arr[~np.isfinite(arr)] = np.nan
        arr[arr < 0] = np.nan
        return arr

    @staticmethod
    def _interpolate_matrix(matrix: np.ndarray) -> np.ndarray:
        out = matrix.copy()
        x = np.arange(len(out))
        for col in range(out.shape[1]):
            y = out[:, col]
            valid = np.isfinite(y)
            if valid.all():
                continue
            if valid.sum() == 0:
                continue
            out[:, col] = np.interp(x, x[valid], y[valid])
        return out

    @staticmethod
    def _nanmean_no_warning(matrix: np.ndarray) -> np.ndarray:
        valid_counts = np.isfinite(matrix).sum(axis=0)
        sums = np.nansum(matrix, axis=0)
        out = np.full(matrix.shape[1], np.nan, dtype=float)
        np.divide(sums, valid_counts, out=out, where=valid_counts > 0)
        return out

    @staticmethod
    def _pad_vector(vec: np.ndarray, size: int) -> np.ndarray:
        out = np.full(size, np.nan, dtype=float)
        out[: min(size, len(vec))] = vec[:size]
        return out

    @staticmethod
    def _detect_channel_columns(columns: Iterable[str], path: Path) -> tuple[list[str], list[str]]:
        cols = list(columns)
        solexs = [c for c in cols if "solexs" in FlareDataset._clean_name(c) and not any(t in FlareDataset._clean_name(c) for t in METADATA_TOKENS)]
        hel1os = [c for c in cols if ("hel1os" in FlareDataset._clean_name(c) or "helios" in FlareDataset._clean_name(c)) and not any(t in FlareDataset._clean_name(c) for t in METADATA_TOKENS)]
        fallback = [c for c in cols if not any(t in FlareDataset._clean_name(c) for t in METADATA_TOKENS)]
        stem = path.stem.lower()
        if not solexs and "solexs" in stem:
            solexs = fallback
        if not hel1os and ("hel1os" in stem or "helios" in stem):
            hel1os = fallback
        return sorted(solexs, key=FlareDataset._natural_key), sorted(hel1os, key=FlareDataset._natural_key)

    @staticmethod
    def _find_timestamp_column(columns: Iterable[str]) -> str | None:
        return FlareDataset._find_first_column(columns, TIMESTAMP_CANDIDATES)

    @staticmethod
    def _find_first_column(columns: Iterable[str], candidates: Iterable[str]) -> str | None:
        cols = list(columns)
        cleaned = {c: FlareDataset._clean_name(c) for c in cols}
        for candidate in candidates:
            clean = FlareDataset._clean_name(candidate)
            for original, col in cleaned.items():
                if col == clean or clean in col:
                    return original
        return None

    @staticmethod
    def _parse_timestamp(value: Any, source: Path) -> int:
        if isinstance(value, bytes):
            value = value.decode("utf-8", errors="ignore")
        if isinstance(value, np.datetime64):
            return int(value.astype("datetime64[ns]").astype(np.int64))
        text = str(value).strip()
        if not text:
            return 0
        try:
            number = float(text)
            if math.isfinite(number):
                seconds = number / 1000.0 if number > 10_000_000_000 else number
                return int(seconds * 1_000_000_000)
        except ValueError:
            pass
        try:
            normalized = text.replace("Z", "+00:00")
            dt = datetime.fromisoformat(normalized)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return int(dt.timestamp() * 1_000_000_000)
        except ValueError as exc:
            LOGGER.debug("Could not parse timestamp %r in %s: %s", value, source, exc)
            return 0

    @staticmethod
    def _parse_float(value: Any) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return float("nan")

    @staticmethod
    def _class_token(value: Any) -> str:
        match = re.search(r"[CMX]", str(value).upper())
        return match.group(0) if match else "quiet"

    @staticmethod
    def _clean_name(name: str) -> str:
        return re.sub(r"[^a-zA-Z0-9_]+", "_", str(name).strip().lower()).strip("_")

    @staticmethod
    def _natural_key(name: str) -> tuple[str, int]:
        match = re.search(r"(\d+)(?!.*\d)", name)
        return (name, int(match.group(1)) if match else -1)

    @staticmethod
    def _looks_like_annotation(path: Path) -> bool:
        return any(token in path.stem.lower() for token in ("annot", "label", "flare", "event", "catalog"))

    @staticmethod
    def _parse_cadence_ns(cadence: str) -> int:
        match = re.fullmatch(r"\s*(\d+)\s*(ms|s|min|m|h)\s*", cadence.lower())
        if not match:
            raise ValueError("cadence must look like '1s', '500ms', '1min', or '1h'")
        value = int(match.group(1))
        unit = match.group(2)
        factors = {"ms": 1_000_000, "s": 1_000_000_000, "min": 60_000_000_000, "m": 60_000_000_000, "h": 3_600_000_000_000}
        return value * factors[unit]

    @staticmethod
    def _iso_from_ns(ns: int) -> str:
        return datetime.fromtimestamp(ns / 1_000_000_000, tz=timezone.utc).isoformat().replace("+00:00", "Z")
