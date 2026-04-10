import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://dakshnauni.com"),
  title: {
    default: "Daksh Nauni — Full Stack & Mobile Developer",
    template: "%s | Daksh Nauni",
  },
  description:
    "Full Stack and Mobile Developer specialising in Flutter, React, Node.js and cloud platforms. Explore projects, skills, and more.",
  openGraph: {
    title: "Daksh Nauni — Full Stack & Mobile Developer",
    description:
      "Full Stack and Mobile Developer specialising in Flutter, React, Node.js and cloud platforms.",
    url: "https://dakshnauni.com",
    siteName: "Daksh Nauni",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daksh Nauni — Full Stack & Mobile Developer",
    description:
      "Full Stack and Mobile Developer specialising in Flutter, React, Node.js and cloud platforms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
