export interface Parameter {
  id: string;
  label: string;
  type: "slider" | "dropdown" | "toggle";
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string | number }[];
  default: number | string | boolean;
  description?: string;
}

export interface DatasetPoint {
  x: number[];
  y: number;
}

export interface SimResult {
  predictions?: number[];
  points?: { x: number; y: number; predicted?: number; cluster?: number }[];
  line?: { x: number; y: number }[] | { x1: number; y1: number; x2: number; y2: number }[];
  decisionBoundary?: number[][];
  centroids?: { x: number; y: number }[];
  supportVectors?: { x: number; y: number }[];
  lossHistory?: number[];
  metrics: Record<string, number>;
  intermediate?: {
    weight?: number;
    bias?: number;
    weights?: number[];
    k?: number;
    C?: number;
    kernel?: string;
    [key: string]: unknown;
  };
  snapshots?: { step: number; loss: number; boundary: number[][]; grid_x: number[]; grid_y: number[] }[];
  visualization?: VisualizationData;
  code?: string;
}

export interface VisualizationData {
  points: { x: number; y: number; predicted?: number; cluster?: number }[];
  line?: { x1: number; y1: number; x2: number; y2: number }[];
  decisionBoundary?: number[][];
  lossHistory?: number[];
  treeNodes?: TreeNode[];
  centroids?: { x: number; y: number }[];
  featureImportance?: { feature: string; importance: number }[];
  confusionMatrix?: number[][];
}

export interface TreeNode {
  id: string;
  feature?: number;
  threshold?: number;
  value?: number;
  left?: string;
  right?: string;
  isLeaf: boolean;
  samples?: number;
  class?: number;
}

export interface Simulation {
  id: string;
  name: string;
  description: string;
  icon: string;
  parameters: Parameter[];
  pythonCode: string;
  defaultParams: Record<string, number | string | boolean>;
}

export interface SimulationState {
  params: Record<string, number | string | boolean>;
  result: SimResult | null;
  isRunning: boolean;
  isTraining: boolean;
  trainingStep: number;
}
