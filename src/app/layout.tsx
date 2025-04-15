import "./globals.css";
import { ReactNode } from "react";
import { OrgProvider } from "@/context/OrgContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <OrgProvider>{children}</OrgProvider>
      </body>
    </html>
  );
}
