"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function StarredPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadStarred();
  }, []);

  async function loadStarred() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // 1️⃣ Get starred filenames
    const { data: stars } = await supabase
      .from("stars")
      .select("file_name")
      .eq("user_id", user.id);

    if (!stars || stars.length === 0) {
      setFiles([]);
      return;
    }

    // 2️⃣ Get all storage files
    const { data: storageFiles } = await supabase.storage
      .from("files")
      .list("");

    // 3️⃣ Match starred
    const matched = storageFiles.filter((f) =>
      stars.some((s) => s.file_name === f.name)
    );

    // 4️⃣ Create preview URLs
    const withUrls = await Promise.all(
      matched.map(async (file) => {
        const { data } = await supabase.storage
          .from("files")
          .createSignedUrl(file.name, 3600);

        return {
          ...file,
          url: data?.signedUrl || null,
        };
      })
    );

    setFiles(withUrls);
  }

  return (
    <div>
      <h1>⭐ Starred Files</h1>

      {files.length === 0 && <p>No starred files yet</p>}

      <div style={grid}>
        {files.map((file) => (
          <div key={file.name} style={card}>
            {file.url && file.metadata?.mimetype?.startsWith("image") && (
              <img
                src={file.url}
                style={{ width: "100%", height: 120, objectFit: "cover" }}
              />
            )}

            <p style={{ fontSize: 13 }}>{file.name}</p>

            {file.url && (
              <a href={file.url} target="_blank">
                Open
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 20,
};

const card = {
  padding: 12,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
};
