/**
 * Pure JavaScript ML algorithm implementations.
 * These run instantly without Pyodide, giving immediate interactivity.
 * Pyodide loads in background for the Code Studio editor.
 */

export interface SimulationResult {
  points: { x: number; y: number; cluster?: number; predicted?: number }[];
  line?: { x: number; y: number }[];
  decisionBoundary?: number[][];
  centroids?: { x: number; y: number }[];
  supportVectors?: { x: number; y: number }[];
  lossHistory: number[];
  metrics: Record<string, number>;
  intermediate?: Record<string, unknown>;
  snapshots?: { step: number; loss: number; boundary: number[][]; grid_x: number[]; grid_y: number[] }[];
}

function randn(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function randnSeeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646 * 2 - 1;
  };
}

export function runLinearRegression(params: Record<string, number>): SimulationResult {
  const lr = params.learning_rate ?? 0.05;
  const iters = params.iterations ?? 100;
  const reg = params.regularization ?? 0;
  const noise = params.noise ?? 0.5;
  const n = params.n_samples ?? 100;
  const rng = randnSeeded(params.seed ?? 42);

  const X: number[] = [];
  const y: number[] = [];
  for (let i = 0; i < n; i++) {
    const xi = rng() * 5;
    X.push(xi);
    y.push(2.5 * xi + 1.0 + rng() * noise);
  }

  const xMean = X.reduce((a, b) => a + b, 0) / n;
  const xStd = Math.sqrt(X.reduce((a, b) => a + (b - xMean) ** 2, 0) / n) + 1e-8;
  const Xn = X.map((x) => (x - xMean) / xStd);

  let w = 0, b = 0;
  const lossHistory: number[] = [];
  const snapshots: { step: number; w: number; b: number; loss: number; line: { x: number; y: number }[] }[] = [];
  const snapInterval = Math.max(1, Math.floor(iters / 20));

  for (let step = 0; step < iters; step++) {
    const yp = Xn.map((xi) => w * xi + b);
    const err = yp.map((p, i) => p - y[i]);
    const mse = err.reduce((a, e) => a + e * e, 0) / n + reg * w * w;
    lossHistory.push(mse);

    const dw = (2 / n) * err.reduce((a, e, i) => a + e * Xn[i], 0) + 2 * reg * w;
    const db = (2 / n) * err.reduce((a, e) => a + e, 0);
    w -= lr * dw;
    b -= lr * db;

    if (step % snapInterval === 0 || step === iters - 1) {
      const xl = linspace(X.reduce((a, b) => Math.min(a, b)), X.reduce((a, b) => Math.max(a, b)), 100);
      snapshots.push({
        step, w, b, loss: mse,
        line: xl.map((x) => ({ x, y: w * ((x - xMean) / xStd) + b })),
      });
    }
  }

  const yPred = Xn.map((xi) => w * xi + b);
  const xl = linspace(X.reduce((a, b) => Math.min(a, b)), X.reduce((a, b) => Math.max(a, b)), 100);
  const yMean = y.reduce((a, b) => a + b, 0) / n;
  const ssRes = y.reduce((a, yi, i) => a + (yi - yPred[i]) ** 2, 0);
  const ssTot = y.reduce((a, yi) => a + (yi - yMean) ** 2, 0);

  return {
    points: X.map((xi, i) => ({ x: xi, y: y[i], predicted: yPred[i] })),
    line: xl.map((x) => ({ x, y: w * ((x - xMean) / xStd) + b })),
    lossHistory,
    metrics: {
      r_squared: 1 - ssRes / (ssTot + 1e-8),
      mse: ssRes / n,
      weight: w / xStd,
      bias: b - (w * xMean) / xStd,
    },
  };
}

export function runLogisticRegression(params: Record<string, number>): SimulationResult {
  const lr = params.learning_rate ?? 0.1;
  const iters = params.iterations ?? 100;
  const noise = params.noise ?? 0.5;
  const n = params.n_samples ?? 100;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 2);
  for (let i = 0; i < n1; i++) { X.push([randn() * (0.5 + noise * 0.5) + 2, randn() * (0.5 + noise * 0.5) + 2]); y.push(1); }
  for (let i = n1; i < n; i++) { X.push([randn() * (0.5 + noise * 0.5) - 2, randn() * (0.5 + noise * 0.5) - 2]); y.push(0); }

  const xm = [X.reduce((a, p) => a + p[0], 0) / n, X.reduce((a, p) => a + p[1], 0) / n];
  const xs = [Math.sqrt(X.reduce((a, p) => a + (p[0] - xm[0]) ** 2, 0) / n) + 1e-8,
              Math.sqrt(X.reduce((a, p) => a + (p[1] - xm[1]) ** 2, 0) / n) + 1e-8];
  const Xn: [number, number][] = X.map((p) => [(p[0] - xm[0]) / xs[0], (p[1] - xm[1]) / xs[1]]);

  const w = [0, 0];
  let b = 0;
  const lossHistory: number[] = [];
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));

  for (let iter = 0; iter < iters; iter++) {
    const p = Xn.map((xi) => sigmoid(xi[0] * w[0] + xi[1] * w[1] + b));
    const loss = -y.reduce((a, yi, i) => a + yi * Math.log(p[i] + 1e-8) + (1 - yi) * Math.log(1 - p[i] + 1e-8), 0) / n;
    lossHistory.push(loss);

    const e = p.map((pi, i) => pi - y[i]);
    for (let j = 0; j < 2; j++) {
      w[j] -= lr * (e.reduce((a, ei, i) => a + ei * Xn[i][j], 0) / n);
    }
    b -= lr * (e.reduce((a, ei) => a + ei, 0) / n);
  }

  // Decision boundary grid
  const lo = -4, hi = 4, res = 60;
  const boundary: number[][] = [];
  for (let i = 0; i < res; i++) {
    boundary[i] = [];
    for (let j = 0; j < res; j++) {
      const px = lo + (i / res) * (hi - lo);
      const py = lo + (j / res) * (hi - lo);
      const pzn = [(px - xm[0]) / xs[0], (py - xm[1]) / xs[1]];
      boundary[i][j] = sigmoid(pzn[0] * w[0] + pzn[1] * w[1] + b);
    }
  }

  const preds = Xn.map((xi) => sigmoid(xi[0] * w[0] + xi[1] * w[1] + b) >= 0.5 ? 1 : 0);
  const acc = preds.filter((p, i) => p === y[i]).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] })),
    decisionBoundary: boundary,
    lossHistory,
    metrics: { accuracy: acc },
  };
}

export function runKNN(params: Record<string, number>): SimulationResult {
  const k = params.k ?? 5;
  const n = params.n_samples ?? 150;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 3), n2 = Math.floor(n / 3), n3 = n - n1 - n2;
  for (let i = 0; i < n1; i++) { X.push([randn() * 0.8 + 3, randn() * 0.8 + 3]); y.push(0); }
  for (let i = 0; i < n2; i++) { X.push([randn() * 0.8 - 3, randn() * 0.8 + 3]); y.push(1); }
  for (let i = 0; i < n3; i++) { X.push([randn() * 0.8, randn() * 0.8 - 3]); y.push(2); }

  const predict = (x: [number, number]): number => {
    const dists = X.map((xi, i) => ({ d: Math.sqrt((xi[0] - x[0]) ** 2 + (xi[1] - x[1]) ** 2), y: y[i] }));
    dists.sort((a, b) => a.d - b.d);
    const counts = [0, 0, 0];
    for (let i = 0; i < k; i++) counts[dists[i].y]++;
    return counts.indexOf(Math.max(...counts));
  };

  const preds = X.map(predict);
  const acc = preds.filter((p, i) => p === y[i]).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] })),
    lossHistory: [],
    metrics: { accuracy: acc, k },
  };
}

export function runDecisionTree(params: Record<string, number>): SimulationResult {
  const maxDepth = params.max_depth ?? 4;
  const n = params.n_samples ?? 150;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 3), n2 = Math.floor(n / 3), n3 = n - n1 - n2;
  for (let i = 0; i < n1; i++) { X.push([randn() * 0.5 + 2, randn() * 0.5 + 2]); y.push(0); }
  for (let i = 0; i < n2; i++) { X.push([randn() * 0.5 - 2, randn() * 0.5 + 2]); y.push(1); }
  for (let i = 0; i < n3; i++) { X.push([randn() * 0.5, randn() * 0.5 - 2]); y.push(2); }

  // Simple decision tree
  const buildTree = (Xs: [number, number][], ys: number[], depth: number): ((x: [number, number]) => number) => {
    const classes = [...new Set(ys)];
    if (depth >= maxDepth || classes.length <= 1 || ys.length < 3) {
      const counts = [0, 0, 0];
      ys.forEach((y) => counts[y]++);
      const pred = counts.indexOf(Math.max(...counts));
      return () => pred;
    }

    let bestGini = Infinity, bestFeat = 0, bestThr = 0;
    for (let f = 0; f < 2; f++) {
      const vals = Xs.map((x) => x[f]).sort((a, b) => a - b);
      for (let t = 0; t < 5; t++) {
        const thr = vals[Math.floor((t + 1) / 6 * vals.length)];
        const left = ys.filter((_, i) => Xs[i][f] <= thr);
        const right = ys.filter((_, i) => Xs[i][f] > thr);
        if (left.length === 0 || right.length === 0) continue;
        const gini = (left.length * giniImpurity(left) + right.length * giniImpurity(right)) / ys.length;
        if (gini < bestGini) { bestGini = gini; bestFeat = f; bestThr = thr; }
      }
    }

    if (bestGini === Infinity) {
      const counts = [0, 0, 0];
      ys.forEach((y) => counts[y]++);
      return () => counts.indexOf(Math.max(...counts));
    }

    const leftX = Xs.filter((x) => x[bestFeat] <= bestThr);
    const leftY = ys.filter((_, i) => Xs[i][bestFeat] <= bestThr);
    const rightX = Xs.filter((x) => x[bestFeat] > bestThr);
    const rightY = ys.filter((_, i) => Xs[i][bestFeat] > bestThr);

    const leftFn = buildTree(leftX, leftY, depth + 1);
    const rightFn = buildTree(rightX, rightY, depth + 1);

    return (x) => x[bestFeat] <= bestThr ? leftFn(x) : rightFn(x);
  };

  const tree = buildTree(X, y, 0);
  const preds = X.map(tree);
  const acc = preds.filter((p, i) => p === y[i]).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] })),
    lossHistory: [],
    metrics: { accuracy: acc, depth: maxDepth },
  };
}

export function runRandomForest(params: Record<string, number>): SimulationResult {
  const nTrees = params.n_trees ?? 20;
  const n = params.n_samples ?? 150;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 3), n2 = Math.floor(n / 3), n3 = n - n1 - n2;
  for (let i = 0; i < n1; i++) { X.push([randn() * 0.5 + 2, randn() * 0.5 + 2]); y.push(0); }
  for (let i = 0; i < n2; i++) { X.push([randn() * 0.5 - 2, randn() * 0.5 + 2]); y.push(1); }
  for (let i = 0; i < n3; i++) { X.push([randn() * 0.5, randn() * 0.5 - 2]); y.push(2); }

  const trees: ((x: [number, number]) => number)[] = [];
  for (let t = 0; t < nTrees; t++) {
    const bootIdx = Array.from({ length: n }, () => Math.floor(Math.random() * n));
    const bootX = bootIdx.map((i) => X[i]);
    const bootY = bootIdx.map((i) => y[i]);
    trees.push(buildSmallTree(bootX, bootY, 3));
  }

  const predict = (x: [number, number]): number => {
    const votes = [0, 0, 0];
    trees.forEach((tree) => votes[tree(x)]++);
    return votes.indexOf(Math.max(...votes));
  };

  const preds = X.map(predict);
  const acc = preds.filter((p, i) => p === y[i]).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] })),
    lossHistory: [],
    metrics: { accuracy: acc, n_trees: nTrees },
  };
}

export function runKMeans(params: Record<string, number>): SimulationResult {
  const k = params.k ?? 3;
  const maxIter = params.max_iter ?? 20;
  const n = params.n_samples ?? 150;

  const cents = [[3, 3], [-3, 3], [0, -3], [4, -2], [-4, -2]].slice(0, k);
  const chunks: [number, number][][] = [];
  const perChunk = Math.floor(n / k);
  for (let i = 0; i < k; i++) {
    const size = i < k - 1 ? perChunk : n - perChunk * (k - 1);
    const pts: [number, number][] = [];
    for (let j = 0; j < size; j++) {
      pts.push([randn() * 0.8 + cents[i][0], randn() * 0.8 + cents[i][1]]);
    }
    chunks.push(pts);
  }

  let X: [number, number][] = [];
  chunks.forEach((c) => X.push(...c));
  X = X.slice(0, n);

  let centroids = X.slice(0, k).map((p) => [...p] as [number, number]);
  const history: { centroids: number[][]; assignments: number[]; inertia: number }[] = [];

  for (let iter = 0; iter < maxIter; iter++) {
    const assignments = X.map((x) => {
      let best = 0, bestD = Infinity;
      centroids.forEach((c, i) => {
        const d = (x[0] - c[0]) ** 2 + (x[1] - c[1]) ** 2;
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    });

    const inertia = X.reduce((sum, x, i) => {
      const c = centroids[assignments[i]];
      return sum + (x[0] - c[0]) ** 2 + (x[1] - c[1]) ** 2;
    }, 0);

    history.push({ centroids: centroids.map((c) => [...c]), assignments, inertia });

    const newCentroids = centroids.map((_, i) => {
      const pts = X.filter((_, j) => assignments[j] === i);
      if (pts.length === 0) return centroids[i];
      return [
        pts.reduce((a, p) => a + p[0], 0) / pts.length,
        pts.reduce((a, p) => a + p[1], 0) / pts.length,
      ] as [number, number];
    });

    if (centroids.every((c, i) => Math.abs(c[0] - newCentroids[i][0]) < 1e-6 && Math.abs(c[1] - newCentroids[i][1]) < 1e-6)) break;
    centroids = newCentroids;
  }

  const lastAssign = history[history.length - 1].assignments;
  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: lastAssign[i] })),
    centroids: centroids.map((c) => ({ x: c[0], y: c[1] })),
    lossHistory: history.map((h) => h.inertia),
    metrics: { inertia: history[history.length - 1].inertia, iterations: history.length },
  };
}

export function runSVM(params: Record<string, number>): SimulationResult {
  const C = params.C ?? 1.0;
  const gamma = params.gamma ?? 0.5;
  const n = params.n_samples ?? 100;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 2);
  for (let i = 0; i < n1; i++) { X.push([randn() * 0.8 + 2, randn() * 0.8 + 2]); y.push(1); }
  for (let i = n1; i < n; i++) { X.push([randn() * 0.8 - 2, randn() * 0.8 - 2]); y.push(-1); }

  const xm = [X.reduce((a, p) => a + p[0], 0) / n, X.reduce((a, p) => a + p[1], 0) / n];
  const xs = [Math.sqrt(X.reduce((a, p) => a + (p[0] - xm[0]) ** 2, 0) / n) + 1e-8,
              Math.sqrt(X.reduce((a, p) => a + (p[1] - xm[1]) ** 2, 0) / n) + 1e-8];
  const Xn: [number, number][] = X.map((p) => [(p[0] - xm[0]) / xs[0], (p[1] - xm[1]) / xs[1]]);

  // Simple kernel SVM with gradient descent
  const a = new Float64Array(n);
  let b = 0;
  const lossHistory: number[] = [];

  const kernel = (x1: [number, number], x2: [number, number]) =>
    Math.exp(-gamma * ((x1[0] - x2[0]) ** 2 + (x1[1] - x2[1]) ** 2));

  const K: number[][] = [];
  for (let i = 0; i < n; i++) {
    K[i] = [];
    for (let j = 0; j < n; j++) K[i][j] = kernel(Xn[i], Xn[j]);
  }

  for (let iter = 0; iter < 200; iter++) {
    let loss = 0;
    for (let i = 0; i < n; i++) {
      let s = b;
      for (let j = 0; j < n; j++) s += a[j] * K[j][i];
      const m = y[i] * s;
      loss += Math.max(0, 1 - m);
    }
    let regLoss = 0;
    for (let i = 0; i < n; i++) regLoss += a[i] * a[i];
    lossHistory.push(0.5 * regLoss + C * loss);

    const lr = 0.001;
    for (let i = 0; i < n; i++) {
      let s = b;
      for (let j = 0; j < n; j++) s += a[j] * K[j][i];
      const m = y[i] * s;
      if (m < 1) {
        a[i] += lr * (1 - C * a[i]);
      } else {
        a[i] -= lr * C * a[i];
      }
      a[i] = Math.max(0, Math.min(C, a[i]));
    }
    let sumAy = 0, sumA = 0;
    for (let i = 0; i < n; i++) { if (a[i] > 1e-6) { sumAy += a[i] * y[i]; sumA++; } }
    if (sumA > 0) b = sumAy / sumA;
  }

  // Decision boundary
  const lo = -4, hi = 4, res = 60;
  const boundary: number[][] = [];
  for (let i = 0; i < res; i++) {
    boundary[i] = [];
    for (let j = 0; j < res; j++) {
      const px = lo + (i / res) * (hi - lo);
      const py = lo + (j / res) * (hi - lo);
      const pn: [number, number] = [(px - xm[0]) / xs[0], (py - xm[1]) / xs[1]];
      let s = b;
      for (let k = 0; k < n; k++) s += a[k] * kernel(Xn[k], pn);
      boundary[i][j] = s;
    }
  }

  const preds = Xn.map((xi, i) => {
    let s = b;
    for (let j = 0; j < n; j++) s += a[j] * K[j][i];
    return s >= 0 ? 1 : 0;
  });
  const acc = preds.filter((p, i) => p === (y[i] === 1 ? 1 : 0)).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] === 1 ? 1 : 0 })),
    decisionBoundary: boundary,
    lossHistory,
    metrics: { accuracy: acc },
  };
}

// Naive Bayes
export function runNaiveBayes(params: Record<string, number>): SimulationResult {
  const noise = params.noise ?? 0.5;
  const n = params.n_samples ?? 150;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 3), n2 = Math.floor(n / 3), n3 = n - n1 - n2;
  for (let i = 0; i < n1; i++) { X.push([randn() * noise + 2, randn() * noise + 2]); y.push(0); }
  for (let i = 0; i < n2; i++) { X.push([randn() * noise - 2, randn() * noise + 2]); y.push(1); }
  for (let i = 0; i < n3; i++) { X.push([randn() * noise, randn() * noise - 2]); y.push(2); }

  const classes = [0, 1, 2];
  const priors = classes.map((c) => y.filter((yi) => yi === c).length / n);
  const means = classes.map((c) => {
    const pts = X.filter((_, i) => y[i] === c);
    return [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length] as [number, number];
  });
  const variances = classes.map((c) => {
    const pts = X.filter((_, i) => y[i] === c);
    return [
      pts.reduce((a, p) => a + (p[0] - means[c][0]) ** 2, 0) / pts.length + 0.1,
      pts.reduce((a, p) => a + (p[1] - means[c][1]) ** 2, 0) / pts.length + 0.1,
    ] as [number, number];
  });

  const predict = (x: [number, number]): number => {
    let best = 0, bestScore = -Infinity;
    classes.forEach((c, ci) => {
      const score = Math.log(priors[ci]) - 0.5 * Math.log(2 * Math.PI * variances[ci][0]) - 0.5 * ((x[0] - means[ci][0]) ** 2) / variances[ci][0]
                    - 0.5 * Math.log(2 * Math.PI * variances[ci][1]) - 0.5 * ((x[1] - means[ci][1]) ** 2) / variances[ci][1];
      if (score > bestScore) { bestScore = score; best = ci; }
    });
    return best;
  };

  const preds = X.map(predict);
  const acc = preds.filter((p, i) => p === y[i]).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] })),
    lossHistory: [],
    metrics: { accuracy: acc },
  };
}

// Gradient Boosting (simplified)
export function runGradientBoosting(params: Record<string, number>): SimulationResult {
  const nEstimators = params.n_estimators ?? 20;
  const lr = params.learning_rate ?? 0.1;
  const n = params.n_samples ?? 150;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 3), n2 = Math.floor(n / 3), n3 = n - n1 - n2;
  for (let i = 0; i < n1; i++) { X.push([randn() * 0.8 + 2, randn() * 0.8 + 2]); y.push(0); }
  for (let i = 0; i < n2; i++) { X.push([randn() * 0.8 - 2, randn() * 0.8 + 2]); y.push(1); }
  for (let i = 0; i < n3; i++) { X.push([randn() * 0.8, randn() * 0.8 - 2]); y.push(2); }

  const nClasses = 3;
  const probs = Array.from({ length: n }, () => [1 / 3, 1 / 3, 1 / 3]);
  const lossHistory: number[] = [];

  for (let t = 0; t < nEstimators; t++) {
    for (let c = 0; c < nClasses; c++) {
      const residuals = X.map((_, i) => (y[i] === c ? 1 : 0) - probs[i][c]);
      // Simple tree on residuals (depth 2)
      const tree = buildStump(X, residuals);
      for (let i = 0; i < n; i++) probs[i][c] += lr * tree(X[i]);
    }
    // Normalize
    for (let i = 0; i < n; i++) {
      const sum = probs[i].reduce((a, b) => a + b, 0);
      probs[i] = probs[i].map((p) => p / sum);
    }
    const loss = -y.reduce((a, yi, i) => a + Math.log(probs[i][yi] + 1e-8), 0) / n;
    lossHistory.push(loss);
  }

  const preds = probs.map((p) => p.indexOf(Math.max(...p)));
  const acc = preds.filter((p, i) => p === y[i]).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] })),
    lossHistory,
    metrics: { accuracy: acc, n_trees: nEstimators },
  };
}

// Neural Network
export function runNeuralNetwork(params: Record<string, number>): SimulationResult {
  const hiddenSize = params.hidden_size ?? 8;
  const lr = params.learning_rate ?? 0.1;
  const epochs = params.epochs ?? 100;
  const n = params.n_samples ?? 100;

  const X: [number, number][] = [];
  const y: number[] = [];
  const n1 = Math.floor(n / 2);
  for (let i = 0; i < n1; i++) { X.push([randn() * 0.8 + 2, randn() * 0.8 + 2]); y.push(1); }
  for (let i = n1; i < n; i++) { X.push([randn() * 0.8 - 2, randn() * 0.8 - 2]); y.push(0); }

  const xm = [X.reduce((a, p) => a + p[0], 0) / n, X.reduce((a, p) => a + p[1], 0) / n];
  const xs = [Math.sqrt(X.reduce((a, p) => a + (p[0] - xm[0]) ** 2, 0) / n) + 1e-8,
              Math.sqrt(X.reduce((a, p) => a + (p[1] - xm[1]) ** 2, 0) / n) + 1e-8];
  const Xn = X.map((p) => [(p[0] - xm[0]) / xs[0], (p[1] - xm[1]) / xs[1]]);

  // Init weights
  const w1 = Array.from({ length: 2 }, () => Array.from({ length: hiddenSize }, () => (Math.random() - 0.5)));
  const b1 = new Array(hiddenSize).fill(0);
  const w2 = Array.from({ length: hiddenSize }, () => (Math.random() - 0.5));
  const b2 = [0];

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
  const relu = (z: number) => Math.max(0, z);
  const lossHistory: number[] = [];
  const snapshots: { step: number; loss: number; boundary: number[][]; grid_x: number[]; grid_y: number[] }[] = [];
  const snapInterval = Math.max(1, Math.floor(epochs / 15));

  for (let e = 0; e < epochs; e++) {
    // Forward
    const h = Xn.map((xi) => {
      const hidden = w1[0].map((w, j) => relu(xi[0] * w + xi[1] * w1[1][j] + b1[j]));
      return hidden;
    });
    const o = h.map((hi) => sigmoid(hi.reduce((a, hj, j) => a + hj * w2[j], 0) + b2[0]));

    const loss = -y.reduce((a, yi, i) => a + yi * Math.log(o[i] + 1e-8) + (1 - yi) * Math.log(1 - o[i] + 1e-8), 0) / n;
    lossHistory.push(loss);

    // Backward
    const doArr = o.map((oi, i) => oi - y[i]);
    const dh = h.map((hi, i) => hi.map((hij, j) => doArr[i] * w2[j] * (hij > 0 ? 1 : 0)));

    for (let j = 0; j < hiddenSize; j++) {
      let dw2 = 0;
      for (let i = 0; i < n; i++) dw2 += h[i][j] * doArr[i];
      w2[j] -= lr * dw2 / n;
    }
    b2[0] -= lr * doArr.reduce((a, d) => a + d, 0) / n;

    for (let j = 0; j < hiddenSize; j++) {
      for (let f = 0; f < 2; f++) {
        let dw = 0;
        for (let i = 0; i < n; i++) dw += Xn[i][f] * dh[i][j];
        w1[f][j] -= lr * dw / n;
      }
      b1[j] -= lr * dh.reduce((a, di) => a + di[j], 0) / n;
    }

    if (e % snapInterval === 0 || e === epochs - 1) {
      const res = 60, lo = -3, hi = 3;
      const gridX = Array.from({ length: res }, (_, i) => lo + (i / res) * (hi - lo));
      const gridY = Array.from({ length: res }, (_, i) => lo + (i / res) * (hi - lo));
      const boundary: number[][] = [];
      for (let i = 0; i < res; i++) {
        boundary[i] = [];
        for (let j = 0; j < res; j++) {
          const hidden = w1[0].map((w, k) => relu(gridX[i] * w + gridY[j] * w1[1][k] + b1[k]));
          boundary[i][j] = sigmoid(hidden.reduce((a, hj, j) => a + hj * w2[j], 0) + b2[0]);
        }
      }
      snapshots.push({ step: e, loss, boundary, grid_x: gridX, grid_y: gridY });
    }
  }

  const preds = Xn.map((xi) => {
    const hidden = w1[0].map((w, j) => relu(xi[0] * w + xi[1] * w1[1][j] + b1[j]));
    return sigmoid(hidden.reduce((a, hj, j) => a + hj * w2[j], 0) + b2[0]) >= 0.5 ? 1 : 0;
  });
  const acc = preds.filter((p, i) => p === y[i]).length / n;

  return {
    points: X.map((p, i) => ({ x: p[0], y: p[1], cluster: y[i] })),
    lossHistory,
    snapshots,
    metrics: { accuracy: acc, hidden_units: hiddenSize },
  };
}

// Helpers
function linspace(a: number, b: number, n: number): number[] {
  return Array.from({ length: n }, (_, i) => a + (i / (n - 1)) * (b - a));
}

function giniImpurity(y: number[]): number {
  const counts = [0, 0, 0];
  y.forEach((yi) => counts[yi]++);
  return 1 - counts.reduce((a, c) => a + (c / y.length) ** 2, 0);
}

function buildSmallTree(X: [number, number][], y: number[], depth: number): (x: [number, number]) => number {
  const counts = [0, 0, 0];
  y.forEach((yi) => counts[yi]++);
  const pred = counts.indexOf(Math.max(...counts));

  if (depth <= 0 || y.length < 3 || new Set(y).size <= 1) return () => pred;

  let bestGini = Infinity, bestFeat = 0, bestThr = 0;
  for (let f = 0; f < 2; f++) {
    const vals = X.map((x) => x[f]).sort((a, b) => a - b);
    for (let t = 1; t < 5; t++) {
      const thr = vals[Math.floor(t / 5 * vals.length)];
      const leftY = y.filter((_, i) => X[i][f] <= thr);
      const rightY = y.filter((_, i) => X[i][f] > thr);
      if (leftY.length === 0 || rightY.length === 0) continue;
      const g = (leftY.length * giniImpurity(leftY) + rightY.length * giniImpurity(rightY)) / y.length;
      if (g < bestGini) { bestGini = g; bestFeat = f; bestThr = thr; }
    }
  }

  if (bestGini === Infinity) return () => pred;

  const leftX = X.filter((x) => x[bestFeat] <= bestThr);
  const leftY = y.filter((_, i) => X[i][bestFeat] <= bestThr);
  const rightX = X.filter((x) => x[bestFeat] > bestThr);
  const rightY = y.filter((_, i) => X[i][bestFeat] > bestThr);

  const leftFn = buildSmallTree(leftX, leftY, depth - 1);
  const rightFn = buildSmallTree(rightX, rightY, depth - 1);

  return (x) => x[bestFeat] <= bestThr ? leftFn(x) : rightFn(x);
}

function buildStump(X: [number, number][], residuals: number[]): (x: [number, number]) => number {
  let bestScore = Infinity, bestFeat = 0, bestThr = 0, bestVal = 0;
  for (let f = 0; f < 2; f++) {
    const vals = X.map((x) => x[f]).sort((a, b) => a - b);
    for (let t = 1; t < 5; t++) {
      const thr = vals[Math.floor(t / 5 * vals.length)];
      const leftR = residuals.filter((_, i) => X[i][f] <= thr);
      const rightR = residuals.filter((_, i) => X[i][f] > thr);
      if (leftR.length === 0 || rightR.length === 0) continue;
      const leftVal = leftR.reduce((a, b) => a + b, 0) / leftR.length;
      const rightVal = rightR.reduce((a, b) => a + b, 0) / rightR.length;
      const score = leftR.reduce((a, r) => a + (r - leftVal) ** 2, 0) + rightR.reduce((a, r) => a + (r - rightVal) ** 2, 0);
      if (score < bestScore) { bestScore = score; bestFeat = f; bestThr = thr; bestVal = leftVal; }
    }
  }
  const rightVal = residuals.filter((_, i) => X[i][bestFeat] > bestThr).reduce((a, b) => a + b, 0) /
                   Math.max(1, residuals.filter((_, i) => X[i][bestFeat] > bestThr).length);
  return (x) => x[bestFeat] <= bestThr ? bestVal : rightVal;
}
