import type { Metadata } from "next";
import { Fraunces, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { profile } from "@/config/linktree";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: profile.title,
  description: profile.description,
  openGraph: {
    title: profile.title,
    description: profile.description,
    images: ["/assets/dorms-community.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
