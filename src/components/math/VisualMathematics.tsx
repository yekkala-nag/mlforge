"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradientDescentVisualizer } from "./GradientDescentVisualizer";
import { DecisionBoundaryGeometry } from "./DecisionBoundaryGeometry";
import { TrendingDown, Circle } from "lucide-react";

export function VisualMathematics() {
  const [activeTab, setActiveTab] = useState("gradient");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="gradient" className="text-xs">
            <TrendingDown className="w-3 h-3 mr-1" />
            Gradient Descent
          </TabsTrigger>
          <TabsTrigger value="boundary" className="text-xs">
            <Circle className="w-3 h-3 mr-1" />
            Decision Boundaries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gradient">
          <GradientDescentVisualizer />
        </TabsContent>

        <TabsContent value="boundary">
          <DecisionBoundaryGeometry />
        </TabsContent>
      </Tabs>
    </div>
  );
}
