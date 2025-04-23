"use client";
import { BoardProvider } from "@/context/BoardContext/BoardProvider";
import "../globals.css";
import ChatWidget from "../../widgets/chat.widget";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BoardProvider>
      <section className='w-screen h-screen overflow-hidden'>
        {children}
        <ChatWidget />
      </section>
    </BoardProvider>
  );
}
