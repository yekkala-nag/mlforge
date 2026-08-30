"use client";

import { SystemBuilder } from "@/components/system-builder/SystemBuilder";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function SystemBuilderPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <SystemBuilder />
      </main>
    </div>
  );
}
