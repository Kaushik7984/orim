"use client";
import { BoardProvider } from "@/context/BoardContext";

export default function BoardSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BoardProvider>
      <section className="w-screen h-screen bg-white overflow-hidden">
        {children}
      </section>
    </BoardProvider>
  );
} 