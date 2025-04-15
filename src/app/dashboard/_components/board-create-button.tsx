"use client";

import { useState } from "react";

export default function BoardCreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // backend - create board

    try {
      const response = await fetch("http://localhost:3001/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to create board");
      }

      const data = await response.json();
      console.log("Created board:", data);
      setTitle("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
      >
        Create Board
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-96'>
            <h2 className='text-lg font-semibold mb-4'>Create New Board</h2>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                placeholder='Board title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full border p-2 rounded mb-4'
              />
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setIsOpen(false)}
                  className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
