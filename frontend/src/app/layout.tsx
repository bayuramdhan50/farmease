import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FarmEase - Aplikasi Pencatatan Hasil Panen",
  description: "Aplikasi untuk mencatat dan menganalisis hasil panen pertanian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-gray-50">
        <ToastProvider>
          <div className="flex-grow">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
