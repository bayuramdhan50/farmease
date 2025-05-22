import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2E7D32',
}

export const metadata: Metadata = {
  title: "FarmEase - Aplikasi Pencatatan Hasil Panen",
  description: "Aplikasi modern untuk mencatat dan menganalisis hasil panen pertanian dengan fitur laporan komprehensif untuk produktivitas yang lebih baik",
  keywords: ["aplikasi pertanian", "pencatatan panen", "analisis hasil panen", "farming", "sustainable agriculture", "SDGs"],
  authors: [{ name: "FarmEase Team" }],
  creator: "FarmEase",
  publisher: "FarmEase",
  applicationName: "FarmEase",
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://farmease.com',
    title: 'FarmEase - Aplikasi Pencatatan Hasil Panen',
    description: 'Aplikasi modern untuk mencatat dan menganalisis hasil panen pertanian',
    siteName: 'FarmEase',
    images: [
      {
        url: '/images/farmease-og.jpg',
        width: 1200,
        height: 630,
        alt: 'FarmEase Dashboard'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmEase - Aplikasi Pencatatan Hasil Panen',
    description: 'Aplikasi modern untuk mencatat dan menganalisis hasil panen pertanian',
    images: ['/images/farmease-twitter.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  category: 'agriculture',
  verification: {
    google: 'verification_token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 mt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
