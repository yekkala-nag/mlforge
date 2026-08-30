"use client";

import { DatasetExplorer } from "@/components/dataset-explorer/DatasetExplorer";
import { PlatformNav } from "@/components/layout/PlatformNav";

export default function DatasetsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PlatformNav />
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <DatasetExplorer />
      </main>
    </div>
  );
}
