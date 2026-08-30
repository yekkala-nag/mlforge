"use client";

import { CapstoneProjects } from "@/components/capstone/CapstoneProjects";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function CapstonePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <CapstoneProjects />
      </main>
    </div>
  );
}
