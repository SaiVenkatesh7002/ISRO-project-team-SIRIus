export default function UploadZone({ file, onFileChange }) {
  return (
    <label className="upload-zone">
      <input
        accept=".tif,.tiff,.png,.jpg,.jpeg"
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        type="file"
      />
      <span className="upload-title">Drop or choose a satellite image</span>
      <span className="muted">Supported: GeoTIFF, PNG, JPG · Max 50 MB</span>
      {file && <strong className="file-name">Selected: {file.name}</strong>}
    </label>
  );
}
