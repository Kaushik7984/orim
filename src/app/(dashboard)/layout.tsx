"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import OrgSidebar from "@/components/dashboard/OrgSidebar";
import { getCurrentUser } from "@/lib/api";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (!isAuthenticated) return null;

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
