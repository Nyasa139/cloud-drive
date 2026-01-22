"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Settings() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div style={box}>
      <h1>⚙ Settings</h1>

      <div style={card}>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
      </div>

      <button onClick={logout} style={logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const box = {
  maxWidth: 500,
};

const card = {
  border: "1px solid #e5e7eb",
  padding: 16,
  borderRadius: 12,
  marginBottom: 20,
};

const logoutBtn = {
  background: "#ef4444",
  color: "#fff",
  padding: 12,
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};
