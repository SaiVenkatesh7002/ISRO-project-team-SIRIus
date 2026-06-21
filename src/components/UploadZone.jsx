import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Play,
  Activity,
  Terminal,
  CheckCircle2,
  Database,
  ArrowRight,
} from "lucide-react";

export const SATELLITE_SAMPLES = [
  {
    id: "himalayas",
    name: "Western Ghats Grid (Canopy Block)",
    coordinates: "10.1284° N, 77.0125° E",
    sensor: "LISS-IV VNIR (Band 3, 4)",
    cloudy:
      "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&w=1200&q=80",
    cleared:
      "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      reduction: "98.9",
      spectral: "99.4",
      detail: "98.1",
      confidence: "99.2",
    },
  },
  {
    id: "harbor",
    name: "Chennai Harbor Infrastructure Panel",
    coordinates: "13.0827° N, 80.2707° E",
    sensor: "LISS-IV Multispectral (Band 2, 3, 4)",
    cloudy:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    cleared:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      reduction: "96.2",
      spectral: "98.7",
      detail: "96.9",
      confidence: "97.4",
    },
  },
  {
    id: "desert",
    name: "Thar Desert Bhadla Solar Cluster",
    coordinates: "27.5391° N, 71.9152° E",
    sensor: "LISS-IV Resampled Pan-Chromatic Core",
    cloudy:
      "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80",
    cleared:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      reduction: "99.7",
      spectral: "99.8",
      detail: "98.6",
      confidence: "99.5",
    },
  },
];

export default function UploadZone({ onReconstructionComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeSampleId, setActiveSampleId] = useState("");
  const [processStatus, setProcessStatus] = useState("IDLE");
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);

  const fileInputRef = useRef(null);
  const logContainerRef = useRef(null);

  const steps = [
    {
      name: "Atmospheric Cloud Mask Detection",
      delay: 800,
      log: "Analyzing LISS-IV band ratios. Cloud mask extracted successfully.",
    },
    {
      name: "Generative Spatial Reconstruction",
      delay: 1000,
      log: "Estimating underlying ground texture and spatial structures.",
    },
    {
      name: "Spectral Radiometric Correction",
      delay: 900,
      log: "Calibrating band-to-band reflectance and atmospheric scattering.",
    },
    {
      name: "Multi-temporal Fusion Matching",
      delay: 1100,
      log: "Matching temporal reference frames with sub-pixel alignment.",
    },
    {
      name: "Surface Restoration and Contrast Pass",
      delay: 700,
      log: "Restoring fine-scale surface detail. Export metadata prepared.",
    },
  ];

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const addLog = (text, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();

    setLogs((previousLogs) => [
      ...previousLogs,
      { timestamp, text, type },
    ]);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files?.[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files?.[0]) {
      handleFile(event.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      addLog(
        "Unsupported file type. Please upload a PNG, JPG, or other image file.",
        "error"
      );
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setPreviewUrl(objectUrl);
    setActiveSampleId("");
    setProcessStatus("IDLE");
    setLogs([]);

    addLog(
      `LISS-IV source imported: ${file.name} (${Math.round(file.size / 1024)} KB)`,
      "success"
    );
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSampleSelect = (sample) => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl(sample.cloudy);
    setActiveSampleId(sample.id);
    setProcessStatus("IDLE");
    setLogs([]);

    addLog(`Satellite sample activated: ${sample.name}`, "success");
    addLog("Sensor metadata loaded: LISS-IV 5.8m, bands B2, B3, B4.", "info");
  };

  const startReconstruction = async () => {
    if (!previewUrl) return;

    setProcessStatus("PROCESSING");
    setCurrentStep(0);
    setLogs([]);

    addLog("Initializing CloudClear AI reconstruction system...", "info");
    addLog("Loading simulated local neural inference pipeline...", "info");

    for (let index = 0; index < steps.length; index += 1) {
      setCurrentStep(index);

      addLog(
        `ACTIVE PHASE [${index + 1}/${steps.length}]: ${steps[index].name}`,
        "info"
      );

      await new Promise((resolve) => {
        setTimeout(resolve, steps[index].delay);
      });

      addLog(`SUCCESS: ${steps[index].log}`, "success");
    }

    setProcessStatus("COMPLETE");
    addLog("Cloud removal completed. Surface reconstruction output ready.", "success");

    if (activeSampleId) {
      const activeSample = SATELLITE_SAMPLES.find(
        (sample) => sample.id === activeSampleId
      );

      if (activeSample) {
        onReconstructionComplete({
          before: activeSample.cloudy,
          after: activeSample.cleared,
          metrics: activeSample.metrics,
          title: activeSample.name,
        });
      }
    } else {
      onReconstructionComplete({
        before: previewUrl,
        after: previewUrl,
        metrics: {
          reduction: "95.4",
          spectral: "97.8",
          detail: "95.1",
          confidence: "96.4",
        },
        title: "Imported LISS-IV Custom Grid",
      });
    }
  };

  const clearUpload = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl(null);
    setActiveSampleId("");
    setProcessStatus("IDLE");
    setLogs([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div id="processing-pipeline" className="flex w-full flex-col gap-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 animate-pulse text-cyan-400" />
            <h4 className="font-mono text-xs tracking-wider text-zinc-400 uppercase">
              ISRO Satellite Grid Presets
            </h4>
          </div>

          <p className="-mt-2 text-xs leading-relaxed text-zinc-400">
            Choose a sample LISS-IV-style imagery patch or upload your own
            cloudy satellite image to simulate reconstruction.
          </p>

          <div className="flex flex-col gap-3">
            {SATELLITE_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleSelect(sample)}
                className={`group relative flex flex-col items-start overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-300 ${
                  activeSampleId === sample.id
                    ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/50"
                }`}
              >
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      activeSampleId === sample.id
                        ? "animate-ping bg-cyan-400"
                        : "bg-zinc-600"
                    }`}
                  />
                  <span className="font-mono text-[8px] text-zinc-500">
                    LISS-4
                  </span>
                </div>

                <span className="font-sans text-xs font-medium tracking-wider text-zinc-100 uppercase transition-colors group-hover:text-cyan-400">
                  {sample.name.split(" (")[0]}
                </span>

                <span className="mt-1 font-mono text-[9px] text-zinc-500">
                  {sample.coordinates} • {sample.sensor.split(" (")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-8">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-cyan-400" />
            <h4 className="font-mono text-xs tracking-wider text-zinc-400 uppercase">
              Satellite Data Importer System
            </h4>
          </div>

          <div
            className={`relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-8 text-center backdrop-blur-md transition-all duration-300 ${
              dragActive
                ? "scale-[0.99] border-cyan-400 bg-cyan-950/10"
                : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <AnimatePresence mode="wait">
              {!previewUrl ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center gap-4 py-6"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <UploadCloud className="h-7 w-7" />
                    <span className="absolute inset-0 animate-ping rounded-full border border-cyan-400/20" />
                  </div>

                  <div className="flex max-w-[340px] flex-col gap-1.5">
                    <span className="font-sans text-sm font-medium text-zinc-200">
                      Drag and drop cloudy satellite imagery here
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500">
                      or click to select PNG / JPG image files
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={triggerSelect}
                    className="relative mt-2 cursor-pointer overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 font-mono text-xs text-cyan-400 transition-all hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  >
                    SELECT LISS-IV IMAGE
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-12"
                >
                  <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 md:col-span-5">
                    <img
                      src={previewUrl}
                      alt="LISS-IV source preview"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {processStatus === "PROCESSING" && (
                      <div className="absolute inset-x-0 h-1.5 w-full animate-[bounce_2s_infinite] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    )}

                    <div className="absolute top-2 left-2 rounded border border-cyan-500/20 bg-black/75 px-2 py-1 font-mono text-[8px] tracking-wider text-cyan-300">
                      INPUT BUFFER (ORIGINAL)
                    </div>

                    {activeSampleId && (
                      <span className="absolute right-2 bottom-2 rounded bg-black/60 px-2.5 py-1 font-mono text-[8px] text-zinc-300">
                        PRESET GRID
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 text-left md:col-span-7">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h5 className="font-sans text-xs font-medium tracking-widest text-zinc-100 uppercase">
                          {selectedImage
                            ? selectedImage.name
                            : `${activeSampleId.toUpperCase()} MATRIX`}
                        </h5>

                        <p className="mt-1 font-mono text-[9.5px] text-zinc-500">
                          Ref: SATELLITE_W_026 • LISS_4_FMT
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={clearUpload}
                        className="rounded border border-red-500/10 bg-red-950/10 px-2.5 py-1 font-mono text-xs text-red-400 uppercase transition-colors hover:border-red-500/30 hover:text-red-300"
                      >
                        Reset Buffer
                      </button>
                    </div>

                    {processStatus === "IDLE" && (
                      <div className="flex flex-col gap-3 py-2">
                        <p className="text-xs leading-relaxed text-zinc-400">
                          The system has registered the image. Launch the
                          simulated generative AI reconstruction pipeline to
                          create the cloud-free output preview.
                        </p>

                        <button
                          type="button"
                          onClick={startReconstruction}
                          className="group relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-cyan-500 px-5 py-3 font-mono text-xs font-bold text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                        >
                          <Play className="h-4 w-4 fill-black" />
                          LAUNCH GENERATIVE RECONSTRUCTION
                        </button>
                      </div>
                    )}

                    {processStatus === "PROCESSING" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between font-mono text-[11px] text-cyan-400">
                          <span className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5 animate-spin" />
                            AI CORE PROCESSING PIPELINE
                          </span>

                          <span>
                            {Math.round(
                              ((currentStep + 1) / steps.length) * 100
                            )}
                            %
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3">
                          {steps.map((step, index) => (
                            <div
                              key={step.name}
                              className="flex items-center justify-between font-mono text-[9px]"
                            >
                              <span
                                className={`flex items-center gap-2 ${
                                  index <= currentStep
                                    ? "text-zinc-200"
                                    : "text-zinc-600"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    index < currentStep
                                      ? "bg-emerald-400"
                                      : index === currentStep
                                        ? "animate-pulse bg-cyan-400"
                                        : "bg-zinc-800"
                                  }`}
                                />
                                {step.name}
                              </span>

                              <span
                                className={
                                  index < currentStep
                                    ? "text-emerald-400"
                                    : index === currentStep
                                      ? "animate-pulse text-cyan-400"
                                      : "text-zinc-600"
                                }
                              >
                                {index < currentStep
                                  ? "PASSED"
                                  : index === currentStep
                                    ? "RUNNING"
                                    : "QUEUED"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {processStatus === "COMPLETE" && (
                      <div className="flex flex-col gap-3 py-2">
                        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-3.5 font-mono text-xs text-emerald-400">
                          <CheckCircle2 className="h-5 w-5 shrink-0" />

                          <div>
                            <span className="block font-semibold">
                              RESTORED SUCCESSFULLY
                            </span>
                            <span className="mt-0.5 block text-[10px] text-zinc-400">
                              Output preview and export options are ready.
                            </span>
                          </div>
                        </div>

                        <a
                          href="#comparison-slider-module"
                          className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-center font-mono text-xs tracking-wider text-cyan-400 uppercase transition-all hover:bg-zinc-800"
                        >
                          Inspect output comparison
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {logs.length > 0 && (
            <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-900 bg-black font-mono text-[10px] shadow-2xl">
              <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                    ISRO_RECONSTRUCT_CONSOLE
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500/60" />
                  <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
                </div>
              </div>

              <div
                ref={logContainerRef}
                className="custom-terminal-lines flex max-h-[140px] flex-col gap-2 overflow-y-auto p-4"
              >
                {logs.map((log, index) => (
                  <div
                    key={`${log.timestamp}-${index}`}
                    className="flex items-start gap-3 leading-relaxed"
                  >
                    <span className="shrink-0 text-zinc-600">
                      [{log.timestamp}]
                    </span>

                    <span
                      className={
                        log.type === "success"
                          ? "text-emerald-400"
                          : log.type === "error"
                            ? "font-semibold text-red-400"
                            : "text-zinc-400"
                      }
                    >
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}