"use client";

import { useState, useCallback } from "react";
import { usePyodide } from "@/hooks/usePyodide";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Swords, Trophy, TrendingUp, Timer } from "lucide-react";

interface ModelResult {
  name: string;
  metrics: Record<string, number>;
  accuracy?: number;
  latency: number;
  points?: { x: number; y: number; predicted?: number; cluster?: number }[];
  decisionBoundary?: number[][];
  line?: { x: number; y: number }[];
}

const algorithms = [
  { id: "logistic", name: "Logistic Regression", icon: "📊" },
  { id: "knn", name: "KNN (k=5)", icon: "📍" },
  { id: "tree", name: "Decision Tree", icon: "🌳" },
  { id: "forest", name: "Random Forest", icon: "🌲" },
  { id: "svm", name: "SVM (RBF)", icon: "⚔️" },
];

const evalCode = `import numpy as np, json, time

params = json.loads(params_json)
np.random.seed(42)
n=200
n1=n//2
X1=np.random.randn(n1,2)*0.6+[2,2]
X2=np.random.randn(n-n1,2)*0.6+[-2,-2]
X=np.vstack([X1,X2]);y=np.array([1]*n1+[0]*(n-n1))
Xm=np.mean(X,0);Xs=np.std(X,0)+1e-8;Xn=(X-Xm)/Xs

def sigmoid(z):return 1/(1+np.exp(-np.clip(z,-500,500)))
def knn_pred(Xtr,ytr,xq,k=5):
    d=np.sqrt(np.sum((Xtr-xq)**2,axis=1))
    return int(np.argmax(np.bincount(ytr[np.argsort(d)[:k]],minlength=2)))

results=[]
# Logistic Regression
t0=time.time()
w=np.zeros(2);b=0.0
for _ in range(100):
    p=sigmoid(Xn@w+b);e=p-y
    w-=0.1*((1/n)*(Xn.T@e));b-=0.1*((1/n)*np.sum(e))
acc=float(np.mean((sigmoid(Xn@w+b)>=0.5).astype(int)==y))
results.append({"name":"Logistic Regression","accuracy":round(acc,4),"latency":round((time.time()-t0)*1000,1)})

# KNN
t0=time.time()
sp=int(0.8*n);Xtr,Xte,ytr,yte=X[:sp],X[sp:],y[:sp],y[sp:]
preds=np.array([knn_pred(Xtr,ytr,x) for x in Xte])
acc=float(np.mean(preds==yte))
results.append({"name":"KNN (k=5)","accuracy":round(acc,4),"latency":round((time.time()-t0)*1000,1)})

# Decision Tree (simple)
from collections import Counter
def gini(l):
    c=Counter(l);p=[v/len(l) for v in c.values()];return 1-sum(v**2 for v in p)
def build_dt(Xn,yn,d=0,md=4):
    c=Counter(yn);pred=c.most_common(1)[0][0]
    if d>=md or len(yn)<5 or gini(yn)==0: return ("leaf",pred)
    bg,bf,bt=float("inf"),0,0.0
    for f in range(Xn.shape[1]):
        for t in np.percentile(Xn[:,f],np.linspace(10,90,5)):
            lm=Xn[:,f]<=t
            if sum(lm)==0 or sum(~lm)==0:continue
            g=(sum(lm)*gini(yn[lm])+sum(~lm)*gini(yn[~lm]))/len(yn)
            if g<bg:bg,bf,bt=g,f,float(t)
    lm=Xn[:,bf]<=bt
    return ("node",bf,bt,build_dt(Xn[lm],yn[lm],d+1),build_dt(Xn[~lm],yn[~lm],d+1))
def pred_dt(x,n):
    if n[0]=="leaf":return n[1]
    if x[n[1]]<=n[2]:return pred_dt(x,n[3])
    return pred_dt(x,n[4])
t0=time.time()
tree=build_dt(Xn,y)
preds=np.array([pred_dt(x,tree) for x in Xn])
acc=float(np.mean(preds==y))
results.append({"name":"Decision Tree","accuracy":round(acc,4),"latency":round((time.time()-t0)*1000,1)})

# Random Forest
t0=time.time()
trees=[]
for _ in range(10):
    idx=np.random.choice(n,n,replace=True)
    trees.append(build_dt(Xn[idx],y[idx]))
def pred_rf(x):
    votes=[pred_dt(x,t) for t in trees]
    return Counter(votes).most_common(1)[0][0]
preds=np.array([pred_rf(x) for x in Xn])
acc=float(np.mean(preds==y))
results.append({"name":"Random Forest","accuracy":round(acc,4),"latency":round((time.time()-t0)*1000,1)})

# SVM (linear approx)
t0=time.time()
w2=np.zeros(2);b2=0.0
for _ in range(200):
    m=y*(Xn@w2+b2);hl=np.maximum(0,1-m)
    g2=Xn.T@(hl>0).astype(float)*y
    w2-=0.001*(w2-g2);b2-=0.001*np.sum((hl>0).astype(float)*y)
acc=float(np.mean(np.sign(Xn@w2+b2)==y))
results.append({"name":"SVM (Linear)","accuracy":round(acc,4),"latency":round((time.time()-t0)*1000,1)})

json.dumps(results)`;

export function ModelArena() {
  const { isReady, run } = usePyodide();
  const [results, setResults] = useState<ModelResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [sortBy, setSortBy] = useState<"accuracy" | "latency">("accuracy");

  const runArena = useCallback(async () => {
    if (!isReady) return;
    setIsRunning(true);
    try {
      const data = await run<ModelResult[]>(evalCode, { params_json: "{}" });
      if (data) {
        setResults(data);
      }
    } catch (err) {
      console.error("Arena error:", err);
    } finally {
      setIsRunning(false);
    }
  }, [isReady, run]);

  const sorted = [...results].sort((a, b) =>
    sortBy === "accuracy"
      ? (b.metrics?.accuracy ?? b.accuracy ?? 0) - (a.metrics?.accuracy ?? a.accuracy ?? 0)
      : (a.latency ?? 999) - (b.latency ?? 999)
  );

  const best = sorted[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Swords className="w-6 h-6 text-orange-400" />
            Model Comparison Arena
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Run all algorithms on the same dataset. Compare accuracy, speed, and
            trade-offs.
          </p>
        </div>
        <Button
          onClick={runArena}
          disabled={!isReady || isRunning}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isRunning ? "Evaluating..." : "Run Arena"}
        </Button>
      </div>

      {results.length > 0 && (
        <>
          {/* Sort controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={sortBy === "accuracy" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("accuracy")}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              By Accuracy
            </Button>
            <Button
              variant={sortBy === "latency" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy("latency")}
            >
              <Timer className="w-4 h-4 mr-1" />
              By Latency
            </Button>
          </div>

          {/* Results table */}
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-zinc-500 font-medium">
                    Model
                  </th>
                  <th className="px-4 py-3 text-right text-zinc-500 font-medium">
                    Accuracy
                  </th>
                  <th className="px-4 py-3 text-right text-zinc-500 font-medium">
                    Latency
                  </th>
                  <th className="px-4 py-3 text-center text-zinc-500 font-medium">
                    Verdict
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => {
                  const acc = r.metrics?.accuracy ?? r.accuracy ?? 0;
                  const isBest = i === 0;
                  return (
                    <tr
                      key={r.name}
                      className={`border-b border-zinc-800/50 ${
                        isBest ? "bg-orange-950/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-zinc-200">
                        {algorithms.find((a) => a.name === r.name)?.icon}{" "}
                        {r.name}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-mono ${
                            acc >= 0.9
                              ? "text-emerald-400"
                              : acc >= 0.8
                                ? "text-amber-400"
                                : "text-red-400"
                          }`}
                        >
                          {(acc * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-400">
                        {r.latency}ms
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isBest && (
                          <Badge className="bg-orange-600 text-white text-xs">
                            <Trophy className="w-3 h-3 mr-1" />
                            Best
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Trade-off question */}
          <Card className="bg-zinc-900 border-zinc-800 p-5">
            <h3 className="font-semibold text-zinc-200 mb-2">
              Which model would you deploy? Why?
            </h3>
            <p className="text-sm text-zinc-500 mb-3">
              ML engineering is about trade-offs, not leaderboard scores.
              Consider accuracy, latency, interpretability, and maintenance
              cost.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-800 rounded-lg p-3 text-center">
                <div className="text-xs text-zinc-500 mb-1">Fastest</div>
                <div className="text-sm font-medium text-zinc-200">
                  {sorted.length > 0
                    ? [...sorted].sort((a, b) => a.latency - b.latency)[0]
                        ?.name
                    : "-"}
                </div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 text-center">
                <div className="text-xs text-zinc-500 mb-1">Most Accurate</div>
                <div className="text-sm font-medium text-zinc-200">
                  {best?.name}
                </div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 text-center">
                <div className="text-xs text-zinc-500 mb-1">Best Balance</div>
                <div className="text-sm font-medium text-zinc-200">
                  {sorted.length > 0
                    ? [...sorted].sort(
                        (a, b) =>
                          ((b.metrics?.accuracy ?? b.accuracy ?? 0) /
                            Math.max(a.latency, 1)) -
                          ((a.metrics?.accuracy ?? a.accuracy ?? 0) /
                            Math.max(b.latency, 1))
                      )[0]?.name
                    : "-"}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {results.length === 0 && !isRunning && (
        <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
          <Swords className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">
            Click &quot;Run Arena&quot; to evaluate all models on the same dataset.
          </p>
        </Card>
      )}
    </div>
  );
}
