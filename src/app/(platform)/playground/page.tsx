"use client";

import Link from "next/link";
import { usePlaygroundStore } from "@/stores/playground-store";
import { simulations } from "@/lib/simulations";
import { SimulationRunner } from "@/components/playground/SimulationRunner";
import { AIMentor } from "@/components/ai-mentor/AIMentor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Code2, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { CodeStudio } from "@/components/playground/CodeStudio";
import { GuidedTutorial } from "@/components/playground/GuidedTutorial";
import { PyodideStatus } from "@/components/pyodide/PyodideStatus";

export default function PlaygroundPage() {
  const { activeSimulation, setActiveSimulation, params, result } =
    usePlaygroundStore();
  const [mode, setMode] = useState<"visual" | "code">("visual");
  const [algoOpen, setAlgoOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeSimulation && simulations.length > 0) {
      setActiveSimulation(simulations[0]);
    }
  }, [activeSimulation, setActiveSimulation]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAlgoOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shrink-0">
        <div className="max-w-[1800px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold">
                M
              </div>
              <span className="font-semibold text-sm hidden sm:inline">ML Forge</span>
            </Link>
            <Separator orientation="vertical" className="h-4 bg-zinc-700" />
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-xs">
              Playground
            </Badge>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto min-w-0">
            {/* Mode toggle */}
            <div className="flex bg-zinc-800 rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => setMode("visual")}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  mode === "visual"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setMode("code")}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                  mode === "code"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Code2 className="w-3 h-3" />
                Code
              </button>
            </div>

            {/* Algorithm dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlgoOpen(!algoOpen)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                <span className="mr-1">{activeSimulation?.icon}</span>
                {activeSimulation?.name || "Algorithm"}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              {algoOpen && (
                <div className="absolute top-full left-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 min-w-[200px]">
                  {simulations.map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => {
                        setActiveSimulation(sim);
                        setAlgoOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-zinc-700 transition-colors ${
                        activeSimulation?.id === sim.id
                          ? "text-orange-400 bg-zinc-700/50"
                          : "text-zinc-300"
                      }`}
                    >
                      <span>{sim.icon}</span>
                      {sim.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="h-4 bg-zinc-700 shrink-0" />

            {/* Nav links */}
            {[
              { href: "/math", label: "Math" },
              { href: "/from-scratch", label: "From Scratch" },
              { href: "/datasets", label: "Datasets" },
              { href: "/challenges", label: "Challenges" },
              { href: "/arena", label: "Arena" },
              { href: "/ops", label: "MLOps" },
              { href: "/system-builder", label: "Builder" },
              { href: "/settings", label: "Settings" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white text-xs whitespace-nowrap"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1800px] mx-auto px-6 py-6">
            <PyodideStatus />
            {activeSimulation && (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-1">
                    {activeSimulation.icon} {activeSimulation.name}
                  </h1>
                  <p className="text-zinc-400 text-sm">
                    {activeSimulation.description}
                  </p>
                </div>
                {mode === "visual" ? (
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3">
                      <SimulationRunner />
                    </div>
                    <div>
                      <GuidedTutorial algorithmId={activeSimulation.id} />
                    </div>
                  </div>
                ) : (
                  <div className="h-[calc(100vh-200px)]">
                    <CodeStudio />
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* AI Mentor sidebar */}
        <aside className="w-80 shrink-0 border-l border-zinc-800 overflow-hidden hidden lg:block">
          <AIMentor
            context={{
              simulationId: activeSimulation?.id,
              params: params as Record<string, unknown>,
              metrics: result?.metrics,
            }}
          />
        </aside>
      </div>
    </div>
  );
}
