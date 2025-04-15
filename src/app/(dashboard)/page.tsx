"use client";

import { useEffect, useState } from "react";
import { getBoards } from "@/lib/api";
import BoardList from "@/components/dashboard/BoardList";

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState("demo-org-id"); // Replace with real org logic

  useEffect(() => {
    async function fetchBoards() {
      const data = await getBoards(orgId);
      setBoards(data);
      setLoading(false);
    }
    fetchBoards();
  }, [orgId]);

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Your Boards</h1>
      {loading ? <p>Loading...</p> : <BoardList boards={boards} />}
    </div>
  );
}
