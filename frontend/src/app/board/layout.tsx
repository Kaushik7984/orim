import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ProtectedRoute>
          <main>{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
