"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getServerOnlineSnapshot() {
  return true;
}

export function OfflineIndicator() {
  const isOnline = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getServerOnlineSnapshot
  );

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for updates periodically
          const intervalId = setInterval(() => {
            reg.update().catch(() => {});
          }, 60 * 60 * 1000);
          return () => clearInterval(intervalId);
        })
        .catch(() => {});
    }
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

