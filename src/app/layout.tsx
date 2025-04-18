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
    <html lang='en' className='h-full'>
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className='flex flex-col h-full'>
            {/* Header - uncomment when ready */}
            {/* <Header /> */}

            {/* Main content area that will scroll */}
            <main className='flex-1 overflow-auto'>{children}</main>

            {/* Chat widget */}
            <ChatWidget />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
