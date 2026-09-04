import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0a1628",
};

export const metadata: Metadata = {
  title: "Sallam Skis | Premium Jet Ski Experiences in Miami, Florida",
  description:
    "Premium Yamaha WaveRunner rentals, guided tours, and unforgettable jet ski adventures in Miami, Florida. Book your ride today!",
  keywords: [
    "jet ski rental",
    "Miami jet ski",
    "WaveRunner rental",
    "Sallam Skis",
    "water sports Miami",
    "jet ski tours Florida",
  ],
  openGraph: {
    title: "Sallam Skis | Premium Jet Ski Experiences",
    description: "Ride the waves with Florida's premier jet ski experience.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sallam Skis | Premium Jet Ski Experiences",
    description: "Ride the waves with Florida's premier jet ski experience.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
