"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/playground", label: "Playground" },
  { href: "/math", label: "Math" },
  { href: "/from-scratch", label: "From Scratch" },
  { href: "/datasets", label: "Datasets" },
  { href: "/challenges", label: "Challenges" },
  { href: "/arena", label: "Arena" },
  { href: "/ops", label: "MLOps" },
  { href: "/system-builder", label: "Builder" },
  { href: "/agents", label: "Agents" },
  { href: "/features", label: "Features" },
  { href: "/settings", label: "Settings" },
];

export function PlatformNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold">
            M
          </div>
          <span className="font-semibold text-sm hidden sm:inline">ML Forge</span>
        </Link>
        <Separator orientation="vertical" className="h-4 bg-zinc-700 shrink-0" />
        <nav className="flex items-center gap-0.5 overflow-x-auto min-w-0">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs whitespace-nowrap ${
                  pathname === link.href
                    ? "text-orange-400 bg-zinc-800"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
