import { ReactNode } from "react";
import Navbar from "@/components/shared/Navbar";
import OrgSidebar from "@/components/dashboard/OrgSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-screen overflow-hidden'>
      <OrgSidebar />
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='p-4 overflow-auto'> {children} </main>
      </div>
    </div>
  );
}
