import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Compass,
  Play,
  Sigma,
  Network,
  Home,
  Database,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <Card className="max-w-lg w-full bg-zinc-900 border-zinc-800 p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-950/40 border border-orange-700/40 flex items-center justify-center mx-auto text-orange-400">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-mono text-orange-400 mb-1">
            404 — Not Found
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Lost in Parameter Space
          </h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            The page or model component you are looking for does not exist or
            has been relocated.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-left pt-2">
          <Link
            href="/playground"
            className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/40 transition-colors text-sm text-zinc-200"
          >
            <Play className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <div className="font-medium text-xs">Playground</div>
              <div className="text-[10px] text-zinc-500">Interactive ML</div>
            </div>
          </Link>

          <Link
            href="/math"
            className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/40 transition-colors text-sm text-zinc-200"
          >
            <Sigma className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-medium text-xs">Math Geometry</div>
              <div className="text-[10px] text-zinc-500">Loss & Boundaries</div>
            </div>
          </Link>

          <Link
            href="/system-builder"
            className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/40 transition-colors text-sm text-zinc-200"
          >
            <Network className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="font-medium text-xs">System Builder</div>
              <div className="text-[10px] text-zinc-500">Pipeline Design</div>
            </div>
          </Link>

          <Link
            href="/datasets"
            className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/40 transition-colors text-sm text-zinc-200"
          >
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-medium text-xs">Datasets</div>
              <div className="text-[10px] text-zinc-500">Data Exploration</div>
            </div>
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Overview
          </Link>
        </div>
      </Card>
    </div>
  );
}
