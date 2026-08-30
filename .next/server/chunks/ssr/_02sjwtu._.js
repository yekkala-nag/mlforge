module.exports=[79362,a=>{"use strict";let b=(0,a.i(64831).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);a.s(["CheckCircle",0,b],79362)},61664,a=>{"use strict";let b=(0,a.i(64831).default)("target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);a.s(["Target",0,b],61664)},20459,a=>{"use strict";let b=(0,a.i(64831).default)("trophy",[["path",{d:"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2",key:"pwuv1l"}],["path",{d:"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2",key:"1y54w1"}],["path",{d:"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3",key:"e30mpu"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3",key:"i0yafy"}]]);a.s(["Trophy",0,b],20459)},12294,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(68136),e=a.i(91119),f=a.i(86304),g=a.i(99570),h=a.i(92378),i=a.i(20459),j=a.i(61664),k=a.i(79362);let l=[{id:"ch1",title:"Classify the Iris",description:"Build a classifier that achieves >95% accuracy on the Iris dataset. Use any algorithm.",difficulty:"easy",constraints:["Accuracy > 95%","Inference < 10ms"],dataset:"iris",starterCode:`import numpy as np, json
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

# TODO: Build your classifier here
# model = ...

# model.fit(X_train, y_train)
# preds = model.predict(X_test)
# acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": 0.0, "completed": False})`,solutionCode:`import numpy as np, json
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
preds = model.predict(X_test)
acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": float(acc), "completed": bool(acc > 0.95)})`,hints:["Try Random Forest — it's robust and requires little tuning.","Make sure to split your data into train/test sets.","accuracy_score from sklearn.metrics gives you the metric."],scoringCriteria:[{metric:"accuracy",target:.95,weight:1}],timeLimit:300},{id:"ch2",title:"Imbalanced Fraud Detection",description:"You have 10,000 transactions with only 120 fraud cases. Build the best classifier. Accuracy is NOT the right metric.",difficulty:"hard",constraints:["Recall > 80%","Precision > 70%","No accuracy as primary metric"],dataset:"synthetic_fraud",starterCode:`import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score

np.random.seed(42)
n = 10000
X = np.random.randn(n, 5)
fraud = np.random.choice(n, 120, replace=False)
y = np.zeros(n)
y[fraud] = 1

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# TODO: Handle class imbalance and build a classifier
# Consider: class_weight='balanced', SMOTE, threshold tuning

json.dumps({"precision": 0.0, "recall": 0.0, "completed": False})`,solutionCode:`import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score

np.random.seed(42)
n = 10000
X = np.random.randn(n, 5)
fraud = np.random.choice(n, 120, replace=False)
y = np.zeros(n)
y[fraud] = 1

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)
model.fit(X_train, y_train)

# Tune threshold
probs = model.predict_proba(X_test)[:, 1]
threshold = 0.3
preds = (probs >= threshold).astype(int)

prec = precision_score(y_test, preds)
rec = recall_score(y_test, preds)

json.dumps({"precision": float(prec), "recall": float(rec), "completed": bool(prec > 0.7 and rec > 0.8)})`,hints:["Don't use accuracy — it's misleading with 98.8% negatives.","class_weight='balanced' tells the model to care about the minority class.","Lower the decision threshold below 0.5 to catch more fraud.","Try RandomForest with class_weight='balanced' and threshold=0.3."],scoringCriteria:[{metric:"recall",target:.8,weight:.6},{metric:"precision",target:.7,weight:.4}],timeLimit:600},{id:"ch3",title:"Latency-Critical Predictor",description:"Build a model with <5ms inference latency and >90% accuracy. Speed matters as much as accuracy.",difficulty:"medium",constraints:["Accuracy > 90%","Latency < 5ms per prediction"],dataset:"wine",starterCode:`import numpy as np, json, time
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

# TODO: Build a FAST classifier
# Think about: Logistic Regression, Naive Bayes, small Decision Trees
# Avoid: SVM, large Random Forests, Neural Networks

# Time your predictions
# t0 = time.time()
# preds = model.predict(X_test)
# latency_ms = (time.time() - t0) / len(X_test) * 1000

json.dumps({"accuracy": 0.0, "latency_ms": 0.0, "completed": False})`,solutionCode:`import numpy as np, json, time
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=200, random_state=42)
model.fit(X_train, y_train)

t0 = time.time()
preds = model.predict(X_test)
latency_ms = (time.time() - t0) / len(X_test) * 1000
acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": float(acc), "latency_ms": float(latency_ms), "completed": bool(acc > 0.9 and latency_ms < 5)})`,hints:["Logistic Regression is fast at inference time.","Decision Trees with max_depth=3 are also very fast.","Avoid SVM — kernel evaluation is slow.","Measure latency per-prediction, not total batch time."],scoringCriteria:[{metric:"accuracy",target:.9,weight:.5},{metric:"latency_ms",target:5,weight:.5}],timeLimit:300},{id:"ch4",title:"Feature Engineer or Die",description:"Raw features give you 65% accuracy. Engineer features to push above 85%. The algorithm matters less than the features.",difficulty:"expert",constraints:["Must use raw features only (no pre-computed)","Accuracy > 85%","Explain your feature engineering decisions"],dataset:"synthetic_hard",starterCode:`import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

np.random.seed(42)
n = 500
# Raw features with hidden patterns
x1 = np.random.uniform(0, 10, n)
x2 = np.random.uniform(0, 10, n)
x3 = np.random.randn(n) * 2
x4 = np.random.choice([0, 1, 2], n)

# Hidden: target depends on x1*x2 interaction and x3^2
noise = np.random.randn(n) * 0.5
y = ((x1 * x2 > 25) & (x3**2 < 4) & (x4 != 1)).astype(int)
y = (y + (np.random.rand(n) > 0.9).astype(int)) % 2

X = np.column_stack([x1, x2, x3, x4])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# TODO: Engineer features from x1, x2, x3, x4
# The target has hidden interactions — find them!

json.dumps({"accuracy": 0.0, "completed": False})`,solutionCode:`import numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score

np.random.seed(42)
n = 500
x1 = np.random.uniform(0, 10, n)
x2 = np.random.uniform(0, 10, n)
x3 = np.random.randn(n) * 2
x4 = np.random.choice([0, 1, 2], n)

y = ((x1 * x2 > 25) & (x3**2 < 4) & (x4 != 1)).astype(int)
y = (y + (np.random.rand(n) > 0.9).astype(int)) % 2

X = np.column_stack([x1, x2, x3, x4])
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Feature engineering
def engineer(X):
    x1, x2, x3, x4 = X[:, 0], X[:, 1], X[:, 2], X[:, 3]
    return np.column_stack([
        x1, x2, x3, x4,
        x1 * x2,       # interaction
        x3 ** 2,        # polynomial
        (x1 * x2 > 25).astype(float),  # threshold
        (x3 ** 2 < 4).astype(float),   # threshold
        (x4 != 1).astype(float),       # categorical
    ])

X_train_e = engineer(X_train)
X_test_e = engineer(X_test)

model = GradientBoostingClassifier(n_estimators=100, random_state=42)
model.fit(X_train_e, y_train)
preds = model.predict(X_test_e)
acc = accuracy_score(y_test, preds)

json.dumps({"accuracy": float(acc), "completed": bool(acc > 0.85)})`,hints:["Look at pairs of features — are there interactions?","Try multiplying x1 * x2.","x3^2 might be a useful feature.","The target has a hidden rule: x1*x2 > 25 AND x3^2 < 4 AND x4 != 1."],scoringCriteria:[{metric:"accuracy",target:.85,weight:1}],timeLimit:900}],m={easy:"bg-emerald-900/50 text-emerald-400",medium:"bg-blue-900/50 text-blue-400",hard:"bg-orange-900/50 text-orange-400",expert:"bg-red-900/50 text-red-400"};function n(){let{isReady:a,run:n}=(0,d.usePyodide)(),[o,p]=(0,c.useState)(null),[q,r]=(0,c.useState)(""),[s,t]=(0,c.useState)(null),[u,v]=(0,c.useState)(!1),[w,x]=(0,c.useState)(0),[y,z]=(0,c.useState)(!1),[A,B]=(0,c.useState)(new Set),C=(0,c.useCallback)(a=>{p(a),r(a.starterCode),t(null),x(0),z(!1)},[]),D=(0,c.useCallback)(async()=>{if(a&&o){v(!0);try{let a=await n(q);t(a),a?.completed&&B(a=>new Set([...a,o.id]))}catch(a){t({error:a instanceof Error?a.message:"Execution failed"})}finally{v(!1)}}},[a,o,q,n]),E=o?o.scoringCriteria.reduce((a,b)=>{let c=s?.[b.metric],d="number"==typeof c?c:0;return a+("latency_ms"===b.metric?Math.max(0,1-d/b.target):Math.min(1,d/b.target))*b.weight},0)/o.scoringCriteria.reduce((a,b)=>a+b.weight,0):0;return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("h1",{className:"text-2xl font-bold flex items-center gap-2",children:[(0,b.jsx)(h.Zap,{className:"w-6 h-6 text-orange-400"}),"Challenge Engine"]}),(0,b.jsx)("p",{className:"text-sm text-zinc-400 mt-1",children:"Solve real ML problems under constraints. No tutorials — just a problem, constraints, and a code editor."})]}),o?(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)(g.Button,{variant:"ghost",onClick:()=>p(null),className:"text-zinc-400",children:"← Back to challenges"}),(0,b.jsxs)(e.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,b.jsx)("h2",{className:"text-lg font-bold text-zinc-200",children:o.title}),(0,b.jsx)(f.Badge,{className:`text-xs ${m[o.difficulty]}`,children:o.difficulty})]}),(0,b.jsx)("p",{className:"text-sm text-zinc-400 mb-3",children:o.description}),(0,b.jsx)("div",{className:"flex flex-wrap gap-2",children:o.constraints.map(a=>(0,b.jsxs)(f.Badge,{variant:"secondary",className:"bg-zinc-800 text-zinc-400 text-xs",children:[(0,b.jsx)(j.Target,{className:"w-3 h-3 mr-1"}),a]},a))})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-4",children:[(0,b.jsx)("div",{className:"lg:col-span-2",children:(0,b.jsxs)(e.Card,{className:"bg-zinc-900 border-zinc-800 overflow-hidden",children:[(0,b.jsxs)("div",{className:"px-4 py-2 border-b border-zinc-800 flex items-center justify-between",children:[(0,b.jsx)("span",{className:"text-xs text-zinc-500",children:"Python Editor"}),(0,b.jsx)("div",{className:"flex gap-2",children:(0,b.jsx)(g.Button,{size:"sm",onClick:D,disabled:!a||u,className:"h-7 text-xs bg-orange-600 hover:bg-orange-700",children:u?"Running...":"Run"})})]}),(0,b.jsx)("div",{className:"h-[400px] bg-zinc-950",children:(0,b.jsx)("textarea",{value:q,onChange:a=>r(a.target.value),className:"w-full h-full bg-transparent text-zinc-300 font-mono text-sm p-4 resize-none focus:outline-none",spellCheck:!1})})]})}),(0,b.jsxs)("div",{className:"space-y-4",children:[s&&!s.error&&(0,b.jsxs)(e.Card,{className:"bg-zinc-900 border-zinc-800 p-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-3",children:[(0,b.jsx)(i.Trophy,{className:"w-4 h-4 text-amber-400"}),(0,b.jsx)("h3",{className:"text-sm font-semibold text-zinc-200",children:"Score"})]}),(0,b.jsx)("div",{className:"text-3xl font-bold text-center mb-2",children:(0,b.jsxs)("span",{className:E>=.9?"text-emerald-400":E>=.7?"text-amber-400":"text-red-400",children:[(100*E).toFixed(0),"%"]})}),s.completed&&(0,b.jsxs)(f.Badge,{className:"bg-emerald-600 w-full justify-center",children:[(0,b.jsx)(k.CheckCircle,{className:"w-3 h-3 mr-1"}),"Challenge Complete!"]})]}),(0,b.jsxs)(e.Card,{className:"bg-zinc-900 border-zinc-800 p-4",children:[(0,b.jsxs)("h3",{className:"text-sm font-semibold text-zinc-200 mb-3",children:["Hints (",w,"/",o.hints.length,")"]}),(0,b.jsxs)("div",{className:"space-y-2",children:[o.hints.slice(0,w).map((a,c)=>(0,b.jsxs)("div",{className:"bg-zinc-800 rounded-lg p-2 text-xs text-zinc-400",children:[(0,b.jsxs)("span",{className:"text-amber-400 font-mono mr-1",children:[c+1,"."]}),a]},c)),w<o.hints.length&&(0,b.jsxs)(g.Button,{variant:"outline",size:"sm",onClick:()=>x(a=>a+1),className:"w-full text-xs border-zinc-700",children:["Show Hint ",w+1]})]})]}),(0,b.jsxs)(e.Card,{className:"bg-zinc-900 border-zinc-800 p-4",children:[(0,b.jsxs)(g.Button,{variant:"ghost",size:"sm",onClick:()=>z(!y),className:"w-full text-xs text-zinc-500",children:[y?"Hide":"Show"," Solution"]}),y&&(0,b.jsx)("pre",{className:"mt-2 text-xs text-zinc-400 bg-zinc-800 rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto",children:o.solutionCode})]})]})]})]}):(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:l.map(a=>(0,b.jsxs)(e.Card,{className:"p-5 bg-zinc-900 border-zinc-800 hover:border-orange-500/30 cursor-pointer transition-all",onClick:()=>C(a),children:[(0,b.jsxs)("div",{className:"flex items-start justify-between mb-3",children:[(0,b.jsx)(f.Badge,{className:`text-xs ${m[a.difficulty]}`,children:a.difficulty}),A.has(a.id)&&(0,b.jsxs)(f.Badge,{className:"bg-emerald-600 text-xs",children:[(0,b.jsx)(k.CheckCircle,{className:"w-3 h-3 mr-1"}),"Solved"]})]}),(0,b.jsx)("h3",{className:"font-semibold text-zinc-200 mb-1",children:a.title}),(0,b.jsx)("p",{className:"text-xs text-zinc-500 mb-3",children:a.description}),(0,b.jsx)("div",{className:"flex flex-wrap gap-1",children:a.constraints.map(a=>(0,b.jsx)(f.Badge,{variant:"secondary",className:"bg-zinc-800 text-zinc-500 text-xs",children:a},a))})]},a.id))})]})}var o=a.i(31868);a.s(["default",0,function(){return(0,b.jsxs)("div",{className:"min-h-screen bg-zinc-950 text-white",children:[(0,b.jsx)(o.PlatformNav,{}),(0,b.jsx)("main",{className:"max-w-[1600px] mx-auto px-6 py-8",children:(0,b.jsx)(n,{})})]})}],12294)},68136,a=>{"use strict";var b=a.i(72131);let c=null,d=0,e=new Map,f=new Set;function g(a){f.forEach(b=>b(a))}async function h(){if(!c)return g({status:"loading",progress:0,error:null}),(c=new Worker(new a.U(a.r(40198)),{type:"module"})).onmessage=a=>{let{type:b,id:c,result:d,error:f,progress:h,message:i}=a.data;if("status"===b)return void g({status:h>=1?"ready":"loading",progress:h,error:null,message:i});if("ready"===b)return void g({status:"ready",progress:1,error:null});if("error"===b){g({status:"error",progress:0,error:f});let a=e.get(c);a&&(a.reject(Error(f)),e.delete(c));return}let j=e.get(c);j&&(j.resolve(d),e.delete(c))},c.onerror=a=>{g({status:"error",progress:0,error:a.message})},new Promise((a,b)=>{let d=!1,e=f=>{d||("ready"===f.data.type&&(d=!0,c?.removeEventListener("message",e),a()),"error"===f.data.type&&(d=!0,c?.removeEventListener("message",e),b(Error(f.data.error||"Pyodide failed to initialize"))))};c.addEventListener("message",e),c.postMessage({type:"init"}),setTimeout(()=>{d||(d=!0,c?.removeEventListener("message",e),b(Error("Pyodide initialization timeout (60s). Check your internet connection.")))},6e4)})}async function i(a,b){if(!c)throw Error("Pyodide not initialized. Call initPyodide() first.");let f=++d;return new Promise((d,g)=>{e.set(f,{resolve:d,reject:g}),c.postMessage({type:"run",id:f,code:a,data:b})})}async function j(a){if(!c)throw Error("Pyodide not initialized");let b=++d;return new Promise((d,f)=>{e.set(b,{resolve:()=>d(),reject:f}),c.postMessage({type:"loadPackages",id:b,packages:a})})}a.s(["usePyodide",0,function(a=[]){let[c,d]=(0,b.useState)({status:"idle",progress:0,error:null,message:void 0}),e=(0,b.useRef)(!1);(0,b.useEffect)(()=>{if(e.current)return;e.current=!0,h().catch(a=>{d(b=>({...b,status:"error",error:a.message}))});let a=(f.add(d),()=>f.delete(d));return()=>{a()}},[]),(0,b.useEffect)(()=>{"ready"===c.status&&a.length>0&&j(a)},[c.status]);let g=(0,b.useCallback)(async(a,b)=>i(a,b),[]),k=(0,b.useCallback)(async a=>{await j(a)},[]);return{status:c.status,progress:c.progress,error:c.error,message:c.message,run:g,loadPkgs:k,isReady:"ready"===c.status}}],68136)},40198,a=>{a.v("/_next/static/media/pyodide-worker.0er4u391_3oru.js"+(globalThis.NEXT_CLIENT_ASSET_SUFFIX||""))}];

//# sourceMappingURL=_02sjwtu._.js.map