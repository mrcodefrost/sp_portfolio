import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SOCIALS } from "@/constants/socials";

const inter = Inter({ subsets: ["latin"] });

const SITE_TITLE = "Daksh Nauni | Full-Stack & Mobile Engineer";
const SITE_DESCRIPTION =
  "Daksh Nauni - Full-Stack & Mobile Engineer, open to remote roles, contract work, and freelance projects.";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Daksh Nauni",
  jobTitle: "Full-Stack & Mobile Engineer",
  url: "https://daksh.io",
  email: "mailto:mr.codefrost@gmail.com",
  sameAs: SOCIALS.filter((social) => !social.href.startsWith("mailto")).map(
    (social) => social.href
  ),
};

export const metadata: Metadata = {
  metadataBase: new URL("https://daksh.io"),
  title: {
    default: SITE_TITLE,
    template: "%s | Daksh Nauni",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://daksh.io",
    siteName: "Daksh Nauni",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
