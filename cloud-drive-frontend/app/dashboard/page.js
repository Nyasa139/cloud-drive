"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [starred, setStarred] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAll();

    const refresh = () => loadAll();
    window.addEventListener("files-updated", refresh);
    return () => window.removeEventListener("files-updated", refresh);
  }, []);

  async function loadAll() {
    await loadFiles();
    await loadStars();
  }

  async function loadFiles() {
    const { data, error } = await supabase.storage
      .from("files")
      .list("", { limit: 100 });

    if (!error) setFiles(data || []);
  }

  async function loadStars() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("stars")
      .select("file_name")
      .eq("user_id", user.id);

    setStarred(data?.map(s => s.file_name) || []);
  }

  async function toggleStar(fileName) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (starred.includes(fileName)) {
      await supabase
        .from("stars")
        .delete()
        .eq("user_id", user.id)
        .eq("file_name", fileName);

      setStarred(prev => prev.filter(f => f !== fileName));
    } else {
      await supabase.from("stars").insert({
        user_id: user.id,
        file_name: fileName,
      });

      setStarred(prev => [...prev, fileName]);
    }
  }

  function Section({ title, filter }) {
    const list = files
      .filter(filter)
      .filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
      );

    if (!list.length) return null;

    return (
      <>
        <h2 style={sectionTitle}>{title}</h2>
        <div style={grid}>
          {list.map(file => (
            <FileCard
              key={file.name}
              file={file}
              reload={loadAll}
              starred={starred.includes(file.name)}
              onStar={() => toggleStar(file.name)}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <h1>File Management</h1>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchBox}
      />

      <Section
        title="🖼 Images"
        filter={f => f.metadata?.mimetype?.startsWith("image/")}
      />

      <Section
        title="📄 Documents"
        filter={f =>
          f.metadata?.mimetype === "application/pdf" ||
          f.name.endsWith(".doc") ||
          f.name.endsWith(".docx")
        }
      />

      <Section
        title="🎥 Videos"
        filter={f => f.metadata?.mimetype?.startsWith("video/")}
      />
    </div>
  );
}

/* ================= FILE CARD ================= */

function FileCard({ file, reload, starred, onStar }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    supabase.storage
      .from("files")
      .createSignedUrl(file.name, 3600)
      .then(({ data }) => setUrl(data?.signedUrl));
  }, [file.name]);

  async function deleteFile() {
    if (!confirm(`Delete ${file.name}?`)) return;
    await supabase.storage.from("files").remove([file.name]);
    reload();
  }

  // 🔗 SHARE LINK
  async function shareFile() {
    const { data, error } = await supabase.storage
      .from("files")
      .createSignedUrl(file.name, 60 * 60 * 24); // 24 hours

    if (error) {
      alert("Failed to create link");
      return;
    }

    await navigator.clipboard.writeText(data.signedUrl);
    alert("Public link copied!");
  }

  return (
    <div style={card}>
      {url && file.metadata?.mimetype?.startsWith("image/") && (
        <img src={url} style={preview} />
      )}

      <p style={{ wordBreak: "break-all" }}>{file.name}</p>

      <div style={actions}>
        <button onClick={deleteFile}>Delete</button>
        <button onClick={onStar}>{starred ? "⭐" : "☆"}</button>
        <button onClick={shareFile}>🔗</button>
        {url && <a href={url} target="_blank">Open</a>}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const sectionTitle = { marginTop: 30 };

const searchBox = {
  width: "100%",
  padding: 12,
  margin: "16px 0",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 16,
};

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
  gap: 8,
  alignItems: "center",
};
