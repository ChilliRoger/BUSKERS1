import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/components/RoleProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RoleSelectionModal } from "@/components/RoleSelectionModal";
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
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-inter antialiased bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-gray-100">
        <RoleProvider>
          <WalletProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <RoleSelectionModal />
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
        </RoleProvider>
      </body>
    </html>
  );
}
