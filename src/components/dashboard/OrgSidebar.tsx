"use client";

import { useEffect, useState } from "react";

export default function OrgSidebar() {
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/organizations", { credentials: "include" })
      .then((res) => res.json())
      .then(setOrgs);
  }, []);

  return (
    <aside className='w-64 bg-gray-100 p-4 border-r overflow-y-auto'>
      <h2 className='font-semibold text-lg mb-4'>Organizations</h2>
      <ul className='space-y-2'>
        {orgs.map((org: any, index: number) => (
          <li
            key={org.id || `${org.name}-${index}`}
            className='hover:underline cursor-pointer'
          >
            {org.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
