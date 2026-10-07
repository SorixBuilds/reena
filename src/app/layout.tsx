import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, JetBrains_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBar from "@/components/StickyBar";
import SmoothScroll from "@/components/SmoothScroll";

// variable axes need weight: "variable" — this gives us wdth 115–125 for the
// expanded, engineered display setting
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  weight: "variable",
  display: "swap",
  preload: true,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
  display: "swap",
});

// loaded lazily and never preloaded — the Urdu toggle is opt-in
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  weight: ["400"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reena-demo.netlify.app"),
  title: {
    default: "REENA · World Class — Stabilizers, Solar Inverters & Wires",
    template: "%s · REENA",
  },
  description:
    "Stabilizers, solar inverters, MPPT chargers and wires. Made in Pakistan.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "REENA · World Class",
    description:
      "Stabilizers, solar inverters, MPPT chargers and wires. Made in Pakistan.",
    images: ["/brand/og.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "REENA · World Class",
    description:
      "Stabilizers, solar inverters, MPPT chargers and wires. Made in Pakistan.",
    images: ["/brand/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/brand/reena-shield.svg", type: "image/svg+xml" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050A1A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${interTight.variable} ${jetbrains.variable} ${nastaliq.variable}`}
    >
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <link
          rel="preload"
          as="image"
          href="/img/hero-coil-1920.avif"
          type="image/avif"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/img/hero-coil-portrait.avif"
          type="image/avif"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        {/* reveal animations start hidden — without JS they must still be readable */}
        <noscript>
          <style>{`
            [style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; }
            .mask-line { overflow: visible !important; }
          `}</style>
        </noscript>
      </head>
      <body>
        <Providers>
          <SmoothScroll />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-reena-red focus:px-5 focus:py-3 focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <StickyBar />
        </Providers>
      </body>
    </html>
  );
}
