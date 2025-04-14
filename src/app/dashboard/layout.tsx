import React from "react";
import OrgSidebar from "./_components/org-sidebar";
import Navbar from "./_components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      <aside className='w-64 bg-gray-100 p-4 hidden md:block'>
        <OrgSidebar />
      </aside>

      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}
