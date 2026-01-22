"use client";

import { useRef } from "react";

export default function FileUploader({ onUpload, accept }) {
  const inputRef = useRef();

  function openPicker() {
    inputRef.current.click();
  }

  function handleChange(e) {
    const uploaded = Array.from(e.target.files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    onUpload(uploaded);
    e.target.value = "";
  }

  return (
    <>
      <button
        onClick={openPicker}
        style={{
          padding: 12,
          borderRadius: 8,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          marginTop: 20,
        }}
      >
        + Upload
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={
          accept === "image"
            ? "image/*"
            : accept === "video"
            ? "video/*"
            : accept === "application"
            ? ".pdf,.doc,.docx"
            : "*"
        }
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}
