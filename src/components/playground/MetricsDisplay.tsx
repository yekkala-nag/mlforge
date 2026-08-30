"use client";

interface MetricsDisplayProps {
  metrics: Record<string, number>;
}

function formatMetricName(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getMetricColor(key: string, value: number): string {
  if (key.includes("accuracy") || key.includes("r_squared")) {
    if (value >= 0.9) return "text-emerald-400";
    if (value >= 0.7) return "text-amber-400";
    return "text-red-400";
  }
  if (key.includes("loss") || key.includes("mse") || key.includes("mae")) {
    if (value <= 0.1) return "text-emerald-400";
    if (value <= 1) return "text-amber-400";
    return "text-red-400";
  }
  return "text-zinc-200";
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(metrics).map(([key, value]) => (
        <div
          key={key}
          className="flex flex-col items-center rounded-lg bg-zinc-900 p-3"
        >
          <span className="text-xs text-zinc-500">{formatMetricName(key)}</span>
          <span className={`text-lg font-mono font-bold ${getMetricColor(key, value)}`}>
            {typeof value === "number" ? value.toFixed(4) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}
