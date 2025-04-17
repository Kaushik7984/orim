"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Board } from "../../../../backend/src-old/boards/board.schema";

const mockBoards = [
  { id: "1", title: "Project Plan", createdAt: "2024-01-15" },
  { id: "2", title: "Design Sprint", createdAt: "2024-02-03" },
];

export default function BoardList() {
  const router = useRouter();
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch("http://localhost:3001/boards");
        if (!response.ok) {
          throw new Error("Failed to fetch boards");
        }
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        setError("There was an error fetching the boards.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  if (loading) {
    return <div className='text-center text-gray-500 mt-20'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center text-red-500 mt-20'>{error}</div>;
  }

  if (boards.length === 0) {
    return (
      <div className='text-center text-gray-500 mt-20'>
        No boards yet. Click "Create" to add one!
      </div>
    );
  }

  const handleClick = (_id: string) => {
    router.push(`/dashboard/board/${_id}`);
  };

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Your Boards</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {boards.map((board) => (
          <li
            key={board._id}
            onClick={() => handleClick(board._id)}
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
