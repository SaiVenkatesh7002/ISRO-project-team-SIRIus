import { useState, useRef, useEffect } from "react";
import { Grid, Satellite, Layers } from "lucide-react";

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  metrics = {},
  title = "LISS-IV Spatial Comparison",
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setSliderPosition(percentage);
  };

  const handleTouchMove = (event) => {
    if (event.touches && event.touches[0]) {
      handleMove(event.touches[0].clientX);
    }
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 1 || isDragging) {
      handleMove(event.clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Title row */}
      <div className="flex flex-col justify-between gap-4 border-b border-cyan-500/20 pb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
          <h3 className="font-mono text-sm tracking-widest text-cyan-400 uppercase">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500 sm:gap-6">
          <span>COORDINATES: 12.9716° N, 77.5946° E</span>
          <span className="hidden rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-cyan-400 sm:inline">
            LISS-4 BAND STATUS: ACTIVE
          </span>
        </div>
      </div>

      <div className="relative flex flex-col items-stretch gap-8 xl:flex-row">
        {/* Interactive image slider */}
        <div
          ref={containerRef}
          className="group relative aspect-[16/10] flex-1 cursor-ew-resize touch-none overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 select-none md:aspect-[16/9]"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={(event) => {
            event.preventDefault();
            setIsDragging(true);
            handleMove(event.clientX);
          }}
          onTouchStart={(event) => {
            if (event.touches[0]) {
              setIsDragging(true);
              handleMove(event.touches[0].clientX);
            }
          }}
        >
          {/* After image */}
          <div className="absolute inset-0 h-full w-full">
            <img
              src={afterImage}
              alt="Cloud-free reconstructed LISS-IV imagery"
              className="h-full w-full object-cover brightness-110 saturate-[120%] grayscale-[20%]"
            />

            <div className="absolute top-4 right-4 z-10 rounded-md border border-lime-500/30 bg-lime-500/15 px-3 py-1.5 font-mono text-[10px] tracking-wider text-lime-400 uppercase backdrop-blur-md">
              AFTER: AI CLEARED
            </div>

            <div className="absolute bottom-4 left-4 z-10 flex max-w-[240px] flex-col gap-1 rounded-lg border border-lime-500/20 bg-black/70 p-3 font-mono text-[10px] text-lime-400 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Grid className="h-3 w-3 animate-spin text-lime-400" />
                <span className="text-xs font-semibold tracking-wider">
                  AI SPECTRAL PASS
                </span>
              </div>
              <span className="text-zinc-400">
                Reconstructed vegetation index
              </span>
              <span className="text-lime-300">
                NDVI: 0.68 (Healthy Canopy)
              </span>
            </div>
          </div>

          {/* Before image, clipped */}
          <div
            className="absolute inset-y-0 left-0 h-full overflow-hidden border-r border-cyan-400/50"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="absolute inset-y-0 left-0 h-full"
              style={{
                width: containerRef.current
                  ? `${containerRef.current.getBoundingClientRect().width}px`
                  : "100%",
              }}
            >
              <img
                src={beforeImage}
                alt="Cloudy original LISS-IV imagery"
                className="h-full w-full max-w-none object-cover brightness-95 contrast-90"
              />

              <div className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-[50%] w-[60%] items-start justify-between rounded-lg border-2 border-dashed border-red-500/70 bg-red-950/20 p-2 font-mono text-[10px] text-red-400 backdrop-blur-sm animate-pulse">
                  <span>DETECTED CUMULUS CLOUD COVER</span>
                  <span>RGB MATCH &gt; 92%</span>
                </div>
              </div>

              <div className="absolute top-4 left-4 z-10 rounded-md border border-cyan-500/30 bg-cyan-500/15 px-3 py-1.5 font-mono text-[10px] tracking-wider text-cyan-400 uppercase backdrop-blur-md">
                BEFORE: CLOUDY RAW
              </div>

              <div className="absolute bottom-4 left-4 z-10 flex max-w-[210px] flex-col gap-1 rounded-lg border border-cyan-500 bg-black/60 p-3 font-mono text-[10px] text-cyan-400 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Satellite className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
                  <span className="text-xs font-semibold tracking-wider">
                    LISS-IV SENSOR B4
                  </span>
                </div>
                <span className="text-zinc-400">
                  Atmospheric scatter detected
                </span>
                <span className="text-yellow-400">ALBEDO WARP: HIGH</span>
              </div>
            </div>
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 z-30 w-1 cursor-ew-resize bg-cyan-400"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cyan-400 bg-zinc-900 shadow-lg shadow-black/80 transition-colors hover:border-lime-400">
              <div className="flex items-center justify-center gap-0.5">
                <span className="h-3 w-1 rounded-full bg-cyan-400" />
                <span className="h-3 w-1 animate-pulse rounded-full bg-cyan-400" />
                <span className="h-3 w-1 rounded-full bg-cyan-400" />
              </div>
            </div>

            <div className="pointer-events-none absolute top-[10%] left-4 whitespace-nowrap rounded border border-cyan-500/40 bg-zinc-950/90 px-2.5 py-1.5 font-mono text-[9px] text-cyan-400 shadow-lg backdrop-blur-sm">
              SECTOR GRID: WL-{Math.round(sliderPosition * 3 + 450)}nm
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex h-auto w-full flex-col justify-between gap-4 xl:w-[320px]">
          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-2 font-mono text-xs tracking-wider text-zinc-400 uppercase">
              <Layers className="h-4 w-4 text-cyan-400" />
              Restoration Telemetry
            </h4>

            <p className="text-xs leading-relaxed text-zinc-400">
              Slide to review AI-guided generative spectral infilling. The
              prototype removes atmospheric cloud interference while preserving
              geographic structures.
            </p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-3.5 xl:grid-cols-1">
            <MetricCard
              label="Cloud Cover Reduced"
              value={metrics.reduction || "98.6"}
              color="cyan"
              note="↑ MAX"
            />
            <MetricCard
              label="Spectral Consistency"
              value={metrics.spectral || "99.2"}
              color="lime"
              note="σ < 0.05"
            />
            <MetricCard
              label="Detail Preservation"
              value={metrics.detail || "97.4"}
              color="purple"
              note="MTF H-RES"
            />
            <MetricCard
              label="Reconstruction Confidence"
              value={metrics.confidence || "98.9"}
              color="amber"
              note="BIAS VALID"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color, note }) {
  const colors = {
    cyan: {
      text: "text-cyan-400",
      border: "hover:border-cyan-500/40",
      bar: "bg-cyan-400",
      note: "text-emerald-400",
    },
    lime: {
      text: "text-lime-400",
      border: "hover:border-lime-500/40",
      bar: "bg-lime-400",
      note: "text-lime-300",
    },
    purple: {
      text: "text-purple-400",
      border: "hover:border-violet-500/40",
      bar: "bg-purple-400",
      note: "text-purple-300",
    },
    amber: {
      text: "text-amber-400",
      border: "hover:border-yellow-500/40",
      bar: "bg-amber-400",
      note: "text-amber-300",
    },
  };

  const style = colors[color];

  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 transition-all duration-300 ${style.border}`}
    >
      <span className="block font-mono text-[10px] text-zinc-500 uppercase">
        {label}
      </span>

      <div className="mt-1 flex items-baseline gap-2">
        <span className={`font-sans text-2xl font-medium ${style.text}`}>
          {value}%
        </span>
        <span className={`font-mono text-[9px] ${style.note}`}>{note}</span>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-900">
        <div
          className={`h-1 rounded-full transition-all duration-1000 ${style.bar}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}