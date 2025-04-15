"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import OrgSidebar from "@/components/dashboard/OrgSidebar";
import { getCurrentUser } from "@/lib/api";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      if (user) {
        setAuthenticated(true);
      } else {
        router.push("/login");
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading)
    return <div className='p-8 text-center'>Checking authentication...</div>;
  if (!authenticated) return null;

  return (
    <div className='flex h-screen overflow-hidden'>
      <OrgSidebar />
      <div className='flex-1 flex flex-col'>
        <Navbar />
        <main className='p-4 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
