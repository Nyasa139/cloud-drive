"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Trash() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadTrash();
  }, []);

  async function loadTrash() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("files_meta")
      .select("*")
      .eq("user_id", user.id)
      .eq("deleted", true)          // ✅ FIXED
      .order("deleted_at", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setFiles(data || []);
  }

  async function restore(file) {
    // restore in DB
    await supabase
      .from("files_meta")
      .update({
        deleted: false,
        deleted_at: null,
      })
      .eq("id", file.id);

    loadTrash();
  }

  async function deleteForever(file) {
    if (!confirm("Delete permanently?")) return;

    // delete from storage
    await supabase.storage.from("files").remove([file.file_name]);

    // delete from DB
    await supabase.from("files_meta").delete().eq("id", file.id);

    loadTrash();
  }

  return (
    <div>
      <h1>Trash</h1>

      {files.length === 0 && <p>No deleted files</p>}

      {files.map((file) => (
        <div key={file.id} style={{ marginBottom: 12 }}>
          <strong>{file.file_name}</strong>

          <div style={{ marginTop: 6 }}>
            <button onClick={() => restore(file)}>Restore</button>
            <button onClick={() => deleteForever(file)}>
              Delete Forever
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
