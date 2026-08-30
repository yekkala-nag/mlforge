import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold">
              M
            </div>
            <span className="font-semibold text-lg">ML Forge</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/learn" className="text-zinc-400 hover:text-white transition-colors">
              Learning Map
            </Link>
            <Link href="/playground" className="text-zinc-400 hover:text-white transition-colors">
              Playground
            </Link>
            <Link href="/arena" className="text-zinc-400 hover:text-white transition-colors">
              Arena
            </Link>
            <Link href="/ops" className="text-zinc-400 hover:text-white transition-colors">
              MLOps
            </Link>
            <Link href="/settings" className="text-zinc-400 hover:text-white transition-colors">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <Badge
          variant="secondary"
          className="bg-zinc-800 text-zinc-400 mb-6 px-4 py-1"
        >
          Interactive ML Engineering Laboratory
        </Badge>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl font-bold mb-8">
          M
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            ML Forge
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-8 leading-relaxed">
          See the algorithm working. Change it. Break it. Write it. Deploy it.
          <br />
          The interactive environment to understand, build, ship, and operate
          machine-learning systems.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/playground">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8"
            >
              Enter Playground
            </Button>
          </Link>
          <Link href="/learn">
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              View Learning Map
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <FeatureCard
            icon="🔬"
            title="Interactive Simulations"
            description="Manipulate algorithms in real-time. Watch decision boundaries move, loss curves drop, and models learn."
          />
          <FeatureCard
            icon="💥"
            title="Break the Model"
            description="Intentionally introduce failures. Diagnose noise, drift, and overfitting like a real ML engineer."
          />
          <FeatureCard
            icon="🚀"
            title="Ship to Production"
            description="The same model becomes a production API. Monitor latency, drift, and accuracy in real-time."
          />
        </div>

        {/* Worlds preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
          <WorldLink href="/playground" icon="🎮" title="ML Playground" />
          <WorldLink href="/from-scratch" icon="🔧" title="From Scratch" />
          <WorldLink href="/datasets" icon="📊" title="Dataset Explorer" />
          <WorldLink href="/challenges" icon="⚡" title="Challenges" />
          <WorldLink href="/arena" icon="⚔️" title="Model Arena" />
          <WorldLink href="/ops" icon="🖥️" title="MLOps Room" />
          <WorldLink href="/capstone" icon="🎯" title="Capstone Projects" />
          <WorldLink href="/learn" icon="🗺️" title="Learning Map" />
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-600">
        ML Forge — Learn ML by building it
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-left hover:border-zinc-700 transition-colors">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

function WorldLink({
  href,
  icon,
  title,
}: {
  href: string;
  icon: string;
  title: string;
}) {
  return (
    <Link href={href}>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-left hover:border-orange-500/50 transition-colors cursor-pointer">
        <div className="text-xl mb-1">{icon}</div>
        <div className="text-sm font-medium text-zinc-300">{title}</div>
      </div>
    </Link>
  );
}
