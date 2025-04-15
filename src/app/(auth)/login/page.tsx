"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className='max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded'>
      <h2 className='text-xl font-semibold mb-4'>Login</h2>
      <form onSubmit={handleLogin} className='space-y-4'>
        <input
          type='email'
          placeholder='Email'
          className='w-full p-2 border'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='w-full p-2 border'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button className='w-full bg-black text-white p-2'>Login</button>
      </form>
    </div>
  );
}
