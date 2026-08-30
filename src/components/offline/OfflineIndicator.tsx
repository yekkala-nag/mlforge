"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Download, RefreshCw } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setIsOfflineReady(true);
          // Check for updates periodically
          setInterval(() => reg.update(), 60 * 60 * 1000);
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Status badge in corner */}
      <div className="fixed bottom-4 right-4 z-50">
        <Badge
          variant="secondary"
          className={`${
            isOnline
              ? "bg-emerald-900/50 text-emerald-400"
              : "bg-amber-900/50 text-amber-400"
          }`}
        >
          {isOnline ? (
            <Wifi className="w-3 h-3 mr-1" />
          ) : (
            <WifiOff className="w-3 h-3 mr-1" />
          )}
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>

      {/* Offline banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-900/80 text-amber-200 text-center py-2 text-sm backdrop-blur-sm">
          You&apos;re offline. Some features may be limited. ML simulations run
          entirely in your browser.
        </div>
      )}
    </>
  );
}
