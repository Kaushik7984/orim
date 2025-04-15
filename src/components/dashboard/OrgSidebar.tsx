"use client";

import { useOrg } from "@/context/OrgContext";
import clsx from "clsx";

export default function OrgSidebar() {
  const { orgs, orgId, setOrgId } = useOrg();

  return (
    <aside className='w-64 bg-gray-100 p-4 border-r overflow-y-auto'>
      <h2 className='font-semibold text-lg mb-4'>Organizations</h2>
      <ul className='space-y-2'>
        {orgs.map((org: any) => (
          <li
            key={org.id}
            className={clsx(
              "cursor-pointer p-2 rounded hover:bg-gray-200",
              org.id === orgId && "bg-gray-300 font-semibold"
            )}
            onClick={() => setOrgId(org.id)}
          >
            {org.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
