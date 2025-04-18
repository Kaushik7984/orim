import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/layout/Header"; 
import ChatWidget from "../widgets/chat.widget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ORIUM Board",
  description: "Collaborative whiteboard application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <Header /> */}
          <main>{children}</main>
        </AuthProvider>
        <ChatWidget />
      </body>
    </html>
  );
}
