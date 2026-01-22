"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function PublicFile({ params }) {
  const { token } = params;
  const [password, setPassword] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState("");

  async function accessFile() {
    const { data } = await supabase
      .from("public_links")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (!data) return setError("Invalid link");

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return setError("Link expired");
    }

    if (data.password_hash && btoa(password) !== data.password_hash) {
      return setError("Incorrect password");
    }

    // ✅ SIGNED URL GENERATED ONLY AFTER CHECKS
    const { data: signed } = await supabase.storage
      .from("files")
      .createSignedUrl(data.file_path, 300);

    setFileUrl(signed.signedUrl);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Secure File Access</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!fileUrl && (
        <>
          <input
            type="password"
            placeholder="Password (if required)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={accessFile}>Access File</button>
        </>
      )}

      {fileUrl && (
        <a href={fileUrl} target="_blank">
          📥 Download File
        </a>
      )}
    </div>
  );
}
