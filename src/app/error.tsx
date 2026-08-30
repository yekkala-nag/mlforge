"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring/telemetry if configured
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 p-6 space-y-5 text-center">
        <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-100">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-400">
            An unexpected error occurred during execution. You can attempt to
            recover by retrying the action or returning home.
          </p>
        </div>

        {error.message && (
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 text-left">
            <p className="text-[11px] font-mono text-zinc-500 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-zinc-600 mt-1">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={reset}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-transparent px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
        </div>
      </Card>
    </div>
  );
}
