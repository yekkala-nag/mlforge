"use client";

import { FromScratchMode } from "@/components/from-scratch/FromScratchMode";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function FromScratchPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <FromScratchMode />
      </main>
    </div>
  );
}
