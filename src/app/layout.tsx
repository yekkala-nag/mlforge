import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OfflineIndicator } from "@/components/offline/OfflineIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ML Forge — Interactive ML Engineering Laboratory",
    template: "%s | ML Forge",
  },
  description:
    "The interactive environment to understand, build, ship, and operate machine-learning systems entirely in your browser.",
  keywords: [
    "machine learning",
    "ML engineering",
    "interactive visualization",
    "decision boundary",
    "gradient descent",
    "Pyodide",
    "scikit-learn",
    "neural networks",
  ],
  authors: [{ name: "ML Forge Team" }],
  creator: "ML Forge",
  publisher: "ML Forge",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ML Forge — Interactive ML Engineering Laboratory",
    description:
      "Interactive playground to master machine learning algorithms, visualize decision geometry, and build end-to-end ML pipelines in the browser.",
    type: "website",
    locale: "en_US",
    siteName: "ML Forge",
  },
  twitter: {
    card: "summary_large_image",
    title: "ML Forge — Interactive ML Engineering Laboratory",
    description:
      "Interactive browser-based ML laboratory with pure JS & Python simulations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
        {children}
        <OfflineIndicator />
      </body>
    </html>
  );
}
