const LINEAR_REGRESSION_FROM_SCRATCH = `
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
})`;

const LOGISTIC_REGRESSION_FROM_SCRATCH = `
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
})`;

const KNN_FROM_SCRATCH = `
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
})`;

const DECISION_TREE_FROM_SCRATCH = `
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
})`;

export const from_scratch_algorithms: Record<
  string,
  {
    name: string;
    scratch_code: string;
    concepts: string[];
  }
> = {
  "linear-regression": {
    name: "Linear Regression",
    scratch_code: LINEAR_REGRESSION_FROM_SCRATCH.trim(),
    concepts: [
      "Weights (w) and bias (b) are learned parameters",
      "Mean Squared Error measures prediction quality",
      "Gradient descent updates weights: w -= lr * gradient",
      "Regularization penalizes large weights to prevent overfitting",
    ],
  },
  "logistic-regression": {
    name: "Logistic Regression",
    scratch_code: LOGISTIC_REGRESSION_FROM_SCRATCH.trim(),
    concepts: [
      "Sigmoid function maps any value to [0, 1]",
      "Cross-entropy loss measures classification quality",
      "Decision threshold converts probabilities to classes",
      "The decision boundary is a line in feature space",
    ],
  },
  knn: {
    name: "K-Nearest Neighbors",
    scratch_code: KNN_FROM_SCRATCH.trim(),
    concepts: [
      "KNN is a lazy learner — no training phase",
      "Distance metric determines similarity",
      "K controls the bias-variance tradeoff",
      "Majority vote among k nearest neighbors decides the class",
    ],
  },
  "decision-tree": {
    name: "Decision Tree",
    scratch_code: DECISION_TREE_FROM_SCRATCH.trim(),
    concepts: [
      "Gini impurity measures node purity",
      "Recursive splitting creates the tree structure",
      "max_depth controls overfitting",
      "Each internal node splits on one feature at one threshold",
    ],
  },
  "naive-bayes": {
    name: "Naive Bayes",
    scratch_code: `
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
})`.trim(),
    concepts: [
      "Bayes' theorem: P(class|features) ∝ P(features|class) * P(class)",
      "Naive assumption: features are independent given the class",
      "Gaussian distribution models continuous features",
      "Log probabilities prevent numerical underflow",
    ],
  },
  "gradient-boosting": {
    name: "Gradient Boosting",
    scratch_code: `
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
})`.trim(),
    concepts: [
      "Boosting: build trees sequentially, each correcting the last",
      "Gradient descent in function space — each tree fits the residual",
      "Learning rate shrinks each tree's contribution",
      "Combines many weak learners into one strong learner",
    ],
  },
};
