"use client";

import { usePyodide } from "@/hooks/usePyodide";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export function PyodideStatus() {
  const { status, progress, error, message } = usePyodide();

  if (status === "ready") return null;

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-4">
      <div className="flex items-center gap-3">
        {status === "error" ? (
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        ) : (
          <Loader2 className="w-5 h-5 text-orange-400 animate-spin flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-300">
            {status === "error"
              ? "Python environment failed to load"
              : message || "Loading Python environment..."}
          </p>
          {error && (
            <p className="text-xs text-red-400 mt-1 break-all">{error}</p>
          )}
          {status !== "error" && (
            <p className="text-xs text-zinc-500 mt-1">
              First load downloads ~20MB from CDN. Subsequent loads use cache.
            </p>
          )}
        </div>
        {status === "error" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex-shrink-0"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
        {progress > 0 && status !== "error" && (
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {Math.round(progress * 100)}%
          </Badge>
        )}
      </div>
      {progress > 0 && status !== "error" && (
        <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </Card>
  );
}
