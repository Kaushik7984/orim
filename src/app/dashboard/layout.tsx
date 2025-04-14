import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      <aside className='w-64 bg-gray-100 p-4 hidden md:block'>
        <div className='font-bold text-lg'>Sidebar</div>
      </aside>

      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
