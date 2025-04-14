"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockOrganizations = [
  { id: "org1", name: "Personal Workspace" },
  { id: "org2", name: "Team Project Alpha" },
];

export default function OrgSidebar() {
  const [selectedOrg, setSelectedOrg] = useState("org1");

  return (
    <div>
      <h2 className='text-sm font-semibold text-gray-500 mb-2'>
        Organizations
      </h2>
      <ul className='space-y-2'>
        {mockOrganizations.map((org) => (
          <li key={org.id}>
            <button
              className={cn(
                "w-full text-left px-3 py-2 rounded-md",
                selectedOrg === org.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              )}
              onClick={() => setSelectedOrg(org.id)}
            >
              {org.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
