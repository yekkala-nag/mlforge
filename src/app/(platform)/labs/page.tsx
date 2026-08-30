"use client";

import { LearningMap } from "@/components/learning-map/LearningMap";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <LearningMap />
      </main>
    </div>
  );
}
