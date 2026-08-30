import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  FlaskConical,
  Code2,
  Building2,
  ServerCog,
  Rocket,
  Wrench,
  Database,
  Zap,
} from "lucide-react";

interface World {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: "available" | "locked" | "completed";
  href: string;
  moduleCount: number;
}

const worlds: World[] = [
  {
    id: "playground",
    name: "ML Playground",
    icon: <Play className="w-5 h-5" />,
    description: "Learn ML visually with interactive simulations",
    status: "available",
    href: "/playground",
    moduleCount: 7,
  },
  {
    id: "labs",
    name: "Algorithm Lab",
    icon: <FlaskConical className="w-5 h-5" />,
    description: "Deep-dive into each algorithm with focused experiments",
    status: "available",
    href: "/labs",
    moduleCount: 7,
  },
  {
    id: "code-studio",
    name: "Code Studio",
    icon: <Code2 className="w-5 h-5" />,
    description: "Write, edit, and run Python code alongside simulations",
    status: "available",
    href: "/playground?mode=code",
    moduleCount: 0,
  },
  {
    id: "from-scratch",
    name: "From Scratch",
    icon: <Wrench className="w-5 h-5" />,
    description: "Build algorithms with NumPy, compare with sklearn",
    status: "available",
    href: "/from-scratch",
    moduleCount: 4,
  },
  {
    id: "datasets",
    name: "Dataset Explorer",
    icon: <Database className="w-5 h-5" />,
    description: "Load, visualize, and understand datasets before modeling",
    status: "available",
    href: "/datasets",
    moduleCount: 3,
  },
  {
    id: "challenges",
    name: "Challenge Engine",
    icon: <Zap className="w-5 h-5" />,
    description: "Solve real ML problems under engineering constraints",
    status: "available",
    href: "/challenges",
    moduleCount: 4,
  },
  {
    id: "arena",
    name: "Model Arena",
    icon: <Building2 className="w-5 h-5" />,
    description: "Compare models side-by-side with real engineering trade-offs",
    status: "locked",
    href: "/arena",
    moduleCount: 0,
  },
  {
    id: "ops",
    name: "MLOps Control Room",
    icon: <ServerCog className="w-5 h-5" />,
    description: "Simulate production deployment, monitoring, and drift",
    status: "locked",
    href: "/ops",
    moduleCount: 0,
  },
  {
    id: "capstone",
    name: "Capstone Projects",
    icon: <Rocket className="w-5 h-5" />,
    description: "End-to-end ML engineering missions",
    status: "locked",
    href: "/capstone",
    moduleCount: 5,
  },
];

const skills = [
  { name: "Data Engineering", level: 82 },
  { name: "Algorithms", level: 91 },
  { name: "Model Building", level: 74 },
  { name: "Deep Learning", level: 51 },
  { name: "MLOps", level: 43 },
  { name: "Production", level: 34 },
];

export function LearningMap() {
  return (
    <div className="space-y-8">
      {/* Skill Graph */}
      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          ML Engineering Profile
        </h2>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">{skill.name}</span>
                <span className="font-mono text-zinc-500">{skill.level}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${skill.level}%`,
                    background:
                      skill.level >= 80
                        ? "linear-gradient(90deg, #22c55e, #16a34a)"
                        : skill.level >= 60
                          ? "linear-gradient(90deg, #3b82f6, #2563eb)"
                          : skill.level >= 40
                            ? "linear-gradient(90deg, #eab308, #ca8a04)"
                            : "linear-gradient(90deg, #ef4444, #dc2626)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
          <p className="text-xs text-zinc-400">
            <span className="text-amber-400">Insight:</span> Your algorithm skills are strong, but
            MLOps and production engineering need more work. Try the Algorithm Lab
            for deeper practice.
          </p>
        </div>
      </Card>

      {/* World Map */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Learning Worlds
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {worlds.map((world) => (
            <Link key={world.id} href={world.href}>
              <Card
                className={`p-5 transition-all hover:scale-[1.02] cursor-pointer ${
                  world.status === "locked"
                    ? "bg-zinc-900/50 border-zinc-800/50 opacity-60"
                    : "bg-zinc-900 border-zinc-800 hover:border-orange-500/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      world.status === "locked"
                        ? "bg-zinc-800 text-zinc-600"
                        : "bg-orange-600/20 text-orange-400"
                    }`}
                  >
                    {world.icon}
                  </div>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      world.status === "locked"
                        ? "bg-zinc-800 text-zinc-600"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {world.status === "locked" ? "Locked" : `${world.moduleCount} modules`}
                  </Badge>
                </div>
                <h3 className="font-semibold text-zinc-200 mb-1">{world.name}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {world.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Progression path */}
      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">
          Suggested Path
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          {["Python", "Data", "Statistics", "ML Fundamentals", "Algorithms", "Model Building", "Deep Learning", "ML Systems", "MLOps", "Production ML"].map(
            (step, i) => (
              <div key={step} className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    i < 4
                      ? "bg-emerald-900/50 text-emerald-400"
                      : i < 6
                        ? "bg-blue-900/50 text-blue-400"
                        : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {step}
                </Badge>
                {i < 9 && <span className="text-zinc-700">→</span>}
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
}
