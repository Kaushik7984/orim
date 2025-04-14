"use client";

import { useState } from "react";

const mockBoards = [
  { id: "1", title: "Project Plan", createdAt: "2024-01-15" },
  { id: "2", title: "Design Sprint", createdAt: "2024-02-03" },
];

export default function BoardList() {
  const [boards, setBoards] = useState(mockBoards);

  if (boards.length === 0) {
    return (
      <div className='text-center text-gray-500 mt-20'>
        No boards yet. Click "Create" to add one!
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Your Boards</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {boards.map((board) => (
          <li
            key={board.id}
            className='p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer'
          >
            <h3 className='font-bold text-lg'>{board.title}</h3>
            <p className='text-sm text-gray-500'>Created: {board.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
