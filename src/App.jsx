import { useRef, useState } from "react";
import {
  UploadCloud,
  Satellite,
  Sparkles,
  Play,
  SlidersHorizontal,
  Columns2,
  FileImage,
  FileCode2,
  Activity,
  Download,
  Cloud,
  CheckCircle2,
  Rotate3D,
} from "lucide-react";
import { motion } from "framer-motion";
import MagicRings from "./components/MagicRings";

const BEFORE =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=85";

const AFTER =
  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=85";

const STEPS = [
  "Cloud mask extraction",
  "Spatial texture recovery",
  "Spectral balancing",
  "Fine detail refinement",
];

const METRICS = [
  ["PSNR", "34.8 dB", "Clarity index", "cyan"],
  ["SSIM", "0.982", "Structure match", "violet"],
  ["Confidence", "99.2%", "Surface reliability", "lime"],
  ["Details", "98.6%", "Fine features preserved", "cyan"],
];

export default function App() {
  const inputRef = useRef(null);

  const [before, setBefore] = useState(BEFORE);
  const [after, setAfter] = useState(AFTER);
  const [fileName, setFileName] = useState("cloudy_observation.png");
  const [slider, setSlider] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(100);
  const [viewMode, setViewMode] = useState("slider");

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setBefore(imageUrl);
    setAfter(imageUrl);
    setFileName(file.name);
    setProgress(0);
  };

  const reconstruct = () => {
    if (processing) return;

    setProcessing(true);
    setProgress(0);

    let value = 0;
    const timer = setInterval(() => {
      value += 10;
      setProgress(value);

      if (value >= 100) {
        clearInterval(timer);
        setAfter(AFTER);
        setProcessing(false);
      }
    }, 180);
  };

  const downloadImage = (format) => {
    const link = document.createElement("a");
    link.href = after;
    link.download = `cloudclear-output.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTiff = () => {
    const blob = new Blob(
      [
        `CLOUDCLEAR EXPORT\n\nFile: ${fileName}\nPSNR: 34.8 dB\nSSIM: 0.982\nConfidence: 99.2%\n\nFrontend GeoTIFF placeholder.`,
      ],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cloudclear-output.tif";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#030711] text-white">
      <MagicRings />

      <div className="relative z-10 min-h-screen">
        <header className="border-b border-white/10 bg-[#030711]/65 px-5 py-4 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10">
                <Satellite className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-[0.2em] text-slate-500">
                  SURFACE RECONSTRUCTION
                </p>
                <p className="text-xs font-semibold text-slate-200">
                  Observation Workspace
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />
              <span className="font-mono text-[9px] tracking-widest text-lime-200">
                READY
              </span>
            </div>
          </div>
        </header>

        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 pb-8 pt-11 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 font-mono text-[10px] tracking-widest text-cyan-100"
          >
            <Rotate3D className="h-3.5 w-3.5" />
            INTERACTIVE ORBITAL VIEW
          </motion.div>

          <h1 className="text-5xl font-black tracking-[0.08em] text-white sm:text-7xl">
            CLOUD<span className="text-cyan-300">CLEAR</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
            Upload cloudy imagery, inspect the restored surface, compare both
            layers, and export the result.
          </p>
        </section>

        <main className="mx-auto grid max-w-7xl gap-5 px-5 pb-14 xl:grid-cols-[270px_minmax(0,1fr)_255px]">
          {/* Input */}
          <section className="h-fit rounded-3xl border border-white/10 bg-[#07101d]/80 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2.5">
                <UploadCloud className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-widest text-cyan-200">
                  01 / INPUT
                </p>
                <h2 className="text-base font-bold">Upload image</h2>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />

            <button
              onClick={() => inputRef.current?.click()}
              className="mt-5 flex w-full flex-col items-center rounded-2xl border border-dashed border-cyan-300/30 bg-cyan-300/[0.05] px-4 py-7 text-center transition hover:border-cyan-200 hover:bg-cyan-300/[0.1]"
            >
              <UploadCloud className="h-8 w-8 text-cyan-200" />
              <span className="mt-3 text-sm font-semibold">Drop image here</span>
              <span className="mt-1 font-mono text-[9px] text-slate-500">
                PNG • JPG • JPEG
              </span>
            </button>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="font-mono text-[9px] text-slate-500">ACTIVE FILE</p>
              <p className="mt-1 truncate text-xs text-slate-200">{fileName}</p>
            </div>

            <button
              onClick={reconstruct}
              disabled={processing}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-lime-200 px-4 py-3 font-mono text-[10px] font-black tracking-widest text-black transition hover:brightness-110 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  PROCESSING
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-black" />
                  RECONSTRUCT
                </>
              )}
            </button>

            <div className="mt-5">
              <div className="flex justify-between font-mono text-[9px] text-slate-500">
                <span>PROGRESS</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-200 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-mono text-[9px] tracking-widest text-slate-500">
                FLOW
              </p>
              <div className="mt-3 space-y-3">
                {STEPS.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300/10 font-mono text-[9px] text-cyan-200">
                      {index + 1}
                    </span>
                    <span className="text-[11px] text-slate-400">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Compact Comparison */}
          <section className="rounded-3xl border border-white/10 bg-[#07101d]/80 p-5 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[9px] tracking-widest text-cyan-200">
                  02 / COMPARISON
                </p>
                <h2 className="mt-1 text-lg font-bold">Restored surface preview</h2>
              </div>

              <div className="flex rounded-xl border border-white/10 bg-black/25 p-1">
                <button
                  onClick={() => setViewMode("slider")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[9px] transition ${
                    viewMode === "slider"
                      ? "bg-cyan-300 text-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  SLIDER
                </button>
                <button
                  onClick={() => setViewMode("side")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[9px] transition ${
                    viewMode === "side"
                      ? "bg-cyan-300 text-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Columns2 className="h-3.5 w-3.5" />
                  SIDE BY SIDE
                </button>
              </div>
            </div>

            {viewMode === "slider" ? (
              <div className="mt-4">
                <div className="relative h-[270px] overflow-hidden rounded-2xl border border-white/10 bg-black sm:h-[320px]">
                  <img
                    src={after}
                    alt="Restored output"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: `${slider}%` }}
                  >
                    <img
                      src={before}
                      alt="Cloudy input"
                      className="h-full max-w-none object-cover"
                      style={{ width: "100vw" }}
                    />
                  </div>

                  <div
                    className="absolute inset-y-0 w-[3px] bg-cyan-200 shadow-[0_0_24px_rgba(103,232,249,1)]"
                    style={{ left: `${slider}%` }}
                  >
                    <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-100 bg-[#06101d]">
                      <SlidersHorizontal className="h-4 w-4 text-cyan-100" />
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={slider}
                    onChange={(event) => setSlider(Number(event.target.value))}
                    className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                  />

                  <span className="absolute left-3 top-3 rounded-lg bg-black/70 px-3 py-1.5 font-mono text-[9px] text-white">
                    CLOUDY
                  </span>
                  <span className="absolute right-3 top-3 rounded-lg bg-lime-200/15 px-3 py-1.5 font-mono text-[9px] text-lime-100">
                    RESTORED
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <span className="font-mono text-[9px] text-slate-500">
                    MOVE DIVIDER TO INSPECT SURFACE DETAILS
                  </span>
                  <span className="font-mono text-[9px] text-cyan-200">{slider}%</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <div className="flex items-center justify-between bg-black/50 px-3 py-2">
                    <span className="font-mono text-[9px] text-slate-400">CLOUDY</span>
                    <Cloud className="h-3.5 w-3.5 text-violet-200" />
                  </div>
                  <img src={before} alt="Cloudy input" className="h-[270px] w-full object-cover" />
                </div>

                <div className="overflow-hidden rounded-2xl border border-lime-300/25 bg-black">
                  <div className="flex items-center justify-between bg-lime-300/10 px-3 py-2">
                    <span className="font-mono text-[9px] text-lime-100">RESTORED</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-lime-200" />
                  </div>
                  <img src={after} alt="Restored output" className="h-[270px] w-full object-cover" />
                </div>
              </div>
            )}
          </section>

          {/* Metrics / Export */}
          <aside className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-[#07101d]/80 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-lime-300/20 bg-lime-300/10 p-2.5">
                  <Activity className="h-5 w-5 text-lime-200" />
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-lime-200">
                    03 / METRICS
                  </p>
                  <h2 className="text-base font-bold">Output quality</h2>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {METRICS.map(([label, value, note, color]) => {
                  const style =
                    color === "lime"
                      ? "border-lime-300/20 bg-lime-300/[0.06]"
                      : color === "violet"
                        ? "border-violet-300/20 bg-violet-300/[0.06]"
                        : "border-cyan-300/20 bg-cyan-300/[0.06]";

                  return (
                    <div key={label} className={`rounded-2xl border p-3.5 ${style}`}>
                      <p className="font-mono text-[9px] tracking-widest text-slate-500">
                        {label.toUpperCase()}
                      </p>
                      <p className="mt-1.5 text-xl font-black text-white">{value}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{note}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#07101d]/80 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-2.5">
                  <Download className="h-5 w-5 text-cyan-200" />
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-widest text-cyan-200">
                    04 / EXPORT
                  </p>
                  <h2 className="text-base font-bold">Download result</h2>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <button
                  onClick={() => downloadImage("png")}
                  className="flex items-center justify-between rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-3 font-mono text-[10px] text-cyan-100 hover:bg-cyan-300/[0.12]"
                >
                  PNG <FileImage className="h-4 w-4" />
                </button>
                <button
                  onClick={() => downloadImage("jpg")}
                  className="flex items-center justify-between rounded-xl border border-violet-300/20 bg-violet-300/[0.06] px-4 py-3 font-mono text-[10px] text-violet-100 hover:bg-violet-300/[0.12]"
                >
                  JPG <FileImage className="h-4 w-4" />
                </button>
                <button
                  onClick={downloadTiff}
                  className="flex items-center justify-between rounded-xl bg-lime-200 px-4 py-3 font-mono text-[10px] font-bold text-black hover:bg-lime-100"
                >
                  GEOTIFF <FileCode2 className="h-4 w-4" />
                </button>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}