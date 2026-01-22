"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);
    router.push("/");
  }

  return (
    <div style={container}>
      <form onSubmit={handleLogin} style={card}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
        <p onClick={() => router.push("/signup")}>Create account</p>
      </form>
    </div>
  );
}

const container = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" };
const card = { background: "#fff", padding: 30, width: 320, borderRadius: 10 };
