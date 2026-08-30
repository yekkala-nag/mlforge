"use client";

import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { ProgressTracker } from "@/components/progress/ProgressTracker";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SettingsPanel />
          <ProgressTracker />
        </div>
      </main>
    </div>
  );
}
