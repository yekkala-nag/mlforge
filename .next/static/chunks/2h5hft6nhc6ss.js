(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,27930,40886,e=>{"use strict";var t=e.i(71645),n=e.i(29315),r=e.i(67865),s=e.i(46376),a=e.i(76782),i=e.i(38452),o=e.i(90325),l=e.i(33848);function c(e,t,{detail:n=0}={}){e.dispatchEvent(new((0,l.ownerWindow)(e)).PointerEvent("click",{bubbles:!0,cancelable:!0,composed:!0,detail:n,shiftKey:t.shiftKey,ctrlKey:t.ctrlKey,altKey:t.altKey,metaKey:t.metaKey}))}function d(e={}){let{disabled:l=!1,focusableWhenDisabled:u,tabIndex:p=0,native:m=!0,composite:h}=e,g=t.useRef(null),b=(0,i.useCompositeRootContext)(!0),y=h??void 0!==b,{props:x}=(0,o.useFocusableWhenDisabled)({focusableWhenDisabled:u,disabled:l,composite:y,tabIndex:p,isNativeButton:m}),v=t.useCallback(()=>{let e=g.current;f(e)&&y&&l&&void 0===x.disabled&&e.disabled&&(e.disabled=!1)},[l,x.disabled,y]);return(0,s.useIsoLayoutEffect)(v,[v]),{getButtonProps:t.useCallback((e={})=>{let{onClick:t,onMouseDown:r,onKeyUp:s,onKeyDown:i,onPointerDown:o,...d}=e;return(0,a.mergeProps)({onClick(e){l?e.preventDefault():t?.(e)},onMouseDown(e){l||r?.(e)},onKeyDown(e){var t;if(l||((0,a.makeEventPreventable)(e),i?.(e),e.baseUIHandlerPrevented))return;let r=e.target===e.currentTarget,s=e.currentTarget,o=f(s),d=!m&&(t=s,(0,n.isHTMLElement)(t)&&"A"===t.tagName&&!!t.href),u=r&&(m?o:!d),p="Enter"===e.key,h=" "===e.key,g=s.getAttribute("role"),b=g?.startsWith("menuitem")||"option"===g||"gridcell"===g;if(r&&y&&h){if(e.defaultPrevented&&b)return;e.preventDefault(),(!m||o)&&(e.preventBaseUIHandler(),c(s,e));return}if(!u||m||!h&&!p){r&&d&&h&&e.preventDefault();return}!e.defaultPrevented&&(e.preventDefault(),p&&(e.preventBaseUIHandler(),c(s,e)))},onKeyUp(e){l||(((0,a.makeEventPreventable)(e),s?.(e),e.target===e.currentTarget&&m&&y&&f(e.currentTarget)&&" "===e.key)?e.preventDefault():!e.baseUIHandlerPrevented&&(e.target!==e.currentTarget||m||y||e.defaultPrevented||" "!==e.key||(e.preventBaseUIHandler(),c(e.currentTarget,e))))},onPointerDown(e){l?e.preventDefault():o?.(e)}},m?{type:"button"}:{role:"button"},x,d)},[l,x,y,m]),buttonRef:(0,r.useStableCallback)(e=>{g.current=e,v()})}}function f(e){return(0,n.isHTMLElement)(e)&&"BUTTON"===e.tagName}e.s(["useButton",0,d],40886);var u=e.i(52245);let p=t.forwardRef(function(e,t){let{render:n,className:r,disabled:s=!1,focusableWhenDisabled:a=!1,nativeButton:i=!0,style:o,...l}=e,{getButtonProps:c,buttonRef:f}=d({disabled:s,focusableWhenDisabled:a,native:i});return(0,u.useRenderElement)("button",e,{state:{disabled:s},ref:[t,f],props:[l,c]})});e.s(["Button",0,p],27930)},38452,90325,e=>{"use strict";var t=e.i(33332),n=e.i(71645);let r=n.createContext(void 0);e.s(["CompositeRootContext",0,r,"useCompositeRootContext",0,function(e=!1){let s=n.useContext(r);if(void 0===s&&!e)throw Error((0,t.default)(16));return s}],38452),e.s(["useFocusableWhenDisabled",0,function(e){let{focusableWhenDisabled:t,disabled:r,composite:s=!1,tabIndex:a=0,isNativeButton:i}=e,o=s&&!1!==t,l=s&&!1===t;return{props:n.useMemo(()=>{let e={onKeyDown(e){r&&t&&"Tab"!==e.key&&e.preventDefault()}};return s||(e.tabIndex=a,!i&&r&&(e.tabIndex=t?a:-1)),(i&&(t||o)||!i&&r)&&(e["aria-disabled"]=r),i&&(!t||l)&&(e.disabled=r),e},[s,r,t,o,l,i,a])}}],90325)},46376,e=>{"use strict";var t=e.i(71645);let n="u">typeof document?t.useLayoutEffect:()=>{};e.s(["useIsoLayoutEffect",0,n])},67865,14553,e=>{"use strict";let t={...e.i(71645)};e.s(["SafeReact",0,t],14553);var n=e.i(88940);let r=t.useInsertionEffect,s=r&&r!==t.useLayoutEffect?r:e=>e();function a(){let e={next:void 0,callback:i,trampoline:(...t)=>e.callback?.(...t),effect:()=>{e.callback=e.next}};return e}function i(){}e.s(["useStableCallback",0,function(e){let t=(0,n.useRefWithInit)(a).current;return t.next=e,s(t.effect),t.trampoline}],67865)},29315,e=>{"use strict";function t(){return"u">typeof window}function n(e){var t;return(null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}e.s(["getComputedStyle",0,function(e){return n(e).getComputedStyle(e)},"getWindow",0,n,"isElement",0,function(e){return!!t()&&(e instanceof Element||e instanceof n(e).Element)},"isHTMLElement",0,function(e){return!!t()&&(e instanceof HTMLElement||e instanceof n(e).HTMLElement)},"isShadowRoot",0,function(e){return!(!t()||"u"<typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof n(e).ShadowRoot)}])},33848,e=>{"use strict";var t=e.i(29315);e.s(["ownerWindow",()=>t.getWindow])},48161,e=>{"use strict";let t=(0,e.i(56420).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",0,t],48161)},22016,(e,t,n)=>{"use strict";e.i(47167),Object.defineProperty(n,"__esModule",{value:!0});var r={default:function(){return b},useLinkStatus:function(){return x}};for(var s in r)Object.defineProperty(n,s,{enumerable:!0,get:r[s]});let a=e.r(90809),i=e.r(43476),o=a._(e.r(71645)),l=e.r(95057),c=e.r(8372),d=e.r(18581),f=e.r(18967),u=e.r(5550),p=e.r(88540),m=e.r(91949),h=e.r(73668),g=e.r(9396);function b(t){var n;let r,s,a,[b,x]=(0,o.useOptimistic)(m.IDLE_LINK_STATUS),v=(0,o.useRef)(null),{href:_,as:k,children:X,prefetch:j=null,passHref:N,replace:w,shallow:C,scroll:z,onClick:P,onMouseEnter:T,onTouchStart:S,legacyBehavior:E=!1,onNavigate:R,transitionTypes:L,ref:B,unstable_dynamicOnHover:O,...D}=t;r=X,E&&("string"==typeof r||"number"==typeof r)&&(r=(0,i.jsx)("a",{children:r}));let M=o.default.useContext(c.AppRouterContext),K=!1!==j,I=!1===j?"none":!0===j?"full":"auto",U="none"!==I?"auto"===I?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,A="string"==typeof(n=k||_)?n:(0,l.formatUrl)(n);if(E){if(r?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});s=o.default.Children.only(r)}let F=E?s&&"object"==typeof s&&s.ref:B,$,q=o.default.useCallback(e=>(null!==M&&(v.current=(0,m.mountLinkInstance)(e,A,M,U,K,x,$)),()=>{v.current&&((0,m.unmountLinkForCurrentNavigation)(v.current),v.current=null),(0,m.unmountPrefetchableInstance)(e)}),[K,A,M,U,x,$]),G={ref:(0,d.useMergedRef)(q,F),onClick(t){E||"function"!=typeof P||P(t),E&&s.props&&"function"==typeof s.props.onClick&&s.props.onClick(t),!M||t.defaultPrevented||function(t,n,r,s,a,i,l,c="none"){if("u">typeof window){let d,{nodeName:f}=t.currentTarget;if("A"===f.toUpperCase()&&((d=t.currentTarget.getAttribute("target"))&&"_self"!==d||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(n)){s&&(t.preventDefault(),location.replace(n));return}if(t.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:u}=e.r(99781);o.default.startTransition(()=>{u(n,s?"replace":"push",!1===a?p.ScrollBehavior.NoScroll:p.ScrollBehavior.Default,r.current,l,c)})}}(t,A,v,w,z,R,L,I)},onMouseEnter(e){E||"function"!=typeof T||T(e),E&&s.props&&"function"==typeof s.props.onMouseEnter&&s.props.onMouseEnter(e),M&&K&&(0,m.onNavigationIntent)(e.currentTarget,!0===O)},onTouchStart:function(e){E||"function"!=typeof S||S(e),E&&s.props&&"function"==typeof s.props.onTouchStart&&s.props.onTouchStart(e),M&&K&&(0,m.onNavigationIntent)(e.currentTarget,!0===O)}};return(0,f.isAbsoluteUrl)(A)?G.href=A:E&&!N&&("a"!==s.type||"href"in s.props)||(G.href=(0,u.addBasePath)(A)),a=E?o.default.cloneElement(s,G):(0,i.jsx)("a",{...D,...G,children:r}),(0,i.jsx)(y.Provider,{value:b,children:a})}let y=(0,o.createContext)(m.IDLE_LINK_STATUS),x=()=>(0,o.useContext)(y);("function"==typeof n.default||"object"==typeof n.default&&null!==n.default)&&void 0===n.default.__esModule&&(Object.defineProperty(n.default,"__esModule",{value:!0}),Object.assign(n.default,n),t.exports=n.default)},18581,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"useMergedRef",{enumerable:!0,get:function(){return s}});let r=e.r(71645);function s(e,t){let n=(0,r.useRef)(null),s=(0,r.useRef)(null);return(0,r.useCallback)(r=>{if(null===r){let e=n.current;e&&(n.current=null,e());let t=s.current;t&&(s.current=null,t())}else e&&(n.current=a(e,r)),t&&(s.current=a(t,r))},[e,t])}function a(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let n=e(t);return"function"==typeof n?n:()=>e(null)}}("function"==typeof n.default||"object"==typeof n.default&&null!==n.default)&&void 0===n.default.__esModule&&(Object.defineProperty(n.default,"__esModule",{value:!0}),Object.assign(n.default,n),t.exports=n.default)},18967,(e,t,n)=>{"use strict";e.i(47167),Object.defineProperty(n,"__esModule",{value:!0});var r={DecodeError:function(){return b},MiddlewareNotFoundError:function(){return _},MissingStaticPage:function(){return v},NormalizeError:function(){return y},PageNotFoundError:function(){return x},SP:function(){return h},ST:function(){return g},WEB_VITALS:function(){return a},execOnce:function(){return i},getDisplayName:function(){return f},getLocationOrigin:function(){return c},getURL:function(){return d},isAbsoluteUrl:function(){return l},isResSent:function(){return u},loadGetInitialProps:function(){return m},normalizeRepeatedSlashes:function(){return p},stringifyError:function(){return k}};for(var s in r)Object.defineProperty(n,s,{enumerable:!0,get:r[s]});let a=["CLS","FCP","FID","INP","LCP","TTFB"];function i(e){let t,n=!1;return(...r)=>(n||(n=!0,t=e(...r)),t)}let o=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>{let t=e.charCodeAt(0);return!!(t>=65&&t<=90||t>=97&&t<=122)&&o.test(e)};function c(){let{protocol:e,hostname:t,port:n}=window.location;return`${e}//${t}${n?":"+n:""}`}function d(){let{href:e}=window.location,t=c();return e.substring(t.length)}function f(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function u(e){return e.finished||e.headersSent}function p(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function m(e,t){let n=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await m(t.Component,t.ctx)}:{};let r=await e.getInitialProps(t);if(n&&u(n))return r;if(!r)throw Object.defineProperty(Error(`"${f(e)}.getInitialProps()" should resolve to an object. But found "${r}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return r}let h="u">typeof performance,g=h&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class b extends Error{}class y extends Error{}class x extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class v extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class _ extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function k(e){return JSON.stringify({message:e.message,stack:e.stack})}},73668,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Object.defineProperty(n,"isLocalURL",{enumerable:!0,get:function(){return a}});let r=e.r(18967),s=e.r(52817);function a(e){if(!(0,r.isAbsoluteUrl)(e))return!0;try{let t=(0,r.getLocationOrigin)(),n=new URL(e,t);return n.origin===t&&(0,s.hasBasePath)(n.pathname)}catch(e){return!1}}},98183,(e,t,n)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r={assign:function(){return l},searchParamsToUrlQuery:function(){return a},urlQueryToSearchParams:function(){return o}};for(var s in r)Object.defineProperty(n,s,{enumerable:!0,get:r[s]});function a(e){let t={};for(let[n,r]of e.entries()){let e=t[n];void 0===e?t[n]=r:Array.isArray(e)?e.push(r):t[n]=[e,r]}return t}function i(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function o(e){let t=new URLSearchParams;for(let[n,r]of Object.entries(e))if(Array.isArray(r))for(let e of r)t.append(n,i(e));else t.set(n,i(r));return t}function l(e,...t){for(let n of t){for(let t of n.keys())e.delete(t);for(let[t,r]of n.entries())e.append(t,r)}return e}},95057,(e,t,n)=>{"use strict";e.i(47167),Object.defineProperty(n,"__esModule",{value:!0});var r={formatUrl:function(){return o},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var s in r)Object.defineProperty(n,s,{enumerable:!0,get:r[s]});let a=e.r(90809)._(e.r(98183)),i=/https?|ftp|gopher|file/;function o(e){let{auth:t,hostname:n}=e,r=e.protocol||"",s=e.pathname||"",o=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:n&&(c=t+(~n.indexOf(":")?`[${n}]`:n),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(a.urlQueryToSearchParams(l)));let d=e.search||l&&`?${l}`||"";return r&&!r.endsWith(":")&&(r+=":"),e.slashes||(!r||i.test(r))&&!1!==c?(c="//"+(c||""),s&&"/"!==s[0]&&(s="/"+s)):c||(c=""),o&&"#"!==o[0]&&(o="#"+o),d&&"?"!==d[0]&&(d="?"+d),s=s.replace(/[?#]/g,encodeURIComponent),d=d.replace("#","%23"),`${r}${c}${s}${d}${o}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return o(e)}},18566,(e,t,n)=>{t.exports=e.r(76562)},88063,e=>{"use strict";var t=e.i(43476),n=e.i(22016),r=e.i(19455),s=e.i(72436),a=e.i(18566);let i=[{href:"/playground",label:"Playground"},{href:"/math",label:"Math"},{href:"/from-scratch",label:"From Scratch"},{href:"/datasets",label:"Datasets"},{href:"/challenges",label:"Challenges"},{href:"/arena",label:"Arena"},{href:"/ops",label:"MLOps"},{href:"/system-builder",label:"Builder"},{href:"/agents",label:"Agents"},{href:"/features",label:"Features"},{href:"/settings",label:"Settings"}];e.s(["PlatformNav",0,function(){let e=(0,a.usePathname)();return(0,t.jsx)("header",{className:"border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50",children:(0,t.jsxs)("div",{className:"max-w-[1600px] mx-auto px-4 py-2 flex items-center gap-2",children:[(0,t.jsxs)(n.default,{href:"/",className:"flex items-center gap-2 shrink-0",children:[(0,t.jsx)("div",{className:"w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold",children:"M"}),(0,t.jsx)("span",{className:"font-semibold text-sm hidden sm:inline",children:"ML Forge"})]}),(0,t.jsx)(s.Separator,{orientation:"vertical",className:"h-4 bg-zinc-700 shrink-0"}),(0,t.jsx)("nav",{className:"flex items-center gap-0.5 overflow-x-auto min-w-0",children:i.map(s=>(0,t.jsx)(n.default,{href:s.href,children:(0,t.jsx)(r.Button,{variant:"ghost",size:"sm",className:`text-xs whitespace-nowrap ${e===s.href?"text-orange-400 bg-zinc-800":"text-zinc-400 hover:text-white"}`,children:s.label})},s.href))})]})})}])},75450,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(52440),s=e.i(88784),a=e.i(15288),i=e.i(87486),o=e.i(19455),l=e.i(77572);let c=`
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
})`,d=`
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
})`,f=`
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
})`,u={"linear-regression":{name:"Linear Regression",scratch_code:`
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
})`.trim(),concepts:["Weights (w) and bias (b) are learned parameters","Mean Squared Error measures prediction quality","Gradient descent updates weights: w -= lr * gradient","Regularization penalizes large weights to prevent overfitting"]},"logistic-regression":{name:"Logistic Regression",scratch_code:c.trim(),concepts:["Sigmoid function maps any value to [0, 1]","Cross-entropy loss measures classification quality","Decision threshold converts probabilities to classes","The decision boundary is a line in feature space"]},knn:{name:"K-Nearest Neighbors",scratch_code:d.trim(),concepts:["KNN is a lazy learner — no training phase","Distance metric determines similarity","K controls the bias-variance tradeoff","Majority vote among k nearest neighbors decides the class"]},"decision-tree":{name:"Decision Tree",scratch_code:f.trim(),concepts:["Gini impurity measures node purity","Recursive splitting creates the tree structure","max_depth controls overfitting","Each internal node splits on one feature at one threshold"]},"naive-bayes":{name:"Naive Bayes",scratch_code:`
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
})`.trim(),concepts:["Boosting: build trees sequentially, each correcting the last","Gradient descent in function space — each tree fits the residual","Learning rate shrinks each tree's contribution","Combines many weak learners into one strong learner"]}};var p=e.i(19830),m=e.i(48161);let h=(0,e.i(56420).default)("circle-x",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);var g=e.i(52330),b=e.i(56423),y=e.i(57916);function x(){let{isReady:e,run:c,loadPkgs:d}=(0,r.usePyodide)(),[f,x]=(0,n.useState)("linear-regression"),[v,_]=(0,n.useState)(null),[k,X]=(0,n.useState)(!1),[j,N]=(0,n.useState)("compare"),[w,C]=(0,n.useState)(!1),z=u[f],P=(0,n.useCallback)(async()=>{w||(await d(["scikit-learn"]),C(!0))},[w,d]),T=(0,n.useCallback)(async()=>{if(e&&z){X(!0);try{await P();let e=await c(z.scratch_code);_(e)}catch(e){console.error("From-scratch error:",e)}finally{X(!1)}}},[e,z,c,P]);return(0,n.useEffect)(()=>{let t=!0;if(e&&z){let e=setTimeout(()=>{t&&T()},0);return()=>{t=!1,clearTimeout(e)}}},[e,f,z,T]),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsx)(y.PyodideStatus,{}),(0,t.jsx)("div",{className:"flex items-center justify-between",children:(0,t.jsxs)("div",{children:[(0,t.jsxs)("h1",{className:"text-2xl font-bold flex items-center gap-2",children:[(0,t.jsx)(g.Code2,{className:"w-6 h-6 text-orange-400"}),"From Scratch Mode"]}),(0,t.jsx)("p",{className:"text-sm text-zinc-400 mt-1",children:"Build algorithms with NumPy, then compare with sklearn. Understand the math, not just the API."})]})}),(0,t.jsx)("div",{className:"flex gap-2",children:Object.entries(u).map(([e,n])=>(0,t.jsx)(o.Button,{variant:f===e?"default":"ghost",size:"sm",onClick:()=>{x(e),_(null)},className:f===e?"bg-orange-600 text-white":"text-zinc-400",children:n.name},e))}),(0,t.jsxs)(a.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 mb-3",children:[(0,t.jsx)(b.BookOpen,{className:"w-4 h-4 text-amber-400"}),(0,t.jsxs)("h3",{className:"text-sm font-semibold text-zinc-200",children:["Key Concepts — ",z?.name]})]}),(0,t.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:z?.concepts.map((e,n)=>(0,t.jsxs)("div",{className:"bg-zinc-800 rounded-lg p-3 text-xs text-zinc-400 leading-relaxed",children:[(0,t.jsxs)("span",{className:"text-amber-400 font-mono mr-1",children:[n+1,"."]}),e]},n))})]}),(0,t.jsxs)(l.Tabs,{value:j,onValueChange:N,children:[(0,t.jsxs)(l.TabsList,{className:"bg-zinc-800",children:[(0,t.jsx)(l.TabsTrigger,{value:"compare",className:"text-xs",children:"Side-by-Side"}),(0,t.jsx)(l.TabsTrigger,{value:"code",className:"text-xs",children:"Full Code"})]}),(0,t.jsx)(l.TabsContent,{value:"compare",className:"mt-4",children:v&&(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[(0,t.jsxs)(a.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsx)("h3",{className:"font-semibold text-zinc-200",children:"From Scratch (NumPy)"}),(0,t.jsx)(i.Badge,{className:"bg-amber-600/20 text-amber-400 text-xs",children:"Manual Implementation"})]}),(0,t.jsx)("div",{className:"space-y-3",children:Object.entries(v.scratch).map(([e,n])=>(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-zinc-500 capitalize",children:e.replace(/_/g," ")}),(0,t.jsx)("span",{className:"font-mono text-zinc-300 text-xs",children:"number"==typeof n?n.toFixed(4):"object"==typeof n?JSON.stringify(n):String(n)})]},e))})]}),(0,t.jsxs)(a.Card,{className:"bg-zinc-900 border-zinc-800 p-5",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,t.jsx)("h3",{className:"font-semibold text-zinc-200",children:"Production (sklearn)"}),(0,t.jsx)(i.Badge,{className:"bg-blue-600/20 text-blue-400 text-xs",children:"Mature Library"})]}),(0,t.jsx)("div",{className:"space-y-3",children:Object.entries(v.sklearn).map(([e,n])=>(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{className:"text-zinc-500 capitalize",children:e.replace(/_/g," ")}),(0,t.jsx)("span",{className:"font-mono text-zinc-300 text-xs",children:"number"==typeof n?n.toFixed(4):"object"==typeof n?JSON.stringify(n):String(n)})]},e))})]}),(0,t.jsx)(a.Card,{className:`md:col-span-2 p-5 border ${v.comparison.match?"border-emerald-500/50 bg-emerald-950/20":"border-amber-500/50 bg-amber-950/20"}`,children:(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[v.comparison.match?(0,t.jsx)(m.CheckCircle,{className:"w-5 h-5 text-emerald-400"}):(0,t.jsx)(h,{className:"w-5 h-5 text-amber-400"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"font-semibold text-zinc-200",children:v.comparison.match?"Results Match!":"Results Differ"}),(0,t.jsx)("p",{className:"text-sm text-zinc-400",children:v.comparison.match?"Your from-scratch implementation produces the same results as sklearn. You understand the algorithm.":`Accuracy difference: ${(v.comparison.accuracy_diff??v.comparison.weight_diff??0).toFixed(4)}. This is expected — sklearn uses optimized solvers and numerical tricks.`})]})]})})]})}),(0,t.jsx)(l.TabsContent,{value:"code",className:"mt-4",children:(0,t.jsx)(a.Card,{className:"bg-zinc-900 border-zinc-800 overflow-hidden",children:(0,t.jsx)("div",{className:"h-[500px]",children:(0,t.jsx)(s.default,{height:"500px",defaultLanguage:"python",value:z?.scratch_code??"",theme:"vs-dark",options:{fontSize:13,fontFamily:"var(--font-geist-mono), monospace",minimap:{enabled:!1},readOnly:!0,padding:{top:12},scrollBeyondLastLine:!1}})})})})]}),(0,t.jsxs)(o.Button,{onClick:T,disabled:!e||k,className:"bg-orange-600 hover:bg-orange-700",children:[(0,t.jsx)(p.Play,{className:"w-4 h-4 mr-2"}),k?w?"Running...":"Loading sklearn...":"Run Comparison"]})]})}var v=e.i(88063);e.s(["default",0,function(){return(0,t.jsxs)("div",{className:"min-h-screen bg-zinc-950 text-white",children:[(0,t.jsx)(v.PlatformNav,{}),(0,t.jsx)("main",{className:"max-w-[1600px] mx-auto px-6 py-8",children:(0,t.jsx)(x,{})})]})}],75450)},19455,e=>{"use strict";var t=e.i(43476),n=e.i(27930),r=e.i(25913),s=e.i(75157);let a=(0,r.cva)("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/80",outline:"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",ghost:"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",destructive:"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",xs:"h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",sm:"h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",lg:"h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",icon:"size-8","icon-xs":"size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3","icon-sm":"size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg","icon-lg":"size-9"}},defaultVariants:{variant:"default",size:"default"}});e.s(["Button",0,function({className:e,variant:r="default",size:i="default",...o}){return(0,t.jsx)(n.Button,{"data-slot":"button",className:(0,s.cn)(a({variant:r,size:i,className:e})),...o})}])},15288,e=>{"use strict";var t=e.i(43476),n=e.i(75157);e.s(["Card",0,function({className:e,size:r="default",...s}){return(0,t.jsx)("div",{"data-slot":"card","data-size":r,className:(0,n.cn)("group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",e),...s})}])},72436,e=>{"use strict";var t=e.i(43476),n=e.i(71645),r=e.i(52245);let s=n.forwardRef(function(e,t){let{className:n,render:s,orientation:a="horizontal",style:i,...o}=e;return(0,r.useRenderElement)("div",e,{state:{orientation:a},ref:t,props:[{role:"separator","aria-orientation":a},o]})});var a=e.i(75157);e.s(["Separator",0,function({className:e,orientation:n="horizontal",...r}){return(0,t.jsx)(s,{"data-slot":"separator",orientation:n,className:(0,a.cn)("shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",e),...r})}],72436)}]);