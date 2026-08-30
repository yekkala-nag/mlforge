module.exports=[12558,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(68136),e=a.i(77928),f=a.i(91119),g=a.i(86304),h=a.i(99570),i=a.i(75083);let j=`
import numpy as np
import json

class LogisticRegression:
    def __init__(self, lr=0.1, iters=100, C=1.0):
        self.lr = lr
        self.iters = iters
        self.C = C
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
    def fit(self, X, y):
        n = len(X)
        self.Xm = np.mean(X, 0)
        self.Xs = np.std(X, 0) + 1e-8
        Xn = (X - self.Xm) / self.Xs
        self.w = np.zeros(Xn.shape[1])
        self.b = 0.0
        self.loss = []
        for _ in range(self.iters):
            p = self.sigmoid(Xn @ self.w + self.b)
            e = p - y
            self.loss.append(float(-np.mean(y*np.log(p+1e-8) + (1-y)*np.log(1-p+1e-8))))
            self.w -= self.lr * ((1/n)*(Xn.T @ e) + (1/self.C)*self.w)
            self.b -= self.lr * ((1/n)*np.sum(e))
        return self
    def predict(self, X):
        Xn = (X - self.Xm) / self.Xs
        return (self.sigmoid(Xn @ self.w + self.b) >= 0.5).astype(int)

np.random.seed(42)
n = 100
n1 = n // 2
X1 = np.random.randn(n1, 2) * 0.5 + [2, 2]
X2 = np.random.randn(n - n1, 2) * 0.5 + [-2, -2]
X = np.vstack([X1, X2])
y = np.array([1]*n1 + [0]*(n-n1))

model = LogisticRegression(lr=0.1, iters=100, C=1.0)
model.fit(X, y)

from sklearn.linear_model import LogisticRegression as LR
sk = LR(C=1.0, max_iter=100)
sk.fit(X, y)

sp = model.predict(X)
skp = sk.predict(X)
json.dumps({
    "scratch": {"weights": model.w.tolist(), "bias": float(model.b),
        "accuracy": float(np.mean(sp == y)), "loss": model.loss[-1]},
    "sklearn": {"weights": sk.coef_[0].tolist(), "bias": float(sk.intercept_[0]),
        "accuracy": float(np.mean(skp == y))},
    "comparison": {"accuracy_diff": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))),
        "match": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))) < 0.05}
})`,k=`
import numpy as np
import json

class KNN:
    def __init__(self, k=5):
        self.k = k
    def fit(self, X, y):
        self.Xt = X
        self.yt = y
    def predict(self, X):
        preds = []
        for x in X:
            d = np.sqrt(np.sum((self.Xt - x)**2, axis=1))
            idx = np.argsort(d)[:self.k]
            preds.append(int(np.argmax(np.bincount(self.yt[idx], minlength=3))))
        return np.array(preds)

np.random.seed(42)
n = 150
n1, n2, n3 = n//3, n//3, n - 2*(n//3)
X1 = np.random.randn(n1, 2)*0.8 + [3, 3]
X2 = np.random.randn(n2, 2)*0.8 + [-3, 3]
X3 = np.random.randn(n3, 2)*0.8 + [0, -3]
X = np.vstack([X1, X2, X3])
y = np.array([0]*n1 + [1]*n2 + [2]*n3)

model = KNN(k=5)
model.fit(X, y)

from sklearn.neighbors import KNeighborsClassifier
sk = KNeighborsClassifier(n_neighbors=5)
sk.fit(X, y)

sp = model.predict(X)
skp = sk.predict(X)
json.dumps({
    "scratch": {"accuracy": float(np.mean(sp == y)), "k": 5},
    "sklearn": {"accuracy": float(np.mean(skp == y)), "k": 5},
    "comparison": {"accuracy_diff": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))),
        "match": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))) < 0.02}
})`,l=`
import numpy as np
import json
from collections import Counter

class DTree:
    def __init__(self, md=4, ms=5):
        self.md = md
        self.ms = ms
    def _gini(self, y):
        c = Counter(y)
        return 1 - sum((v/len(y))**2 for v in c.values())
    def _build(self, X, y, d=0):
        pred = Counter(y).most_common(1)[0][0]
        if d >= self.md or len(y) < self.ms or self._gini(y) == 0:
            return {"leaf": True, "value": pred, "samples": len(y)}
        bg, bf, bt = float("inf"), 0, 0.0
        for f in range(X.shape[1]):
            for t in np.percentile(X[:, f], np.linspace(10, 90, 5)):
                lm = X[:, f] <= t
                if sum(lm) == 0 or sum(~lm) == 0: continue
                g = (sum(lm)*self._gini(y[lm]) + sum(~lm)*self._gini(y[~lm])) / len(y)
                if g < bg:
                    bg, bf, bt = g, f, float(t)
        lm = X[:, bf] <= bt
        return {"leaf": False, "feature": bf, "threshold": bt,
            "left": self._build(X[lm], y[lm], d+1),
            "right": self._build(X[~lm], y[~lm], d+1), "samples": len(y)}
    def fit(self, X, y):
        self.tree = self._build(X, y)
        return self
    def _pred(self, x, n):
        if n["leaf"]: return n["value"]
        if x[n["feature"]] <= n["threshold"]:
            return self._pred(x, n["left"])
        return self._pred(x, n["right"])
    def predict(self, X):
        return np.array([self._pred(x, self.tree) for x in X])

np.random.seed(42)
n = 150
n1, n2, n3 = n//3, n//3, n - 2*(n//3)
X1 = np.random.randn(n1, 2)*0.5 + [2, 2]
X2 = np.random.randn(n2, 2)*0.5 + [-2, 2]
X3 = np.random.randn(n3, 2)*0.5 + [0, -2]
X = np.vstack([X1, X2, X3])
y = np.array([0]*n1 + [1]*n2 + [2]*n3)

dt = DTree(md=4)
dt.fit(X, y)

from sklearn.tree import DecisionTreeClassifier
sk = DecisionTreeClassifier(max_depth=4, random_state=42)
sk.fit(X, y)

sp = dt.predict(X)
skp = sk.predict(X)
json.dumps({
    "scratch": {"accuracy": float(np.mean(sp == y)), "depth": 4},
    "sklearn": {"accuracy": float(np.mean(skp == y)), "depth": 4, "n_nodes": int(sk.tree_.node_count)},
    "comparison": {"accuracy_diff": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))),
        "match": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))) < 0.1}
})`,m={"linear-regression":{name:"Linear Regression",scratch_code:`
import numpy as np
import json

class LinearRegression:
    def __init__(self, learning_rate=0.01, iterations=100, regularization=0.0):
        self.lr = learning_rate
        self.iterations = iterations
        self.reg = regularization
        self.w = None
        self.b = 0.0
        self.loss_history = []

    def fit(self, X, y):
        n = len(X)
        self.X_mean = np.mean(X)
        self.X_std = np.std(X) + 1e-8
        X_norm = (X - self.X_mean) / self.X_std
        self.w = 0.0
        self.b = 0.0
        for _ in range(self.iterations):
            y_pred = self.w * X_norm + self.b
            error = y_pred - y
            loss = np.mean(error**2) + self.reg * self.w**2
            self.loss_history.append(float(loss))
            dw = (2/n) * np.sum(error * X_norm) + 2 * self.reg * self.w
            db = (2/n) * np.sum(error)
            self.w -= self.lr * dw
            self.b -= self.lr * db
        return self

    def predict(self, X):
        X_norm = (X - self.X_mean) / self.X_std
        return self.w * X_norm + self.b

np.random.seed(42)
n = 100
X = np.random.uniform(-5, 5, n)
y = 2.5 * X + 1.0 + np.random.normal(0, 0.5, n)

model = LinearRegression(learning_rate=0.05, iterations=100)
model.fit(X, y)

from sklearn.linear_model import LinearRegression as LR
sklearn_model = LR()
sklearn_model.fit(X.reshape(-1, 1), y)

json.dumps({
    "scratch": {"w": float(model.w), "b": float(model.b), "loss": model.loss_history[-1],
        "equation": "y = " + str(round(model.w, 4)) + "x + " + str(round(model.b, 4))},
    "sklearn": {"w": float(sklearn_model.coef_[0]), "b": float(sklearn_model.intercept_),
        "equation": "y = " + str(round(sklearn_model.coef_[0], 4)) + "x + " + str(round(sklearn_model.intercept_, 4))},
    "comparison": {"weight_diff": abs(model.w - sklearn_model.coef_[0]),
        "bias_diff": abs(model.b - sklearn_model.intercept_),
        "match": abs(model.w - sklearn_model.coef_[0]) < 0.01 and abs(model.b - sklearn_model.intercept_) < 0.01}
})`.trim(),concepts:["Weights (w) and bias (b) are learned parameters","Mean Squared Error measures prediction quality","Gradient descent updates weights: w -= lr * gradient","Regularization penalizes large weights to prevent overfitting"]},"logistic-regression":{name:"Logistic Regression",scratch_code:j.trim(),concepts:["Sigmoid function maps any value to [0, 1]","Cross-entropy loss measures classification quality","Decision threshold converts probabilities to classes","The decision boundary is a line in feature space"]},knn:{name:"K-Nearest Neighbors",scratch_code:k.trim(),concepts:["KNN is a lazy learner — no training phase","Distance metric determines similarity","K controls the bias-variance tradeoff","Majority vote among k nearest neighbors decides the class"]},"decision-tree":{name:"Decision Tree",scratch_code:l.trim(),concepts:["Gini impurity measures node purity","Recursive splitting creates the tree structure","max_depth controls overfitting","Each internal node splits on one feature at one threshold"]},"naive-bayes":{name:"Naive Bayes",scratch_code:`
import numpy as np
import json

class GaussianNB:
    def __init__(self, var_smoothing=0.1):
        self.vs = var_smoothing
    def fit(self, X, y):
        self.classes = np.unique(y)
        self.priors = {c: np.mean(y == c) for c in self.classes}
        self.means = {c: X[y == c].mean(0) for c in self.classes}
        self.variances = {c: X[y == c].var(0) + self.vs for c in self.classes}
        return self
    def _log_pdf(self, x, mean, var):
        return -0.5 * np.sum(np.log(2 * np.pi * var) + (x - mean) ** 2 / var)
    def predict(self, X):
        preds = []
        for x in X:
            logs = [np.log(self.priors[c]) + self._log_pdf(x, self.means[c], self.variances[c])
                    for c in self.classes]
            preds.append(self.classes[np.argmax(logs)])
        return np.array(preds)

np.random.seed(42)
n = 150
n1, n2, n3 = n // 3, n // 3, n - 2 * (n // 3)
X1 = np.random.randn(n1, 2) * 0.8 + [2, 2]
X2 = np.random.randn(n2, 2) * 0.8 + [-2, 2]
X3 = np.random.randn(n3, 2) * 0.8 + [0, -2]
X = np.vstack([X1, X2, X3])
y = np.array([0] * n1 + [1] * n2 + [2] * n3)

model = GaussianNB(var_smoothing=0.1)
model.fit(X, y)

from sklearn.naive_bayes import GaussianNB as SKNB
sk = SKNB(var_smoothing=0.1)
sk.fit(X, y)

sp = model.predict(X)
skp = sk.predict(X)
json.dumps({
    "scratch": {"accuracy": float(np.mean(sp == y))},
    "sklearn": {"accuracy": float(np.mean(skp == y))},
    "comparison": {"accuracy_diff": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))),
        "match": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))) < 0.05}
})`.trim(),concepts:["Bayes' theorem: P(class|features) ∝ P(features|class) * P(class)","Naive assumption: features are independent given the class","Gaussian distribution models continuous features","Log probabilities prevent numerical underflow"]},"gradient-boosting":{name:"Gradient Boosting",scratch_code:`
import numpy as np
import json
from collections import Counter

class SimpleTree:
    def __init__(self, md=3):
        self.md = md
        self.tree = None
    def fit(self, X, y):
        self.tree = self._build(X, y, 0)
    def _build(self, X, y, d):
        if d >= self.md or len(np.unique(y)) <= 1 or len(y) < 2:
            vals, counts = np.unique(y, return_counts=True)
            return {"leaf": True, "val": vals[np.argmax(counts)]}
        bg, bf, bt = float("inf"), 0, 0.0
        for f in range(X.shape[1]):
            for t in np.percentile(X[:, f], np.linspace(20, 80, 5)):
                lm = X[:, f] <= t
                if sum(lm) == 0 or sum(~lm) == 0: continue
                g = 0
                for c in np.unique(y):
                    for s in [lm, ~lm]:
                        p = np.mean(y[s] == c)
                        g -= np.sum(y[s] == c) / len(y) * np.log(p + 1e-8)
                if g < bg:
                    bg, bf, bt = g, f, t
        lm = X[:, bf] <= bt
        return {"feat": bf, "thr": bt,
            "left": self._build(X[lm], y[lm], d + 1),
            "right": self._build(X[~lm], y[~lm], d + 1)}
    def predict(self, X):
        return np.array([self._pred(x, self.tree) for x in X])
    def _pred(self, x, n):
        if n.get("leaf"): return n["val"]
        if x[n["feat"]] <= n["thr"]: return self._pred(x, n["left"])
        return self._pred(x, n["right"])

class GradientBoosting:
    def __init__(self, n_estimators=20, lr=0.1, max_depth=3):
        self.ne = n_estimators
        self.lr = lr
        self.md = max_depth
    def fit(self, X, y):
        n = len(X)
        self.n_classes = len(np.unique(y))
        self.probs = np.ones((n, self.n_classes)) / self.n_classes
        self.trees = []
        for _ in range(self.ne):
            preds = np.argmax(self.probs, axis=1)
            residuals = np.zeros_like(self.probs)
            for c in range(self.n_classes):
                residuals[:, c] = (y == c).astype(float) - self.probs[:, c]
            for c in range(self.n_classes):
                t = SimpleTree(self.md)
                t.fit(X, residuals[:, c])
                self.trees.append((c, t))
                pred = t.predict(X)
                self.probs[:, c] += self.lr * pred
            norms = np.sum(self.probs, axis=1, keepdims=True)
            self.probs = self.probs / norms
        return self
    def predict(self, X):
        return np.argmax(self.probs, axis=1)

np.random.seed(42)
n = 150
n1, n2, n3 = n // 3, n // 3, n - 2 * (n // 3)
X1 = np.random.randn(n1, 2) * 0.8 + [2, 2]
X2 = np.random.randn(n2, 2) * 0.8 + [-2, 2]
X3 = np.random.randn(n3, 2) * 0.8 + [0, -2]
X = np.vstack([X1, X2, X3])
y = np.array([0] * n1 + [1] * n2 + [2] * n3)

model = GradientBoosting(n_estimators=20, lr=0.1, max_depth=3)
model.fit(X, y)

from sklearn.ensemble import GradientBoostingClassifier
sk = GradientBoostingClassifier(n_estimators=20, learning_rate=0.1, max_depth=3, random_state=42)
sk.fit(X, y)

sp = model.predict(X)
skp = sk.predict(X)
json.dumps({
    "scratch": {"accuracy": float(np.mean(sp == y))},
    "sklearn": {"accuracy": float(np.mean(skp == y))},
    "comparison": {"accuracy_diff": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))),
        "match": abs(float(np.mean(sp == y)) - float(np.mean(skp == y))) < 0.15}
})`.trim(),concepts:["Boosting: build trees sequentially, each correcting the last","Gradient descent in function space — each tree fits the residual","Learning rate shrinks each tree's contribution","Combines many weak learners into one strong learner"]}};var n=a.i(38835),o=a.i(79362);let p=(0,a.i(64831).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);var q=a.i(17770),r=a.i(18688),s=a.i(82143);function t(){let{isReady:a,run:j,loadPkgs:k}=(0,d.usePyodide)(),[l,t]=(0,c.useState)("linear-regression"),[u,v]=(0,c.useState)(null),[w,x]=(0,c.useState)(!1),[y,z]=(0,c.useState)("compare"),[A,B]=(0,c.useState)(!1),C=m[l],D=(0,c.useCallback)(async()=>{A||(await k(["scikit-learn"]),B(!0))},[A,k]),E=(0,c.useCallback)(async()=>{if(a&&C){x(!0);try{await D();let a=await j(C.scratch_code);v(a)}catch(a){console.error("From-scratch error:",a)}finally{x(!1)}}},[a,C,j,D]);return(0,c.useEffect)(()=>{let b=!0;if(a&&C){let a=setTimeout(()=>{b&&E()},0);return()=>{b=!1,clearTimeout(a)}}},[a,l,C,E]),(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsx)(s.PyodideStatus,{}),(0,b.jsx)("div",{className:"flex items-center justify-between",children:(0,b.jsxs)("div",{children:[(0,b.jsxs)("h1",{className:"text-2xl font-bold flex items-center gap-2",children:[(0,b.jsx)(q.Code2,{className:"w-6 h-6 text-orange-400"}),"From Scratch Mode"]}),(0,b.jsx)("p",{className:"text-sm text-zinc-400 mt-1",children:"Build algorithms with NumPy, then compare with sklearn. Understand the math, not just the API."})]})}),(0,b.jsx)("div",{className:"flex gap-2",children:Object.entries(m).map(([a,c])=>(0,b.jsx)(h.Button,{variant:l===a?"default":"ghost",size:"sm",onClick:()=>{t(a),v(null)},className:l===a?"bg-orange-600 text-white":"text-zinc-400",children:c.name},a))}),(0,b.jsxs)(f.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-3",children:[(0,b.jsx)(r.BookOpen,{className:"w-4 h-4 text-amber-400"}),(0,b.jsxs)("h3",{className:"text-sm font-semibold text-zinc-200",children:["Key Concepts — ",C?.name]})]}),(0,b.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:C?.concepts.map((a,c)=>(0,b.jsxs)("div",{className:"bg-zinc-800 rounded-lg p-3 text-xs text-zinc-400 leading-relaxed",children:[(0,b.jsxs)("span",{className:"text-amber-400 font-mono mr-1",children:[c+1,"."]}),a]},c))})]}),(0,b.jsxs)(i.Tabs,{value:y,onValueChange:z,children:[(0,b.jsxs)(i.TabsList,{className:"bg-zinc-800",children:[(0,b.jsx)(i.TabsTrigger,{value:"compare",className:"text-xs",children:"Side-by-Side"}),(0,b.jsx)(i.TabsTrigger,{value:"code",className:"text-xs",children:"Full Code"})]}),(0,b.jsx)(i.TabsContent,{value:"compare",className:"mt-4",children:u&&(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,b.jsxs)(f.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsx)("h3",{className:"font-semibold text-zinc-200",children:"From Scratch (NumPy)"}),(0,b.jsx)(g.Badge,{className:"bg-amber-600/20 text-amber-400 text-xs",children:"Manual Implementation"})]}),(0,b.jsx)("div",{className:"space-y-3",children:Object.entries(u.scratch).map(([a,c])=>(0,b.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,b.jsx)("span",{className:"text-zinc-500 capitalize",children:a.replace(/_/g," ")}),(0,b.jsx)("span",{className:"font-mono text-zinc-300 text-xs",children:"number"==typeof c?c.toFixed(4):"object"==typeof c?JSON.stringify(c):String(c)})]},a))})]}),(0,b.jsxs)(f.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsx)("h3",{className:"font-semibold text-zinc-200",children:"Production (sklearn)"}),(0,b.jsx)(g.Badge,{className:"bg-blue-600/20 text-blue-400 text-xs",children:"Mature Library"})]}),(0,b.jsx)("div",{className:"space-y-3",children:Object.entries(u.sklearn).map(([a,c])=>(0,b.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,b.jsx)("span",{className:"text-zinc-500 capitalize",children:a.replace(/_/g," ")}),(0,b.jsx)("span",{className:"font-mono text-zinc-300 text-xs",children:"number"==typeof c?c.toFixed(4):"object"==typeof c?JSON.stringify(c):String(c)})]},a))})]}),(0,b.jsx)(f.Card,{className:`md:col-span-2 p-5 border ${u.comparison.match?"border-emerald-500/50 bg-emerald-950/20":"border-amber-500/50 bg-amber-950/20"}`,children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[u.comparison.match?(0,b.jsx)(o.CheckCircle,{className:"w-5 h-5 text-emerald-400"}):(0,b.jsx)(p,{className:"w-5 h-5 text-amber-400"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"font-semibold text-zinc-200",children:u.comparison.match?"Results Match!":"Results Differ"}),(0,b.jsx)("p",{className:"text-sm text-zinc-400",children:u.comparison.match?"Your from-scratch implementation produces the same results as sklearn. You understand the algorithm.":`Accuracy difference: ${(u.comparison.accuracy_diff??u.comparison.weight_diff??0).toFixed(4)}. This is expected — sklearn uses optimized solvers and numerical tricks.`})]})]})})]})}),(0,b.jsx)(i.TabsContent,{value:"code",className:"mt-4",children:(0,b.jsx)(f.Card,{className:"bg-zinc-900 border-zinc-800 overflow-hidden",children:(0,b.jsx)("div",{className:"h-[500px]",children:(0,b.jsx)(e.default,{height:"500px",defaultLanguage:"python",value:C?.scratch_code??"",theme:"vs-dark",options:{fontSize:13,fontFamily:"var(--font-geist-mono), monospace",minimap:{enabled:!1},readOnly:!0,padding:{top:12},scrollBeyondLastLine:!1}})})})})]}),(0,b.jsxs)(h.Button,{onClick:E,disabled:!a||w,className:"bg-orange-600 hover:bg-orange-700",children:[(0,b.jsx)(n.Play,{className:"w-4 h-4 mr-2"}),w?A?"Running...":"Loading sklearn...":"Run Comparison"]})]})}var u=a.i(31868);a.s(["default",0,function(){return(0,b.jsxs)("div",{className:"min-h-screen bg-zinc-950 text-white",children:[(0,b.jsx)(u.PlatformNav,{}),(0,b.jsx)("main",{className:"max-w-[1600px] mx-auto px-6 py-8",children:(0,b.jsx)(t,{})})]})}],12558)}];

//# sourceMappingURL=src_app_%28platform%29_from-scratch_page_tsx_0_p7g26._.js.map