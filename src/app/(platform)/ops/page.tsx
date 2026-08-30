"use client";

import { MLOpsRoom } from "@/components/ops/MLOpsRoom";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <MLOpsRoom />
      </main>
    </div>
  );
}
