"use client";
import { BoardProvider } from "@/context/BoardContext/BoardProvider";
import "../globals.css";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BoardProvider>
      <section className='w-screen h-screen overflow-hidden'>
        {children}
      </section>
    </BoardProvider>
  );
}
