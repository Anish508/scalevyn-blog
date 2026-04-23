import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.scalevyn.com"),
  title: {
    default: "Scalevyn Blog — Tech & Digital Marketing Insights",
    template: "%s | Scalevyn Blog",
  },
  description:
    "Expert insights on web development, SEO, digital marketing, and growth strategies from the Scalevyn team.",
  keywords: [
    "tech blog",
    "digital marketing",
    "web development",
    "SEO tips",
    "Next.js",
    "startup growth",
    "Scalevyn",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Scalevyn Blog",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", creator: "@scalevyn" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-surface antialiased">
        {children}
      </body>
    </html>
  );
}
