"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return alert("Login required");

  const filePath = `${Date.now()}-${file.name}`;

  // 1️⃣ Upload to storage
  const { error } = await supabase.storage
    .from("files")
    .upload(filePath, file);

  if (error) {
    alert(error.message);
    return;
  }

  // 2️⃣ INSERT INTO files_meta (THIS WAS MISSING ❗)
  await supabase.from("files_meta").insert({
    user_id: user.id,
    file_name: filePath,
    bucket: "files",
    mime_type: file.type,
    size: file.size,
  });

  window.location.reload();
}



  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const Item = ({ label, icon, path }) => (
    <button
      onClick={() => router.push(path)}
      style={{
        ...styles.item,
        ...(pathname === path ? styles.active : {}),
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>Cloud Drive</h2>

      <nav style={styles.nav}>
        <Item icon="🏠" label="Home" path="/" />
        <Item icon="📁" label="File Management" path="/dashboard" />
        <Item icon="⭐" label="Starred" path="/starred" />
        {/*<Item icon="🗑" label="Trash" path="/trash" />*/}
        <Item icon="⚙" label="Settings" path="/settings" />
      </nav>

      {/* UPLOAD INPUT */}
      <input
        id="fileUpload"
        type="file"
        hidden
        onChange={handleUpload}
      />

      <button
        style={styles.createBtn}
        onClick={() => document.getElementById("fileUpload").click()}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "＋ Create New"}
      </button>

      {/* PROGRESS BAR */}
      {uploading && (
        <div style={progressBox}>
          <div style={progressBar}>
            <div
              style={{
                ...progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <p style={{ fontSize: 12 }}>{progress}%</p>
        </div>
      )}

      <button style={styles.logout} onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    width: 260,
    padding: 24,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #e5e7eb",
  },
  logo: { marginBottom: 30 },
  nav: { display: "flex", flexDirection: "column", gap: 12 },
  item: {
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: 10,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  active: {
    background: "#e0e7ff",
    color: "#2563eb",
    fontWeight: 600,
  },
  createBtn: {
    marginTop: "auto",
    background: "#2563eb",
    color: "#fff",
    padding: "14px 18px",
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 10,
    border: "none",
    cursor: "pointer",
  },
  logout: {
    background: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
    border: "none",
  },
};

const progressBox = {
  marginBottom: 12,
};

const progressBar = {
  height: 6,
  background: "#e5e7eb",
  borderRadius: 4,
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "#2563eb",
};
