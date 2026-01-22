"use client";

export default function FilePreviewModal({ file, onClose }) {
  if (!file) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <img
        src={file.url}
        style={{
          maxWidth: "80%",
          maxHeight: "80%",
          borderRadius: 10,
          animation: "zoom 0.2s ease",
        }}
      />
    </div>
  );
}
