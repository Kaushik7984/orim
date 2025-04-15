"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <nav className='w-full h-14 bg-white shadow px-4 flex items-center justify-between'>
      <div className='text-lg font-bold'>Miro Clone</div>
      <div>
        {user ? (
          <div className='text-sm'>Hello, {user.name}</div>
        ) : (
          <div className='text-sm text-gray-400'>Not logged in</div>
        )}
      </div>
    </nav>
  );
}
