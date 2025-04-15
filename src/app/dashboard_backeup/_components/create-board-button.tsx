"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateBoardButton() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createBoard = async () => {
    if (!title) return;
    setLoading(true);

    const res = await fetch("http://localhost:3001/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    const board = await res.json();
    router.push(`/dashboard/board/${board._id}`);
  };

  return (
    <div className='mb-6'>
      <input
        type='text'
        placeholder='Board title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='border p-2 rounded mr-2'
      />
      <button
        onClick={createBoard}
        disabled={loading}
        className='bg-black text-white px-4 py-2 rounded disabled:opacity-50'
      >
        {loading ? "Creating..." : "Create Board"}
      </button>
    </div>
  );
}
