"use client";

import type { Parameter } from "@/lib/types/simulation";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

interface ParameterControlsProps {
  parameters: Parameter[];
  values: Record<string, number | string | boolean>;
  onChange: (key: string, value: number | string | boolean) => void;
  disabled?: boolean;
}

export function ParameterControls({
  parameters,
  values,
  onChange,
  disabled,
}: ParameterControlsProps) {
  return (
    <div className="space-y-5">
      {parameters.map((param) => (
        <div key={param.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">
              {param.label}
            </label>
            <Badge variant="secondary" className="font-mono text-xs">
              {String(values[param.id] ?? param.default)}
            </Badge>
          </div>
          {param.type === "slider" && typeof param.min === "number" && typeof param.max === "number" && (
            <Slider
              value={[Number(values[param.id] ?? param.default)]}
              onValueChange={(val) => {
                const v = Array.isArray(val) ? val[0] : val;
                const rounded = param.step && param.step < 1
                  ? Math.round(v / param.step) * param.step
                  : v;
                onChange(param.id, rounded);
              }}
              min={param.min}
              max={param.max}
              step={param.step ?? 1}
              disabled={disabled}
              className="w-full"
            />
          )}
          {param.description && (
            <p className="text-xs text-zinc-500">{param.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
