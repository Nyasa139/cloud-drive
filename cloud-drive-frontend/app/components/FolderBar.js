"use client";

export default function FolderBar({ folders, current, setCurrent }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {folders.map((f) => (
        <button
          key={f}
          onClick={() => setCurrent(f)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: current === f ? "#2563eb" : "#e5e7eb",
            color: current === f ? "#fff" : "#000",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
