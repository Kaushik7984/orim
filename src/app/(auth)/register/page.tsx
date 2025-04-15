"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed");
    }
  };

  return (
    <div className='max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded'>
      <h2 className='text-xl font-semibold mb-4'>Register</h2>
      <form onSubmit={handleRegister} className='space-y-4'>
        <input
          type='text'
          placeholder='Name'
          className='w-full p-2 border'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button className='w-full bg-black text-white p-2'>Register</button>
      </form>
    </div>
  );
}
