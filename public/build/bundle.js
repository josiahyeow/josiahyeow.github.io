var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e){t.appendChild(e)}function c(t,e,n){t.insertBefore(e,n||null)}function r(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function u(t){return document.createTextNode(t)}function f(){return u(" ")}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function d(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let h;function g(t){h=t}const m=[],$=[],v=[],w=[],b=Promise.resolve();let y=!1;function x(t){v.push(t)}let k=!1;const _=new Set;function S(){if(!k){k=!0;do{for(let t=0;t<m.length;t+=1){const e=m[t];g(e),j(e.$$)}for(g(null),m.length=0;$.length;)$.pop()();for(let t=0;t<v.length;t+=1){const e=v[t];_.has(e)||(_.add(e),e())}v.length=0}while(m.length);for(;w.length;)w.pop()();y=!1,k=!1,_.clear()}}function j(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(x)}}const I=new Set;let O;function E(t,e){t&&t.i&&(I.delete(t),t.i(e))}function C(t,e,n,s){if(t&&t.o){if(I.has(t))return;I.add(t),O.c.push(()=>{I.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}}function N(t){t&&t.c()}function q(t,n,i){const{fragment:l,on_mount:c,on_destroy:r,after_update:a}=t.$$;l&&l.m(n,i),x(()=>{const n=c.map(e).filter(o);r?r.push(...n):s(n),t.$$.on_mount=[]}),a.forEach(x)}function A(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function H(t,e){-1===t.$$.dirty[0]&&(m.push(t),y||(y=!0,b.then(S)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function T(e,o,i,l,c,a,u=[-1]){const f=h;g(e);const p=o.props||{},d=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:n(),dirty:u,skip_bound:!1};let m=!1;if(d.ctx=i?i(e,p,(t,n,...s)=>{const o=s.length?s[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),m&&H(e,t)),n}):[],d.update(),m=!0,s(d.before_update),d.fragment=!!l&&l(d.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);d.fragment&&d.fragment.l(t),t.forEach(r)}else d.fragment&&d.fragment.c();o.intro&&E(e.$$.fragment),q(e,o.target,o.anchor),S()}g(f)}class D{$destroy(){A(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function L(e){let n;return{c(){n=a("header"),n.innerHTML='<nav class="svelte-p9owlc"><a class="logo svelte-p9owlc">JOSIAH YEOW</a> \n    <ul class="svelte-p9owlc"><li class="svelte-p9owlc"><a href="https://www.linkedin.com/in/josiah-yeow/" class="svelte-p9owlc"><img src="/icons/linkedin.svg" alt="linkedin icon" class="svelte-p9owlc"/></a></li> \n      <li class="svelte-p9owlc"><a href="https://github.com/josiahyeow" class="svelte-p9owlc"><img src="/icons/github.svg" alt="github icon" class="svelte-p9owlc"/></a></li> \n      <li class="svelte-p9owlc"><a href="mailto:josiahyeow.dev@gmail.com" class="svelte-p9owlc"><img src="/icons/mail.svg" alt="email icon" class="svelte-p9owlc"/></a></li></ul></nav>',p(n,"class","svelte-p9owlc")},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&r(n)}}}class M extends D{constructor(t){super(),T(this,t,null,L,i,{})}}function R(e){let n;return{c(){n=a("div"),n.innerHTML='<div class="hero-content svelte-1ah007l"><div class="square svelte-1ah007l"></div> \n    <h1 class="svelte-1ah007l">Full Stack Developer // Software Engineer</h1> \n    <h2 class="svelte-1ah007l">👋 Hi, I&#39;m Josiah. I design and build web apps that are visually pleasing\n      and easy to use.</h2></div>',p(n,"class","hero svelte-1ah007l")},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&r(n)}}}class z extends D{constructor(t){super(),T(this,t,null,R,i,{})}}function P(e){let n,s,o,i,h,g,m,$,v;return{c(){n=a("div"),s=a("img"),i=f(),h=a("h2"),g=u(e[1]),m=f(),$=a("p"),v=u(e[2]),p(s,"class","app-image svelte-gyfw42"),s.src!==(o=e[0])&&p(s,"src",o),p(s,"alt",""),p(n,"class","app-card svelte-gyfw42")},m(t,e){c(t,n,e),l(n,s),l(n,i),l(n,h),l(h,g),l(n,m),l(n,$),l($,v)},p(t,[e]){1&e&&s.src!==(o=t[0])&&p(s,"src",o),2&e&&d(g,t[1]),4&e&&d(v,t[2])},i:t,o:t,d(t){t&&r(n)}}}function B(t,e,n){let{icon:s}=e,{name:o}=e,{description:i}=e;return t.$$set=t=>{"icon"in t&&n(0,s=t.icon),"name"in t&&n(1,o=t.name),"description"in t&&n(2,i=t.description)},[s,o,i]}class F extends D{constructor(t){super(),T(this,t,B,P,i,{icon:0,name:1,description:2})}}function J(t,e,n){const s=t.slice();return s[1]=e[n],s}function V(e){let n,s;return n=new F({props:{icon:e[1].icon,name:e[1].name,description:e[1].description}}),{c(){N(n.$$.fragment)},m(t,e){q(n,t,e),s=!0},p:t,i(t){s||(E(n.$$.fragment,t),s=!0)},o(t){C(n.$$.fragment,t),s=!1},d(t){A(n,t)}}}function G(t){let e,n,o,i,u,d=t[0],h=[];for(let e=0;e<d.length;e+=1)h[e]=V(J(t,d,e));const g=t=>C(h[t],1,1,()=>{h[t]=null});return{c(){e=a("div"),n=a("h1"),n.textContent="Some things I've created",o=f(),i=a("div");for(let t=0;t<h.length;t+=1)h[t].c();p(n,"class","svelte-rqvbzg"),p(i,"class","apps svelte-rqvbzg"),p(e,"class","showcase svelte-rqvbzg")},m(t,s){c(t,e,s),l(e,n),l(e,o),l(e,i);for(let t=0;t<h.length;t+=1)h[t].m(i,null);u=!0},p(t,[e]){if(1&e){let n;for(d=t[0],n=0;n<d.length;n+=1){const s=J(t,d,n);h[n]?(h[n].p(s,e),E(h[n],1)):(h[n]=V(s),h[n].c(),E(h[n],1),h[n].m(i,null))}for(O={r:0,c:[],p:O},n=d.length;n<h.length;n+=1)g(n);O.r||s(O.c),O=O.p}},i(t){if(!u){for(let t=0;t<d.length;t+=1)E(h[t]);u=!0}},o(t){h=h.filter(Boolean);for(let t=0;t<h.length;t+=1)C(h[t]);u=!1},d(t){t&&r(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(h,t)}}}function W(t){return[[{icon:"/img/simple-chat-app.png",name:"Simple Chat App",description:"Native javascript chat room application using socket.io"},{icon:"/img/covid-19-dashboard.png",name:"COVID-19 Dashboard",description:"Dashboard which shows COVID-19 case data using React"},{icon:"/img/pocketlint.png",name:"PocketLint",description:"iOS app for capturing quick photo notes with text recognition written in Swift"},{icon:"/img/flush.png",name:"Flush",description:"Gamified task tracking and scheduling app written in React Native"}]]}class Y extends D{constructor(t){super(),T(this,t,W,G,i,{})}}function K(e){let n;return{c(){n=a("div"),n.innerHTML='<h1 class="svelte-tjk6bp">Some things I&#39;ve worked with</h1> \n  <p>I&#39;ve built apps using</p> \n  <ul><li>React</li> \n    <li>Node</li> \n    <li>Express</li> \n    <li>Socket.IO</li> \n    <li>Python</li> \n    <li>Swift</li> \n    <li>React Native</li></ul>',p(n,"class","tools svelte-tjk6bp")},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&r(n)}}}class Q extends D{constructor(t){super(),T(this,t,null,K,i,{})}}function U(e){let n;return{c(){n=a("footer"),n.innerHTML="Created with 💻 in <strong>melbourne, au</strong> using Svelte",p(n,"class","svelte-gbi53e")},m(t,e){c(t,n,e)},p:t,i:t,o:t,d(t){t&&r(n)}}}class X extends D{constructor(t){super(),T(this,t,null,U,i,{})}}function Z(e){let n,s,o,i,u,p,d,h,g,m,$;return s=new M({}),i=new z({}),p=new Y({}),h=new Q({}),m=new X({}),{c(){n=a("main"),N(s.$$.fragment),o=f(),N(i.$$.fragment),u=f(),N(p.$$.fragment),d=f(),N(h.$$.fragment),g=f(),N(m.$$.fragment)},m(t,e){c(t,n,e),q(s,n,null),l(n,o),q(i,n,null),l(n,u),q(p,n,null),l(n,d),q(h,n,null),l(n,g),q(m,n,null),$=!0},p:t,i(t){$||(E(s.$$.fragment,t),E(i.$$.fragment,t),E(p.$$.fragment,t),E(h.$$.fragment,t),E(m.$$.fragment,t),$=!0)},o(t){C(s.$$.fragment,t),C(i.$$.fragment,t),C(p.$$.fragment,t),C(h.$$.fragment,t),C(m.$$.fragment,t),$=!1},d(t){t&&r(n),A(s),A(i),A(p),A(h),A(m)}}}return new class extends D{constructor(t){super(),T(this,t,null,Z,i,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
