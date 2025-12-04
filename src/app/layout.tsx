import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "송년회 2025 - 조 배정 및 추첨 시스템",
  description: "송년회 조 배정 및 추첨 번호 안내 서비스",
  keywords: ["송년회", "조 배정", "추첨", "QR코드"],
  openGraph: {
    title: "송년회 2025",
    description: "송년회 조 배정 및 추첨 번호 안내 서비스",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
