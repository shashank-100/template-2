import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export const metadata = {
  title: 'Voice Notes App',
  description: 'Record and transcribe your voice notes easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
