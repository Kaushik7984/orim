import { AuthProvider } from "@/context/AuthContext";
import { BoardProvider } from "@/context/BoardContext/BoardProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orime Board",
  description: "Collaborative whiteboard application",
  icons: {
    icon: "/favicon1.png",
  },
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
          <BoardProvider>
            <div className='flex flex-col h-full'>
              <main className='flex-1 overflow-auto '>{children}</main>
            </div>
            <Toaster
              position='top-right'
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </BoardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
