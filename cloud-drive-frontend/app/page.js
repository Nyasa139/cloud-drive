"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [starred, setStarred] = useState([]);

  useEffect(() => {
    loadFiles();
    loadStars();
  }, []);

  async function loadFiles() {
    const { data, error } = await supabase.storage
      .from("files")
      .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      alert(error.message);
      return;
    }

    setFiles(data || []);
  }

  async function loadStars() {
    const { data, error } = await supabase
      .from("stars")
      .select("file_name");

    if (!error) {
      setStarred(data.map((s) => s.file_name));
    }
  }

  async function toggleStar(fileName) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (starred.includes(fileName)) {
      await supabase
        .from("stars")
        .delete()
        .eq("file_name", fileName)
        .eq("user_id", user.id);

      setStarred(starred.filter((f) => f !== fileName));
    } else {
      await supabase.from("stars").insert({
        file_name: fileName,
        user_id: user.id,
      });

      setStarred([...starred, fileName]);
    }
  }

  return (
    <div>
      <h1>My Files</h1>

      <div style={grid}>
        {files.map((file) => (
          <FileCard
            key={file.name}
            file={file}
            reload={loadFiles}
            starred={starred.includes(file.name)}
            onStar={() => toggleStar(file.name)}
          />
        ))}
      </div>
    </div>
  );
}

function FileCard({ file, reload, starred, onStar }) {
  const [url, setUrl] = useState(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    async function getUrl() {
      const { data } = await supabase.storage
        .from("files")
        .createSignedUrl(file.name, 3600);

      if (data?.signedUrl) {
        setUrl(data.signedUrl);
      }
    }

    getUrl();
  }, [file.name]);

  async function deleteFile() {
    if (!confirm(`Delete "${file.name}"?`)) return;

    setWorking(true);

    const { error } = await supabase.storage
      .from("files")
      .remove([file.name]);

    setWorking(false);

    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    reload();
  }

  async function renameFile() {
    const newName = prompt("Enter new file name", file.name);
    if (!newName || newName === file.name) return;

    setWorking(true);

    const { error } = await supabase.storage
      .from("files")
      .move(file.name, newName);

    setWorking(false);

    if (error) {
      alert("Rename failed: " + error.message);
      return;
    }

    reload();
  }

  return (
    <div style={card}>
      {/* IMAGE */}
      {url && file.metadata?.mimetype?.startsWith("image/") && (
        <img src={url} style={preview} />
      )}

      {/* PDF */}
      {url && file.metadata?.mimetype === "application/pdf" && (
        <iframe src={url} style={preview} />
      )}

      <p style={{ fontSize: 13, wordBreak: "break-all" }}>
        {file.name}
      </p>

      <div style={actions}>
        <button onClick={renameFile} disabled={working}>
          Rename
        </button>
        <button onClick={deleteFile} disabled={working}>
          Delete
        </button>

        {url && (
          <a href={url} target="_blank">
            Open
          </a>
        )}

        {/* ⭐ STAR BUTTON */}
        <button onClick={onStar} style={starBtn}>
          {starred ? "⭐" : "☆"}
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 20,
};

const card = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
};

const preview = {
  width: "100%",
  height: 120,
  objectFit: "cover",
  borderRadius: 8,
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 10,
};

const starBtn = {
  fontSize: 20,
  background: "none",
  border: "none",
  cursor: "pointer",
};
