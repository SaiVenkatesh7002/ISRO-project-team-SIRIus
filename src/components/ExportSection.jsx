import { useState } from "react";
import { FileImage, FileCode, Check } from "lucide-react";

export default function ExportSection({
  processedImage,
  title = "LISS-IV Segment",
}) {
  const [downloading, setDownloading] = useState(null);

  const handleImageExport = async (format) => {
    if (!processedImage) return;

    setDownloading(format);

    try {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = processedImage;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = image.naturalWidth || 1200;
      canvas.height = image.naturalHeight || 800;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      context.fillStyle = "rgba(4, 224, 245, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "rgba(255, 255, 255, 0.9)";
      context.font = "bold 24px monospace";
      context.fillText("CLOUDCLEAR AI", 40, 60);

      context.fillStyle = "rgba(39, 228, 245, 0.85)";
      context.font = "14px monospace";
      context.fillText(
        "ISRO LISS-IV CLOUD RECONSTRUCTION SYSTEM",
        40,
        85
      );

      context.fillStyle = "rgba(0, 0, 0, 0.65)";
      context.fillRect(0, canvas.height - 70, canvas.width, 70);

      context.fillStyle = "rgba(235, 235, 235, 0.8)";
      context.font = "12px monospace";
      context.fillText(
        `TARGET BLOCK: ${title.toUpperCase()}`,
        40,
        canvas.height - 40
      );
      context.fillText(
        "SPECTRAL RESTORATION: B2, B3, B4 MULTISPECTRAL MODE",
        40,
        canvas.height - 20
      );

      const fileType = format === "PNG" ? "image/png" : "image/jpeg";
      const extension = format === "PNG" ? "png" : "jpg";

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.download = `cloudclear_liss4_${extension}_export.${extension}`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
        },
        fileType,
        0.95
      );
    } catch (error) {
      console.warn(
        "Canvas export could not use this external image. Opening image directly instead."
      );

      const link = document.createElement("a");
      link.href = processedImage;
      link.target = "_blank";
      link.download = `cloudclear_enhanced_satellite.${format.toLowerCase()}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      setDownloading(null);
    }, 1000);
  };

  const handleGeoTiffExport = () => {
    setDownloading("TIFF");

    const geoTiffPlaceholder = `LISS-IV GEOTIFF GEOGRAPHIC REFERENCE MODEL

PROJECT: CloudClear AI
SYSTEM: ISRO LISS-IV Cloud Removal Prototype
PROCESSED SOURCE RANGE: Band 2, Band 3, Band 4 multispectral VNIR
DIMENSIONAL RESOLUTION: 5.8m

COORDINATE BOUNDS:
Upper Left: 12.9850 N, 77.5800 E
Lower Right: 12.9550 N, 77.6100 E

SPATIAL PROJECTION: WGS 84 / UTM Zone 43N
RADIOMETRIC CORRECTIONS: Generative neural reconstruction

STATUS: GeoTIFF export placeholder for frontend prototype
`;

    const blob = new Blob([geoTiffPlaceholder], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "liss4_reconstructed_geotiff.tif";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloading(null);
    }, 1000);
  };

  return (
    <div
      id="export-terminal"
      className="relative flex w-full flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 md:flex-row md:items-center"
    >
      <div className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-cyan-500/40" />
      <div className="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-cyan-500/40" />

      <div className="flex max-w-[500px] flex-col gap-1.5 text-left">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <h4 className="font-sans text-sm font-semibold tracking-widest text-zinc-100 uppercase">
            Ready to download geographic tile arrays
          </h4>
        </div>

        <p className="font-sans text-xs leading-relaxed text-zinc-400">
          Export the reconstructed satellite preview in PNG, JPG, or GeoTIFF
          prototype format for presentation and workflow demonstration.
        </p>
      </div>

      <div className="flex flex-wrap gap-3.5">
        <button
          type="button"
          onClick={() => handleImageExport("PNG")}
          disabled={downloading !== null || !processedImage}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-mono text-xs text-cyan-400 transition-all hover:border-cyan-500 hover:bg-zinc-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading === "PNG" ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          ) : (
            <FileImage className="h-4 w-4" />
          )}
          EXPORT PNG
        </button>

        <button
          type="button"
          onClick={() => handleImageExport("JPG")}
          disabled={downloading !== null || !processedImage}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-mono text-xs text-cyan-400 transition-all hover:border-cyan-500 hover:bg-zinc-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading === "JPG" ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          ) : (
            <FileImage className="h-4 w-4" />
          )}
          EXPORT JPG
        </button>

        <button
          type="button"
          onClick={handleGeoTiffExport}
          disabled={downloading !== null || !processedImage}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 font-mono text-xs font-semibold text-black shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading === "TIFF" ? (
            <Check className="h-4 w-4 animate-bounce text-black" />
          ) : (
            <FileCode className="h-4 w-4" />
          )}
          EXPORT GEOTIFF (.TIF)
        </button>
      </div>
    </div>
  );
}