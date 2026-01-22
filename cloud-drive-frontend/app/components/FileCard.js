"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function FileCard({ file }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    supabase.storage
      .from("files")
      .createSignedUrl(file.fullPath, 60)
      .then(({ data }) => setUrl(data?.signedUrl));
  }, [file.fullPath]);

  // 🔐 CREATE RESTRICTED LINK
 async function createRestrictedLink() {
  const password = prompt("Set password (optional)");
  const hours = prompt("Expiry time in hours (optional)");

  const token = crypto.randomUUID();

  await supabase.from("public_links").insert({
    file_path: file.fullPath, // IMPORTANT
    token,
    password_hash: password ? btoa(password) : null,
    expires_at: hours
      ? new Date(Date.now() + Number(hours) * 3600 * 1000)
      : null,
  });

  const link = `${window.location.origin}/public/${token}`;
  await navigator.clipboard.writeText(link);

  alert("🔐 Secure link copied!");
}


  return (
    <div style={card}>
      <p>{file.name}</p>

      <div style={actions}>
        <button onClick={createRestrictedLink}>🔗 Share</button>
        {url && <a href={url} target="_blank">Open</a>}
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 12,
};

const actions = {
  display: "flex",
  gap: 8,
};
