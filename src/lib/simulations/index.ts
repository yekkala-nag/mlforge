import type { Simulation } from "@/lib/types/simulation";

export const simulations: Simulation[] = [
  {
    id: "linear-regression",
    name: "Linear Regression",
    description:
      "Fit a straight line to data by minimizing mean squared error. Watch the line move in real-time as you adjust learning rate, iterations, and regularization.",
    icon: "📈",
    parameters: [
      { id: "learning_rate", label: "Learning Rate", type: "slider", min: 0.001, max: 0.5, step: 0.001, default: 0.05, description: "How big each gradient step is" },
      { id: "iterations", label: "Iterations", type: "slider", min: 1, max: 500, step: 1, default: 100, description: "Number of training steps" },
      { id: "regularization", label: "Regularization (L2)", type: "slider", min: 0, max: 1, step: 0.01, default: 0, description: "Penalizes large weights" },
      { id: "noise", label: "Noise Level", type: "slider", min: 0, max: 3, step: 0.1, default: 0.5, description: "Random noise in data" },
      { id: "n_samples", label: "Data Points", type: "slider", min: 10, max: 500, step: 10, default: 100 },
      { id: "seed", label: "Random Seed", type: "slider", min: 1, max: 100, step: 1, default: 42 },
    ],
    defaultParams: { learning_rate: 0.05, iterations: 100, regularization: 0, noise: 0.5, n_samples: 100, seed: 42 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(int(params["seed"]))
n = int(params["n_samples"])
lr = float(params["learning_rate"])
iters = int(params["iterations"])
reg = float(params["regularization"])
noise = float(params["noise"])
X = np.random.uniform(-5, 5, n)
y = 2.5 * X + 1.0 + np.random.normal(0, noise, n)
Xm, Xs = np.mean(X), np.std(X)+1e-8
Xn = (X - Xm) / Xs
w, b = 0.0, 0.0
loss = []
snapshots = []
snap_interval = max(1, iters // 20)
for step in range(iters):
    yp = w*Xn+b; e = yp-y
    loss.append(float(np.mean(e**2)+reg*w**2))
    w -= lr*((2/n)*np.sum(e*Xn)+2*reg*w)
    b -= lr*((2/n)*np.sum(e))
    if step % snap_interval == 0 or step == iters-1:
      xl = np.linspace(X.min(),X.max(),100)
      snapshots.append({"step":step,"w":float(w),"b":float(b),"loss":loss[-1],
        "line":[{"x":float(xl[i]),"y":float(w*((xl[i]-Xm)/Xs)+b)} for i in range(100)]})
yf = w*Xn+b
xl = np.linspace(X.min(),X.max(),100)
json.dumps({"points":[{"x":float(X[i]),"y":float(y[i]),"predicted":float(yf[i])} for i in range(n)],
  "line":[{"x":float(xl[i]),"y":float(w*((xl[i]-Xm)/Xs)+b)} for i in range(100)],
  "lossHistory":loss,"snapshots":snapshots,
  "metrics":{"r_squared":round(float(1-np.sum((y-yf)**2)/(np.sum((y-np.mean(y))**2)+1e-8)),4),
    "mse":round(float(np.mean((y-yf)**2)),4)},
  "intermediate":{"weight":float(w),"bias":float(b)}})`,
  },
  {
    id: "logistic-regression",
    name: "Logistic Regression",
    description:
      "Classify data by learning a decision boundary. Watch sigmoid transform probabilities and the boundary move as you tune parameters.",
    icon: "📊",
    parameters: [
      { id: "learning_rate", label: "Learning Rate", type: "slider", min: 0.001, max: 1.0, step: 0.001, default: 0.1 },
      { id: "iterations", label: "Iterations", type: "slider", min: 10, max: 500, step: 10, default: 100 },
      { id: "C", label: "Regularization (C)", type: "slider", min: 0.01, max: 100, step: 0.01, default: 1.0, description: "Inverse regularization strength" },
      { id: "threshold", label: "Decision Threshold", type: "slider", min: 0.1, max: 0.9, step: 0.05, default: 0.5 },
      { id: "noise", label: "Noise Level", type: "slider", min: 0, max: 2, step: 0.1, default: 0.5 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 20, max: 300, step: 10, default: 100 },
    ],
    defaultParams: { learning_rate: 0.1, iterations: 100, C: 1.0, threshold: 0.5, noise: 0.5, n_samples: 100 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);noise=float(params["noise"])
lr=float(params["learning_rate"]);C=float(params["C"])
thr=float(params["threshold"]);iters=int(params["iterations"])
n1=n//2
X1=np.random.randn(n1,2)*noise+[2,2]
X2=np.random.randn(n-n1,2)*noise+[-2,-2]
X=np.vstack([X1,X2]);y=np.array([1]*n1+[0]*(n-n1))
Xm=np.mean(X,0);Xs=np.std(X,0)+1e-8;Xn=(X-Xm)/Xs
w=np.zeros(2);b=0.0
def sig(z):return 1/(1+np.exp(-np.clip(z,-500,500)))
loss=[];snapshots=[];si=max(1,iters//20)
for step in range(iters):
    p=sig(Xn@w+b);e=p-y
    loss.append(float(-np.mean(y*np.log(p+1e-8)+(1-y)*np.log(1-p+1e-8))))
    w-=lr*((1/n)*(Xn.T@e)+(1/C)*w);b-=lr*((1/n)*np.sum(e))
    if step%si==0 or step==iters-1:
      xx,yy=np.meshgrid(np.linspace(X[:,0].min()-1,X[:,0].max()+1,80),
        np.linspace(X[:,1].min()-1,X[:,1].max()+1,80))
      gn=np.c_[(xx.ravel()-Xm[0])/Xs[0],(yy.ravel()-Xm[1])/Xs[1]]
      bn=sig(gn@w+b).reshape(xx.shape)
      snapshots.append({"step":step,"boundary":bn.tolist(),"loss":loss[-1]})
zf=Xn@w+b;probs=sig(zf);pf=(probs>=thr).astype(int)
acc=float(np.mean(pf==y))
xx,yy=np.meshgrid(np.linspace(X[:,0].min()-1,X[:,0].max()+1,80),
  np.linspace(X[:,1].min()-1,X[:,1].max()+1,80))
gn=np.c_[(xx.ravel()-Xm[0])/Xs[0],(yy.ravel()-Xm[1])/Xs[1]]
bn=sig(gn@w+b).reshape(xx.shape)
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(y[i])} for i in range(n)],
  "decisionBoundary":bn.tolist(),"lossHistory":loss,"snapshots":snapshots,
  "metrics":{"accuracy":round(acc,4)},
  "intermediate":{"weights":w.tolist(),"bias":float(b)}})`,
  },
  {
    id: "knn",
    name: "K-Nearest Neighbors",
    description:
      "Classify points by majority vote of their k nearest neighbors. Change k to see the decision boundary shift from smooth to jagged.",
    icon: "📍",
    parameters: [
      { id: "k", label: "K (Neighbors)", type: "slider", min: 1, max: 30, step: 1, default: 5, description: "Number of neighbors to vote" },
      { id: "noise", label: "Noise Level", type: "slider", min: 0.2, max: 2, step: 0.1, default: 0.8 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 20, max: 300, step: 10, default: 100 },
    ],
    defaultParams: { k: 5, noise: 0.8, n_samples: 100 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);k=int(params["k"]);noise=float(params["noise"])
n1=n//3;n2=n//3;n3=n-n1-n2
X1=np.random.randn(n1,2)*noise+[3,3]
X2=np.random.randn(n2,2)*noise+[-3,3]
X3=np.random.randn(n3,2)*noise+[0,-3]
X=np.vstack([X1,X2,X3]);y=np.array([0]*n1+[1]*n2+[2]*n3)
sp=int(0.8*len(X));Xtr,Xte,ytr,yte=X[:sp],X[sp:],y[:sp],y[sp:]
def pred(Xt,yt,xq,kv):
    d=np.sqrt(np.sum((Xt-xq)**2,axis=1))
    return int(np.argmax(np.bincount(yt[np.argsort(d)[:kv]],minlength=3)))
pr=np.array([pred(Xtr,yte,x,k) for x in Xte])
acc=float(np.mean(pr==yte))
xx,yy=np.meshgrid(np.linspace(X[:,0].min()-2,X[:,0].max()+2,80),
  np.linspace(X[:,1].min()-2,X[:,1].max()+2,80))
bn=np.array([pred(Xtr,ytr,x,k) for x in np.c_[xx.ravel(),yy.ravel()]]).reshape(xx.shape)
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(y[i])} for i in range(n)],
  "decisionBoundary":bn.tolist(),"metrics":{"accuracy":round(acc,4)},
  "intermediate":{"k":k},"lossHistory":[],"line":[]})`,
  },
  {
    id: "decision-tree",
    name: "Decision Tree",
    description:
      "Watch a tree grow by recursive splitting. Increase max_depth to go from underfitting to overfitting and see it happen.",
    icon: "🌳",
    parameters: [
      { id: "max_depth", label: "Max Depth", type: "slider", min: 1, max: 12, step: 1, default: 4, description: "Maximum tree depth" },
      { id: "min_samples_split", label: "Min Samples Split", type: "slider", min: 2, max: 20, step: 1, default: 5 },
      { id: "noise", label: "Noise Level", type: "slider", min: 0.2, max: 2, step: 0.1, default: 0.5 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 30, max: 300, step: 10, default: 150 },
    ],
    defaultParams: { max_depth: 4, min_samples_split: 5, noise: 0.5, n_samples: 150 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);md=int(params["max_depth"])
ms=int(params["min_samples_split"]);noise=float(params["noise"])
n1=n//3;n2=n//3;n3=n-n1-n2
X1=np.random.randn(n1,2)*noise+[2,2]
X2=np.random.randn(n2,2)*noise+[-2,2]
X3=np.random.randn(n3,2)*noise+[0,-2]
X=np.vstack([X1,X2,X3]);y=np.array([0]*n1+[1]*n2+[2]*n3)
nc=[0]
def gini(l):
    c=np.bincount(l,minlength=3);p=c/len(l);return 1-np.sum(p**2)
def build(Xn,yn,d):
    nid=str(nc[0]);nc[0]+=1
    c=np.bincount(yn,minlength=3);pred=int(np.argmax(c))
    if d>=md or len(yn)<ms or gini(yn)==0:
      return {"id":nid,"isLeaf":True,"value":pred,"samples":len(yn)}
    bg,bf,bt=float("inf"),0,0.0
    for f in range(Xn.shape[1]):
      for t in np.unique(Xn[:,f]):
        left=yn[Xn[:,f]<=t];right=yn[Xn[:,f]>t]
        if len(left)==0 or len(right)==0:continue
        g=(len(left)*gini(left)+len(right)*gini(right))/len(yn)
        if g<bg:bg,bf,bt=g,f,float(t)
    lm=Xn[:,bf]<=bt
    lc=build(Xn[lm],yn[lm],d+1);rc=build(Xn[~lm],yn[~lm],d+1)
    return {"id":nid,"isLeaf":False,"feature":bf,"threshold":bt,
      "left":lc["id"],"right":rc["id"],"children":[lc,rc],"samples":len(yn)}
tree=build(X,y,0)
def pred(x,n):
    if n["isLeaf"]:return n["value"]
    if x[n["feature"]]<=n["threshold"]:
      return pred(x,next(c for c in n["children"] if c["id"]==n["left"]))
    return pred(x,next(c for c in n["children"] if c["id"]==n["right"]))
prs=np.array([pred(x,tree) for x in X]);acc=float(np.mean(prs==y))
xx,yy=np.meshgrid(np.linspace(X[:,0].min()-1,X[:,0].max()+1,80),
  np.linspace(X[:,1].min()-1,X[:,1].max()+1,80))
bn=np.array([pred(x,tree) for x in np.c_[xx.ravel(),yy.ravel()]]).reshape(xx.shape)
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(y[i])} for i in range(n)],
  "decisionBoundary":bn.tolist(),"treeNodes":tree,
  "metrics":{"accuracy":round(acc,4)},"lossHistory":[],"line":[]})`,
  },
  {
    id: "random-forest",
    name: "Random Forest",
    description:
      "An ensemble of decision trees. Increase n_estimators to see how voting across many trees improves accuracy and smooths boundaries.",
    icon: "🌲",
    parameters: [
      { id: "n_estimators", label: "Number of Trees", type: "slider", min: 1, max: 50, step: 1, default: 10 },
      { id: "max_depth", label: "Max Depth", type: "slider", min: 1, max: 12, step: 1, default: 5 },
      { id: "noise", label: "Noise Level", type: "slider", min: 0.2, max: 2, step: 0.1, default: 0.6 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 30, max: 300, step: 10, default: 200 },
    ],
    defaultParams: { n_estimators: 10, max_depth: 5, noise: 0.6, n_samples: 200 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);nt=int(params["n_estimators"])
md=int(params["max_depth"]);noise=float(params["noise"])
n1=n//3;n2=n//3;n3=n-n1-n2
X1=np.random.randn(n1,2)*noise+[2.5,2.5]
X2=np.random.randn(n2,2)*noise+[-2.5,2.5]
X3=np.random.randn(n3,2)*noise+[0,-2.5]
X=np.vstack([X1,X2,X3]);y=np.array([0]*n1+[1]*n2+[2]*n3)
def gini(l):
    c=np.bincount(l,minlength=3);return 1-np.sum((c/len(l))**2)
def build(Xn,yn,d):
    nc=str(np.random.randint(10000))
    c=np.bincount(yn,minlength=3);pred=int(np.argmax(c))
    if d>=md or len(yn)<5 or gini(yn)==0:
      return {"id":nc,"isLeaf":True,"value":pred}
    bg,bf,bt=float("inf"),0,0.0
    fi=np.random.choice(Xn.shape[1],size=min(max(1,int(np.sqrt(Xn.shape[1]))),Xn.shape[1]),replace=False)
    for f in fi:
      for t in np.percentile(Xn[:,f],np.linspace(10,90,5)):
        left=yn[Xn[:,f]<=t];right=yn[Xn[:,f]>t]
        if len(left)==0 or len(right)==0:continue
        g=(len(left)*gini(left)+len(right)*gini(right))/len(yn)
        if g<bg:bg,bf,bt=g,f,float(t)
    lm=Xn[:,bf]<=bt
    return {"id":nc,"isLeaf":False,"feature":bf,"threshold":bt,
      "left":build(Xn[lm],yn[lm],d+1)["id"],"right":build(Xn[~lm],yn[~lm],d+1)["id"],
      "children":[build(Xn[lm],yn[lm],d+1),build(Xn[~lm],yn[~lm],d+1)]}
trees=[build(X[np.random.choice(len(X),len(X),replace=True)],
  y[np.random.choice(len(X),len(X),replace=True)],0) for _ in range(nt)]
def pred(x,n):
    if n["isLeaf"]:return n["value"]
    if x[n["feature"]]<=n["threshold"]:
      return pred(x,next(c for c in n["children"] if c["id"]==n["left"]))
    return pred(x,next(c for c in n["children"] if c["id"]==n["right"]))
prs=np.array([int(np.argmax(np.bincount([pred(x,t) for t in trees],minlength=3))) for x in X])
acc=float(np.mean(prs==y))
xx,yy=np.meshgrid(np.linspace(X[:,0].min()-1,X[:,0].max()+1,80),
  np.linspace(X[:,1].min()-1,X[:,1].max()+1,80))
bn=np.array([int(np.argmax(np.bincount([pred(x,t) for t in trees],minlength=3)))
  for x in np.c_[xx.ravel(),yy.ravel()]]).reshape(xx.shape)
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(y[i])} for i in range(n)],
  "decisionBoundary":bn.tolist(),
  "metrics":{"accuracy":round(acc,4),"n_trees":nt},"lossHistory":[],"line":[]})`,
  },
  {
    id: "kmeans",
    name: "K-Means Clustering",
    description:
      "Watch centroids move and points reassign in real-time. Change k to see how cluster count affects the grouping.",
    icon: "🎯",
    parameters: [
      { id: "k", label: "K (Clusters)", type: "slider", min: 2, max: 8, step: 1, default: 3 },
      { id: "max_iter", label: "Max Iterations", type: "slider", min: 1, max: 50, step: 1, default: 20 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 20, max: 300, step: 10, default: 150 },
    ],
    defaultParams: { k: 3, max_iter: 20, n_samples: 150 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);k=int(params["k"]);mi=int(params["max_iter"])
cents=np.array([[3,3],[-3,3],[0,-3],[4,-2],[-4,-2]])[:k]
chunks=np.array_split(np.random.randn(n,2),k)
X=np.vstack([c*0.8+ct for c,ct in zip(chunks,cents)])
cent=X[np.random.choice(len(X),k,replace=False)]
hist=[]
for it in range(mi):
    d=np.sqrt(np.sum([(X-c)**2 for c in cent],axis=1).T)
    a=np.argmin(d,axis=1)
    hist.append({"centroids":cent.tolist(),"assignments":a.tolist(),
      "inertia":float(np.sum(np.min(d**2,axis=1)))})
    nc=np.array([X[a==i].mean(0) if np.sum(a==i)>0 else cent[i] for i in range(k)])
    if np.allclose(cent,nc,atol=1e-6):break
    cent=nc
fd=np.sqrt(np.sum([(X-c)**2 for c in cent],axis=1).T)
fa=np.argmin(fd,axis=1)
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(fa[i])} for i in range(n)],
  "centroids":[{"x":float(c[0]),"y":float(c[1])} for c in cent],
  "history":hist,"metrics":{"inertia":round(float(np.sum(np.min(fd**2,axis=1))),4),"iterations":len(hist)},
  "lossHistory":[h["inertia"] for h in hist],"line":[]})`,
  },
  {
    id: "svm",
    name: "Support Vector Machine",
    description:
      "Maximize the margin between classes. Change C to see the trade-off between margin width and classification errors.",
    icon: "⚔️",
    parameters: [
      { id: "C", label: "C (Regularization)", type: "slider", min: 0.01, max: 100, step: 0.01, default: 1.0, description: "Trade-off: wide margin vs fewer errors" },
      { id: "gamma", label: "Gamma (RBF)", type: "slider", min: 0.01, max: 5, step: 0.01, default: 0.5, description: "Kernel width" },
      { id: "noise", label: "Noise Level", type: "slider", min: 0.2, max: 2, step: 0.1, default: 0.5 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 20, max: 200, step: 10, default: 100 },
    ],
    defaultParams: { C: 1.0, gamma: 0.5, noise: 0.5, n_samples: 100 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);C=float(params["C"]);g=float(params["gamma"])
noise=float(params["noise"])
n1=n//2
X1=np.random.randn(n1,2)*noise+[2,2]
X2=np.random.randn(n-n1,2)*noise+[-2,-2]
X=np.vstack([X1,X2]);y=np.array([1]*n1+[-1]*(n-n1))
Xm=np.mean(X,0);Xs=np.std(X,0)+1e-8;Xn=(X-Xm)/Xs
def kf(X1,X2):return np.exp(-g*(np.sum(X1**2,1).reshape(-1,1)+np.sum(X2**2,1).reshape(1,-2)-2*X1@X2.T))
K=kf(Xn,Xn);a=np.zeros(len(X));b=0.0;lr=0.001;lh=[]
for _ in range(200):
    m=y*(K@a+b);hl=np.maximum(0,1-m)
    lh.append(float(0.5*a@K@a+C*np.sum(hl)))
    g2=K@a-y*(hl>0).astype(float)*y
    a=a-lr*(g2+C*a);a=np.clip(a,0,C)
    sm=a>1e-6
    if np.any(sm):b=np.mean(y[sm]-K[sm]@a)
xx,yy=np.meshgrid(np.linspace(X[:,0].min()-2,X[:,0].max()+2,80),
  np.linspace(X[:,1].min()-2,X[:,1].max()+2,80))
gn=(np.c_[xx.ravel(),yy.ravel()]-Xm)/Xs
Kg=kf(gn,Xn);bv=(Kg@a+b).reshape(xx.shape)
pr=np.sign(K@a+b);acc=float(np.mean(pr==y))
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int((y[i]+1)/2)} for i in range(n)],
  "decisionBoundary":bv.tolist(),"lossHistory":lh,
  "metrics":{"accuracy":round(acc,4)},"intermediate":{"C":C,"gamma":g},"line":[]})`,
  },
  {
    id: "naive-bayes",
    name: "Naive Bayes",
    description:
      "Probabilistic classifier using Bayes' theorem with independence assumptions. Fast and effective for text classification.",
    icon: "🎲",
    parameters: [
      { id: "var_smoothing", label: "Variance Smoothing", type: "slider", min: 0.0001, max: 1, step: 0.0001, default: 0.1, description: "Adds variance to features for stability" },
      { id: "noise", label: "Noise Level", type: "slider", min: 0.2, max: 2, step: 0.1, default: 0.5 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 20, max: 300, step: 10, default: 150 },
    ],
    defaultParams: { var_smoothing: 0.1, noise: 0.5, n_samples: 150 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);vs=float(params["var_smoothing"]);noise=float(params["noise"])
n1=n//3;n2=n//3;n3=n-2*(n//3)
X1=np.random.randn(n1,2)*noise+[2,2]
X2=np.random.randn(n2,2)*noise+[-2,2]
X3=np.random.randn(n3,2)*noise+[0,-2]
X=np.vstack([X1,X2,X3]);y=np.array([0]*n1+[1]*n2+[2]*n3)
classes=np.unique(y);priors={c:np.mean(y==c) for c in classes}
means={c:X[y==c].mean(0) for c in classes}
variances={c:X[y==c].var(0)+vs for c in classes}
def log_pdf(x,m,v):return -0.5*np.sum(np.log(2*np.pi*v)+(x-m)**2/v)
def predict(Xt):
  preds=[]
  for x in Xt:
    logs=[np.log(priors[c])+log_pdf(x,means[c],variances[c]) for c in classes]
    preds.append(classes[np.argmax(logs)])
  return np.array(preds)
sp=predict(X)
acc=float(np.mean(sp==y))
from sklearn.naive_bayes import GaussianNB
sk=GaussianNB(var_smoothing=vs);sk.fit(X,y);skp=sk.predict(X)
sacc=float(np.mean(skp==y))
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(y[i])} for i in range(n)],
  "metrics":{"accuracy":round(acc,4),"sklearn_accuracy":round(sacc,4)},
  "lossHistory":[],"line":[]})`,
  },
  {
    id: "gradient-boosting",
    name: "Gradient Boosting",
    description:
      "Build trees sequentially, each correcting the errors of the previous. One of the most powerful ML algorithms.",
    icon: "🏔️",
    parameters: [
      { id: "n_estimators", label: "Number of Trees", type: "slider", min: 1, max: 100, step: 1, default: 20 },
      { id: "learning_rate", label: "Learning Rate", type: "slider", min: 0.01, max: 1, step: 0.01, default: 0.1 },
      { id: "max_depth", label: "Max Depth", type: "slider", min: 1, max: 10, step: 1, default: 3 },
      { id: "noise", label: "Noise Level", type: "slider", min: 0.2, max: 2, step: 0.1, default: 0.5 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 20, max: 300, step: 10, default: 150 },
    ],
    defaultParams: { n_estimators: 20, learning_rate: 0.1, max_depth: 3, noise: 0.5, n_samples: 150 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);ne=int(params["n_estimators"]);lr=float(params["learning_rate"])
md=int(params["max_depth"]);noise=float(params["noise"])
n1=n//3;n2=n//3;n3=n-2*(n//3)
X1=np.random.randn(n1,2)*noise+[2,2]
X2=np.random.randn(n2,2)*noise+[-2,2]
X3=np.random.randn(n3,2)*noise+[0,-2]
X=np.vstack([X1,X2,X3]);y=np.array([0]*n1+[1]*n2+[2]*n3)
n_classes=3
class SimpleTree:
  def __init__(self,md=3):
    self.md=md;self.tree=None
  def fit(self,X,y):
    self.tree=self._build(X,y,0)
  def _build(self,X,y,d):
    if d>=self.md or len(np.unique(y))<=1 or len(y)<2:
      vals,counts=np.unique(y,return_counts=True);return {"leaf":True,"val":vals[np.argmax(counts)]}
    bg,bf,bt=float("inf"),0,0.0
    for f in range(X.shape[1]):
      for t in np.percentile(X[:,f],np.linspace(20,80,5)):
        lm=X[:,f]<=t
        if sum(lm)==0 or sum(~lm)==0:continue
        g=0
        for c in np.unique(y):
          for s in [lm,~lm]:
            p=np.mean(y[s]==c);g-=np.sum(y[s]==c)/len(y)*np.log(p+1e-8)
        if g<bg:bg,bf,bt=g,f,t
    lm=X[:,bf]<=bt
    return {"feat":bf,"thr":bt,"left":self._build(X[lm],y[lm],d+1),"right":self._build(X[~lm],y[~lm],d+1)}
  def predict(self,X):return np.array([self._pred(x,self.tree) for x in X])
  def _pred(self,x,n):
    if n.get("leaf"):return n["val"]
    if x[n["feat"]]<=n["thr"]:return self._pred(x,n["left"])
    return self._pred(x,n["right"])
probs=np.ones((n,n_classes))/n_classes
loss_hist=[]
for i in range(ne):
  preds=np.argmax(probs,axis=1)
  loss_hist.append(float(-np.mean([np.log(probs[j,y[j]]+1e-8) for j in range(n)])))
  residuals=np.zeros_like(probs)
  for c in range(n_classes):
    residuals[:,c]=(y==c).astype(float)-probs[:,c]
  for c in range(n_classes):
    t=SimpleTree(md);t.fit(X,residuals[:,c])
    pred=t.predict(X)
    probs[:,c]+=lr*pred
  norms=np.sum(probs,axis=1,keepdims=True);probs=probs/norms
fp=np.argmax(probs,axis=1);acc=float(np.mean(fp==y))
from sklearn.ensemble import GradientBoostingClassifier
sk=GradientBoostingClassifier(n_estimators=ne,learning_rate=lr,max_depth=md,random_state=42)
sk.fit(X,y);skp=sk.predict(X);sacc=float(np.mean(skp==y))
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(y[i])} for i in range(n)],
  "metrics":{"accuracy":round(acc,4),"sklearn_accuracy":round(sacc,4)},
  "lossHistory":loss_hist,"line":[]})`,
  },
  {
    id: "neural-network",
    name: "Neural Network",
    description:
      "A simple feedforward neural network. Watch the decision boundary evolve as you train. Adjust hidden layers and learning rate.",
    icon: "🧠",
    parameters: [
      { id: "hidden_size", label: "Hidden Units", type: "slider", min: 2, max: 32, step: 1, default: 8 },
      { id: "learning_rate", label: "Learning Rate", type: "slider", min: 0.001, max: 1, step: 0.001, default: 0.1 },
      { id: "epochs", label: "Epochs", type: "slider", min: 10, max: 500, step: 10, default: 100 },
      { id: "noise", label: "Noise Level", type: "slider", min: 0.2, max: 2, step: 0.1, default: 0.5 },
      { id: "n_samples", label: "Data Points", type: "slider", min: 20, max: 200, step: 10, default: 100 },
    ],
    defaultParams: { hidden_size: 8, learning_rate: 0.1, epochs: 100, noise: 0.5, n_samples: 100 },
    pythonCode: `import numpy as np, json
params = json.loads(params_json)
np.random.seed(42)
n=int(params["n_samples"]);hs=int(params["hidden_size"]);lr=float(params["learning_rate"])
ep=int(params["epochs"]);noise=float(params["noise"])
n1=n//2
X1=np.random.randn(n1,2)*noise+[2,2]
X2=np.random.randn(n-n1,2)*noise+[-2,-2]
X=np.vstack([X1,X2]);y=np.array([1]*n1+[0]*(n-n1))
Xm=X.mean(0);Xs=X.std(0)+1e-8;Xn=(X-Xm)/Xs
w1=np.random.randn(2,hs)*0.5;b1=np.zeros(hs)
w2=np.random.randn(hs,1)*0.5;b2=np.zeros(1)
def sigmoid(z):return 1/(1+np.exp(-np.clip(z,-500,500)))
loss_hist=[];snapshots=[];snap=max(1,ep//15)
for e in range(ep):
  h=np.maximum(0,Xn@w1+b1)
  o=sigmoid(h@w2+b2).flatten()
  o=np.clip(o,1e-8,1-1e-8)
  loss=float(-np.mean(y*np.log(o)+(1-y)*np.log(1-o)))
  loss_hist.append(loss)
  do=o-y;dh=(do.reshape(-1,1)*w2.T)*(h>0)
  dw2=h.T@do.reshape(-1,1)/n;db2=np.mean(do)
  dw1=Xn.T@dh/n;db1=np.mean(dh,axis=0)
  w2-=lr*dw2;b2-=lr*db2;w1-=lr*dw1;b1-=lr*db1
  if e%snap==0 or e==ep-1:
    xx,yy=np.meshgrid(np.linspace(Xn[:,0].min()-1,Xn[:,0].max()+1,60),
      np.linspace(Xn[:,1].min()-1,Xn[:,1].max()+1,60))
    g=np.maximum(0,np.c_[xx.ravel(),yy.ravel()]@w1+b1)
    gv=sigmoid(g@w2+b2).reshape(xx.shape)
    snapshots.append({"step":int(e),"loss":loss,"boundary":gv.tolist(),
      "grid_x":np.linspace(Xn[:,0].min()-1,Xn[:,0].max()-1,60).tolist(),
      "grid_y":np.linspace(Xn[:,1].min()-1,Xn[:,1].max()-1,60).tolist()})
pr=(o>=0.5).astype(int);acc=float(np.mean(pr==y))
json.dumps({"points":[{"x":float(X[i,0]),"y":float(X[i,1]),"cluster":int(y[i])} for i in range(n)],
  "metrics":{"accuracy":round(acc,4),"hidden_units":hs},
  "lossHistory":loss_hist,"snapshots":snapshots,"line":[]})`,
  },
];

export function getSimulation(id: string): Simulation | undefined {
  return simulations.find((s) => s.id === id);
}
