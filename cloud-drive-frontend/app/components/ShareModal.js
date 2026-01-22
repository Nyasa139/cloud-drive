"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ShareModal({ fileId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  async function share() {
    const { data: user } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (!user) return alert("User not found");

    await supabase.from("file_shares").insert({
      file_id: fileId,
      shared_with: user.id,
      role,
    });

    alert("Shared successfully");
  }

  return (
    <div>
      <input
        placeholder="User email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <select onChange={e => setRole(e.target.value)}>
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
        <option value="owner">Owner</option>
      </select>

      <button onClick={share}>Share</button>
    </div>
  );
}
