import { FileCode, Search, Merge, Cpu, ShieldCheck, Download } from "lucide-react";

const steps = [
  ["Raw Input", "LISS-IV imagery uploaded"],
  ["Cloud Detection", "Cloud and shadow mask extracted"],
  ["Multi-modal Fusion", "SAR and optical references aligned"],
  ["AI Reconstruction", "Surface details regenerated"],
  ["Quality Check", "Spectral consistency validated"],
  ["Export", "PNG, JPG and GeoTIFF ready"],
];

const icons = [FileCode, Search, Merge, Cpu, ShieldCheck, Download];

export default function WorkflowPipeline() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {steps.map(([title, description], index) => {
        const Icon = icons[index];

        return (
          <div
            key={title}
            className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:border-cyan-400/50"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg border border-cyan-400/20 bg-cyan-950/40 p-2 text-cyan-400">
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-[10px] tracking-widest text-cyan-400">
                PHASE 0{index + 1}
              </span>
            </div>

            <h3 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">
              {title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {description}
            </p>
          </div>
        );
      })}
    </div>
  );
}