module.exports=[20459,a=>{"use strict";let b=(0,a.i(64831).default)("trophy",[["path",{d:"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2",key:"pwuv1l"}],["path",{d:"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2",key:"1y54w1"}],["path",{d:"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3",key:"e30mpu"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3",key:"i0yafy"}]]);a.s(["Trophy",0,b],20459)},11330,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(68136),e=a.i(91119),f=a.i(86304),g=a.i(99570),h=a.i(64831);let i=(0,h.default)("swords",[["polyline",{points:"14.5 17.5 3 6 3 3 6 3 17.5 14.5",key:"1hfsw2"}],["line",{x1:"13",x2:"19",y1:"19",y2:"13",key:"1vrmhu"}],["line",{x1:"16",x2:"20",y1:"16",y2:"20",key:"1bron3"}],["line",{x1:"19",x2:"21",y1:"21",y2:"19",key:"13pww6"}],["polyline",{points:"14.5 6.5 18 3 21 3 21 6 17.5 9.5",key:"hbey2j"}],["line",{x1:"5",x2:"9",y1:"14",y2:"18",key:"1hf58s"}],["line",{x1:"7",x2:"4",y1:"17",y2:"20",key:"pidxm4"}],["line",{x1:"3",x2:"5",y1:"19",y2:"21",key:"1pehsh"}]]);var j=a.i(20459);let k=(0,h.default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]),l=(0,h.default)("timer",[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]]),m=[{id:"logistic",name:"Logistic Regression",icon:"📊"},{id:"knn",name:"KNN (k=5)",icon:"📍"},{id:"tree",name:"Decision Tree",icon:"🌳"},{id:"forest",name:"Random Forest",icon:"🌲"},{id:"svm",name:"SVM (RBF)",icon:"⚔️"}],n=`import numpy as np, json, time

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

json.dumps(results)`;function o(){let{isReady:a,run:h}=(0,d.usePyodide)(),[o,p]=(0,c.useState)([]),[q,r]=(0,c.useState)(!1),[s,t]=(0,c.useState)("accuracy"),u=(0,c.useCallback)(async()=>{if(a){r(!0);try{let a=await h(n,{params_json:"{}"});a&&p(a)}catch(a){console.error("Arena error:",a)}finally{r(!1)}}},[a,h]),v=[...o].sort((a,b)=>"accuracy"===s?(b.metrics?.accuracy??b.accuracy??0)-(a.metrics?.accuracy??a.accuracy??0):(a.latency??999)-(b.latency??999)),w=v[0];return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("h1",{className:"text-2xl font-bold flex items-center gap-2",children:[(0,b.jsx)(i,{className:"w-6 h-6 text-orange-400"}),"Model Comparison Arena"]}),(0,b.jsx)("p",{className:"text-sm text-zinc-400 mt-1",children:"Run all algorithms on the same dataset. Compare accuracy, speed, and trade-offs."})]}),(0,b.jsx)(g.Button,{onClick:u,disabled:!a||q,className:"bg-orange-600 hover:bg-orange-700",children:q?"Evaluating...":"Run Arena"})]}),o.length>0&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)(g.Button,{variant:"accuracy"===s?"default":"ghost",size:"sm",onClick:()=>t("accuracy"),children:[(0,b.jsx)(k,{className:"w-4 h-4 mr-1"}),"By Accuracy"]}),(0,b.jsxs)(g.Button,{variant:"latency"===s?"default":"ghost",size:"sm",onClick:()=>t("latency"),children:[(0,b.jsx)(l,{className:"w-4 h-4 mr-1"}),"By Latency"]})]}),(0,b.jsx)(e.Card,{className:"bg-zinc-900 border-zinc-800 overflow-hidden",children:(0,b.jsxs)("table",{className:"w-full text-sm",children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{className:"border-b border-zinc-800",children:[(0,b.jsx)("th",{className:"px-4 py-3 text-left text-zinc-500 font-medium",children:"Model"}),(0,b.jsx)("th",{className:"px-4 py-3 text-right text-zinc-500 font-medium",children:"Accuracy"}),(0,b.jsx)("th",{className:"px-4 py-3 text-right text-zinc-500 font-medium",children:"Latency"}),(0,b.jsx)("th",{className:"px-4 py-3 text-center text-zinc-500 font-medium",children:"Verdict"})]})}),(0,b.jsx)("tbody",{children:v.map((a,c)=>{let d=a.metrics?.accuracy??a.accuracy??0,e=0===c;return(0,b.jsxs)("tr",{className:`border-b border-zinc-800/50 ${e?"bg-orange-950/20":""}`,children:[(0,b.jsxs)("td",{className:"px-4 py-3 font-medium text-zinc-200",children:[m.find(b=>b.name===a.name)?.icon," ",a.name]}),(0,b.jsx)("td",{className:"px-4 py-3 text-right",children:(0,b.jsxs)("span",{className:`font-mono ${d>=.9?"text-emerald-400":d>=.8?"text-amber-400":"text-red-400"}`,children:[(100*d).toFixed(1),"%"]})}),(0,b.jsxs)("td",{className:"px-4 py-3 text-right font-mono text-zinc-400",children:[a.latency,"ms"]}),(0,b.jsx)("td",{className:"px-4 py-3 text-center",children:e&&(0,b.jsxs)(f.Badge,{className:"bg-orange-600 text-white text-xs",children:[(0,b.jsx)(j.Trophy,{className:"w-3 h-3 mr-1"}),"Best"]})})]},a.name)})})]})}),(0,b.jsxs)(e.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,b.jsx)("h3",{className:"font-semibold text-zinc-200 mb-2",children:"Which model would you deploy? Why?"}),(0,b.jsx)("p",{className:"text-sm text-zinc-500 mb-3",children:"ML engineering is about trade-offs, not leaderboard scores. Consider accuracy, latency, interpretability, and maintenance cost."}),(0,b.jsxs)("div",{className:"grid grid-cols-3 gap-3",children:[(0,b.jsxs)("div",{className:"bg-zinc-800 rounded-lg p-3 text-center",children:[(0,b.jsx)("div",{className:"text-xs text-zinc-500 mb-1",children:"Fastest"}),(0,b.jsx)("div",{className:"text-sm font-medium text-zinc-200",children:v.length>0?[...v].sort((a,b)=>a.latency-b.latency)[0]?.name:"-"})]}),(0,b.jsxs)("div",{className:"bg-zinc-800 rounded-lg p-3 text-center",children:[(0,b.jsx)("div",{className:"text-xs text-zinc-500 mb-1",children:"Most Accurate"}),(0,b.jsx)("div",{className:"text-sm font-medium text-zinc-200",children:w?.name})]}),(0,b.jsxs)("div",{className:"bg-zinc-800 rounded-lg p-3 text-center",children:[(0,b.jsx)("div",{className:"text-xs text-zinc-500 mb-1",children:"Best Balance"}),(0,b.jsx)("div",{className:"text-sm font-medium text-zinc-200",children:v.length>0?[...v].sort((a,b)=>(b.metrics?.accuracy??b.accuracy??0)/Math.max(a.latency,1)-(a.metrics?.accuracy??a.accuracy??0)/Math.max(b.latency,1))[0]?.name:"-"})]})]})]})]}),0===o.length&&!q&&(0,b.jsxs)(e.Card,{className:"bg-zinc-900 border-zinc-800 p-12 text-center",children:[(0,b.jsx)(i,{className:"w-12 h-12 text-zinc-700 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-zinc-500",children:'Click "Run Arena" to evaluate all models on the same dataset.'})]})]})}var p=a.i(31868);a.s(["default",0,function(){return(0,b.jsxs)("div",{className:"min-h-screen bg-zinc-950 text-white",children:[(0,b.jsx)(p.PlatformNav,{}),(0,b.jsx)("main",{className:"max-w-[1600px] mx-auto px-6 py-8",children:(0,b.jsx)(o,{})})]})}],11330)}];

//# sourceMappingURL=_1as6ekr._.js.map