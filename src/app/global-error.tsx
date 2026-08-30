"use client";

import { useEffect } from "react";
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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical root error:", error);
  }, [error]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex items-center justify-center bg-zinc-950 text-white p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-100">Critical Error</h2>
          <p className="text-sm text-zinc-400">
            A fatal error occurred at the application root level.
          </p>
          {error.message && (
            <div className="bg-zinc-950 p-3 rounded-lg text-left border border-zinc-800 text-xs font-mono text-red-400 break-all">
              {error.message}
            </div>
          )}
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Restart Application
          </button>
        </div>
      </body>
    </html>
  );
}
