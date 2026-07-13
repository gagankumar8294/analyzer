import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InstaAnalyzer — Instagram Profile Intelligence",
    template: "%s | InstaAnalyzer",
  },
  description:
    "AI-powered Instagram profile analyzer. Get deep insights, competitor analysis, content strategy, and a 90-day content calendar from any public Instagram profile.",
  keywords: [
    "instagram analyzer",
    "instagram insights",
    "competitor analysis",
    "content strategy",
    "instagram growth",
    "social media analytics",
  ],
  authors: [{ name: "InstaAnalyzer" }],
  openGraph: {
    title: "InstaAnalyzer — Instagram Profile Intelligence",
    description:
      "AI-powered Instagram profile analyzer. Deep insights, competitor analysis & content strategy.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaAnalyzer — Instagram Profile Intelligence",
    description: "AI-powered Instagram profile analyzer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
