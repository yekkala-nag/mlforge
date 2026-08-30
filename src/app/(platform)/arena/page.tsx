"use client";

import { ModelArena } from "@/components/arena/ModelArena";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function ArenaPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <ModelArena />
      </main>
    </div>
  );
}
