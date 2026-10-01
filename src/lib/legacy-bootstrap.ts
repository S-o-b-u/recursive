/**
 * Inline <head> script for old browser engines: the Android browsers on
 * classroom smartboards (Newline/NEOTOUCH class panels ship Chromium 6x-9x and
 * never update it).
 *
 * The bundle itself is transpiled down to Chrome 64 via `browserslist` in
 * package.json, but Next only sends its core-js polyfills to browsers without
 * ES-module support, and these engines have modules. So the handful of newer
 * APIs the bundle calls are filled in here. This must be inline, not a file:
 * it has to run before the async chunk scripts that sit just above it in
 * <head>, and an extra request would race them.
 *
 * Engines that also miss modern CSS (cascade layers, clamp(), inset, ...) get
 * /legacy/css-compat.js, written in synchronously so it is in place before
 * the body is parsed. Modern browsers do nothing here beyond the feature tests.
 *
 * `legacy-js` on <html> marks engines older than Chrome 93 (no Object.hasOwn,
 * checked before Next polyfills it): third-party embeds such as the
 * OpenStreetMap iframe do not run there, so the venue map shows a still.
 *
 * `perf-lite` marks smartboard-class hardware: an old engine, an Android
 * screen 900+ CSS px on its short side (panels, not phones), or a 4K touch
 * screen. Their GPUs are weak for the pixels they drive, so continuous
 * effects stand down there (see perfLite() in src/lib/device.ts and the
 * .perf-lite rules in globals.css).
 *
 * Big panels: a 4K board whose browser reports 2560-3840 CSS px lays the site
 * out at desktop size in the middle of the screen, unreadable from the back of
 * a room. On screens that large the layout viewport is pinned to 1920 px and
 * the browser scales it up to fill the panel (Android browsers honour this;
 * desktop browsers ignore the viewport meta, so desktops are untouched). Next
 * may rewrite the meta on navigation, hence the observer.
 *
 * Plain ES5 on purpose, and kept in String.raw so the regex below survives
 * as written.
 */
export const LEGACY_BOOTSTRAP = String.raw`(function(w,d){try{
var P=w.Promise,SP=String.prototype;
if(!Object.hasOwn){d.documentElement.className+=" legacy-js";}
if(typeof globalThis==="undefined"){w.globalThis=w;}
if(P&&!P.allSettled){P.allSettled=function(it){return P.all(Array.prototype.map.call(Array.from(it),function(p){return P.resolve(p).then(function(v){return{status:"fulfilled",value:v};},function(r){return{status:"rejected",reason:r};});}));};}
if(!SP.replaceAll){SP.replaceAll=function(s,r){if(s instanceof RegExp){return this.replace(s,r);}return this.replace(new RegExp(String(s).replace(/[.*+?^$(){}|[\]\\]/g,"\\$&"),"g"),r);};}
if(!SP.matchAll){SP.matchAll=function(re){var g=new RegExp(re.source,re.flags.indexOf("g")<0?re.flags+"g":re.flags),out=[],m;while((m=g.exec(this))!==null){out.push(m);if(m[0]==="")g.lastIndex++;}return out[Symbol.iterator]();};}
if(!w.queueMicrotask&&P){w.queueMicrotask=function(f){P.resolve().then(f).catch(function(e){setTimeout(function(){throw e;});});};}
var RO=w.ResizeObserver;
if(RO&&w.ResizeObserverEntry&&!("borderBoxSize" in w.ResizeObserverEntry.prototype)){
  w.ResizeObserver=function(cb){return new RO(function(entries,obs){for(var i=0;i<entries.length;i++){var e=entries[i];try{var r=e.target.getBoundingClientRect(),c=e.contentRect;Object.defineProperty(e,"borderBoxSize",{value:[{inlineSize:r.width,blockSize:r.height}]});Object.defineProperty(e,"contentBoxSize",{value:[{inlineSize:c.width,blockSize:c.height}]});}catch(x){}}cb(entries,obs);});};
  w.ResizeObserver.prototype=RO.prototype;
}
var sw=screen.width,sh=screen.height;
if(Math.max(sw,sh)>=2200&&Math.min(sw,sh)>=1200){
  var vpc="width="+(sw>=sh?1920:Math.round(1920*sw/sh))+", viewport-fit=cover";
  var fit=function(){var ms=d.querySelectorAll('meta[name="viewport"]');for(var i=0;i<ms.length;i++){if(ms[i].getAttribute("content")!==vpc)ms[i].setAttribute("content",vpc);}};
  fit();
  if(w.MutationObserver){new MutationObserver(fit).observe(d.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["content"]});}
}
var sup=function(p,v){try{return !!(w.CSS&&CSS.supports&&CSS.supports(p,v));}catch(x){return false;}};
var oldCss=!w.CSSLayerBlockRule||!sup("width","clamp(1px, 1px, 1px)")||!sup("translate","1px")||!sup("inset","0px")||!sup("padding-inline","0px")||!sup("aspect-ratio","1 / 1");
if(oldCss){
  d.documentElement.className+=" legacy-css";
  d.write('<script src="/legacy/css-compat.js"><\/script>');
}
var touch=("ontouchstart" in w)||navigator.maxTouchPoints>0;
var panel=(/Android/i.test(navigator.userAgent)&&Math.min(sw,sh)>=900)||(touch&&Math.max(sw,sh)>=2200);
if(panel||oldCss||!Object.hasOwn){d.documentElement.className+=" perf-lite";}
}catch(e){}})(window,document);`;
