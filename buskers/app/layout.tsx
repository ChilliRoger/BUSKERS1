import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Buskers",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Decentralized Music Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased"
      >
        <WalletProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 4000,
                },
                error: {
                  duration: 5000,
                },
              }}
            />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
