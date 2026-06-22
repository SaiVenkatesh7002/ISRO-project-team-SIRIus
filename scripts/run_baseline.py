"""Run simple real-data baselines over FlareDataset windows.

This script intentionally has no synthetic-data fallback. It fails clearly when
organizer data cannot be parsed, so ingestion problems are visible early.
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from src.data import FlareDataset  # noqa: E402

LOGGER = logging.getLogger("run_baseline")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run flare baselines on real SoLEXS/HEL1OS windows")
    parser.add_argument("--data-path", required=True, help="CSV/HDF5 file or directory with organizer data")
    parser.add_argument("--annotation-path", default=None, help="Optional CSV/HDF5 annotation file or directory")
    parser.add_argument("--task", choices=["nowcast", "forecast"], default="nowcast")
    parser.add_argument("--model", choices=["threshold", "flux-rise"], default="threshold")
    parser.add_argument("--window-size", type=int, default=60)
    parser.add_argument("--stride", type=int, default=10)
    parser.add_argument("--cadence", default="1s")
    parser.add_argument("--threshold-percentile", type=float, default=95.0)
    parser.add_argument("--output", default="baseline_results.json")
    return parser.parse_args()


def predict_threshold(features: np.ndarray, percentile: float) -> np.ndarray:
    scores = features[:, -1]
    threshold = np.percentile(scores, percentile)
    return (scores >= threshold).astype(int)


def predict_flux_rise(features: np.ndarray, percentile: float) -> np.ndarray:
    scores = features[:, -1] - features[:, 0]
    threshold = np.percentile(scores, percentile)
    return (scores >= threshold).astype(int)


def compute_metrics(y_true: np.ndarray, y_pred_binary: np.ndarray) -> dict[str, float | int]:
    y_binary = (y_true > 0).astype(int)
    tp = int(((y_binary == 1) & (y_pred_binary == 1)).sum())
    tn = int(((y_binary == 0) & (y_pred_binary == 0)).sum())
    fp = int(((y_binary == 0) & (y_pred_binary == 1)).sum())
    fn = int(((y_binary == 1) & (y_pred_binary == 0)).sum())
    total = max(len(y_binary), 1)
    precision = tp / max(tp + fp, 1)
    recall = tp / max(tp + fn, 1)
    return {
        "accuracy": (tp + tn) / total,
        "precision": precision,
        "recall": recall,
        "f1": 2 * precision * recall / max(precision + recall, 1e-12),
        "tp": tp,
        "tn": tn,
        "fp": fp,
        "fn": fn,
    }


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    args = parse_args()

    dataset = FlareDataset(
        data_path=args.data_path,
        annotation_path=args.annotation_path,
        window_size=args.window_size,
        stride=args.stride,
        cadence=args.cadence,
    )
    LOGGER.info("Loaded %d real windows from %s", len(dataset), args.data_path)

    features = []
    labels = []
    for sample in dataset:
        # A deliberately simple real-data feature: total flux per timestamp over
        # all bins and both instruments.
        flux = np.concatenate([sample["solexs"].numpy(), sample["hel1os"].numpy()], axis=1)
        features.append(flux.sum(axis=1))
        labels.append(int(sample["label"].item()))
    feature_arr = np.asarray(features, dtype=np.float32)
    label_arr = np.asarray(labels, dtype=np.int64)

    if args.model == "threshold":
        pred = predict_threshold(feature_arr, args.threshold_percentile)
    else:
        pred = predict_flux_rise(feature_arr, args.threshold_percentile)

    result = {
        "task": args.task,
        "model": args.model,
        "data_path": str(args.data_path),
        "annotation_path": str(args.annotation_path) if args.annotation_path else None,
        "n_samples": int(len(dataset)),
        "label_counts": {str(k): int(v) for k, v in zip(*np.unique(label_arr, return_counts=True))},
        "metrics": compute_metrics(label_arr, pred),
        "example_metadata": dataset[0]["metadata"],
    }

    output_path = Path(args.output)
    output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    LOGGER.info("Wrote %s", output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
