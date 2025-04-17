import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../layout/Header";
import ChatWidget from "../widgets/chat.widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orim - Collaborative Drawing Board",
  description: "Create and collaborate on drawings in real-time with Orim",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
