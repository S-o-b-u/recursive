/*
 * Legacy CSS shim for old browser engines (classroom smartboards run Chromium
 * 6x-9x builds that never update). Loaded by the inline bootstrap in
 * src/lib/legacy-bootstrap.ts only when the engine is missing modern CSS;
 * modern browsers never fetch this file.
 *
 * The site's CSS is written for current browsers. An old engine drops every
 * rule or declaration it cannot parse, which here means:
 *   - everything inside @layer (all of Tailwind, Chrome < 99)
 *   - clamp() / min() / max() values (Chrome < 79): most sizes on the site
 *   - inset, padding-inline/-block, margin-inline/-block (Chrome < 87)
 *   - translate / scale / rotate properties (Chrome < 104)
 *   - :is() / :where() selectors (Chrome < 88), aspect-ratio (Chrome < 88)
 *   - flex `gap` is parsed but not laid out (Chrome < 84)
 *
 * So for every stylesheet (linked or <style>) this keeps the original text,
 * rewrites it into CSS the engine understands (clamp/min/max evaluated for the
 * current viewport, re-run on resize), disables the original sheet, and puts
 * the rewritten copy at the end of <head> in the same document order.
 * aspect-ratio and flex gap are laid out by script.
 *
 * Plain ES5: it runs on the engines it exists for.
 */
(function () {
  "use strict";
  var w = window, d = document;

  function sup(p, v) {
    try { return !!(w.CSS && CSS.supports && CSS.supports(p, v)); } catch (e) { return false; }
  }
  var F = {
    layer: !w.CSSLayerBlockRule,
    math: !sup("width", "clamp(1px, 1px, 1px)"),
    inset: !sup("inset", "0px"),
    logical: !sup("padding-inline", "0px"),
    xform: !sup("translate", "1px"),
    vunits: !sup("height", "1svh"),
    aspect: !sup("aspect-ratio", "1 / 1"),
    sel: !sup("selector(:is(a))"),
    mask: !sup("mask-image", "none"),
    flexgap: false // measured once the body exists
  };

  /* ── small text utilities ─────────────────────────────────────────── */

  function stripComments(s) {
    var out = "", i = 0, j;
    while ((j = s.indexOf("/*", i)) !== -1) {
      out += s.slice(i, j);
      var k = s.indexOf("*/", j + 2);
      if (k === -1) return out;
      i = k + 2;
    }
    return out + s.slice(i);
  }

  // index of the bracket closing the one at `open` (any of ( [ {), skipping strings
  function matchClose(s, open) {
    var depth = 0, q = null;
    for (var i = open; i < s.length; i++) {
      var c = s.charAt(i);
      if (q) { if (c === "\\") { i++; } else if (c === q) { q = null; } continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === "(" || c === "[" || c === "{") depth++;
      else if (c === ")" || c === "]" || c === "}") { depth--; if (depth === 0) return i; }
    }
    return -1;
  }

  // split on a separator character at bracket depth 0, outside strings
  function splitTop(s, sep) {
    var parts = [], depth = 0, q = null, start = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (q) { if (c === "\\") { i++; } else if (c === q) { q = null; } continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === "(" || c === "[" || c === "{") depth++;
      else if (c === ")" || c === "]" || c === "}") depth--;
      else if (depth === 0 && (sep === " " ? /\s/.test(c) : c === sep)) {
        parts.push(s.slice(start, i));
        start = i + 1;
      }
    }
    parts.push(s.slice(start));
    return sep === " " ? parts.filter(function (p) { return p !== ""; }) : parts;
  }

  function trim(s) { return s.replace(/^\s+|\s+$/g, ""); }
  function isIdentChar(c) { return /[a-zA-Z0-9_-]/.test(c); }

  /* ── clamp() / min() / max() evaluation ───────────────────────────── */

  var rootVars = {};
  // custom properties defined on any other rule (e.g. --u on .stage): a best guess
  // for a var() used inside clamp()/min()/max() outside that rule
  var anyVars = {};
  var vp = { w: 0, h: 0, rem: 16 };
  function readViewport() {
    vp.w = d.documentElement.clientWidth || w.innerWidth;
    vp.h = w.innerHeight;
    var fs = parseFloat(w.getComputedStyle(d.documentElement).fontSize);
    vp.rem = fs > 0 ? fs : 16;
  }

  var VERTICAL = /^(top|bottom|height|min-height|max-height|inset-block|inset-block-start|inset-block-end|margin-block|padding-block|row-gap|translate-y|--.*-h(eight)?|--.*-y)$/;

  // A length is {px, pct} (percent kept apart until a basis is known); a number is {num}.
  function unitPx(n, unit) {
    switch (unit) {
      case "px": case "": return n;
      case "rem": return n * vp.rem;
      case "em": return n * vp.rem;
      case "ch": case "ex": return n * vp.rem * 0.5;
      case "vw": case "svw": case "dvw": case "lvw": return n * vp.w / 100;
      case "vh": case "svh": case "dvh": case "lvh": return n * vp.h / 100;
      case "vmin": return n * Math.min(vp.w, vp.h) / 100;
      case "vmax": return n * Math.max(vp.w, vp.h) / 100;
      case "pt": return n * 4 / 3;
      case "pc": return n * 16;
      case "in": return n * 96;
      case "cm": return n * 96 / 2.54;
      case "mm": return n * 96 / 25.4;
      default: return null;
    }
  }

  function Evaluator(src, basis, localVars, depth, info) {
    this.s = src; this.i = 0; this.basis = basis; this.vars = localVars || {}; this.depth = depth || 0;
    this.info = info || {};
  }
  Evaluator.prototype.ws = function () { while (this.i < this.s.length && /\s/.test(this.s.charAt(this.i))) this.i++; };
  Evaluator.prototype.peek = function () { this.ws(); return this.s.charAt(this.i); };
  Evaluator.prototype.expr = function () {
    var v = this.term();
    for (;;) {
      var c = this.peek();
      if (c === "+" || c === "-") { this.i++; var r = this.term(); v = add(v, r, c === "-" ? -1 : 1); }
      else return v;
    }
  };
  Evaluator.prototype.term = function () {
    var v = this.factor();
    for (;;) {
      var c = this.peek();
      if (c === "*") { this.i++; v = mul(v, this.factor()); }
      else if (c === "/") { this.i++; var r = this.factor(); if (r.num === undefined || r.num === 0) throw 0; v = mul(v, { num: 1 / r.num }); }
      else return v;
    }
  };
  Evaluator.prototype.factor = function () {
    this.ws();
    var s = this.s, c = s.charAt(this.i);
    if (c === "(") { this.i++; var v = this.expr(); if (this.peek() !== ")") throw 0; this.i++; return v; }
    var m = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?([a-zA-Z%]*)/.exec(s.slice(this.i));
    if (m && !(c === "-" && /[a-zA-Z]/.test(s.charAt(this.i + 1)))) {
      this.i += m[0].length;
      var n = parseFloat(m[0]), unit = m[3].toLowerCase();
      if (unit === "%") return { px: 0, pct: n };
      if (unit === "") return { num: n };
      var px = unitPx(n, unit);
      if (px === null) throw 0;
      return { px: px, pct: 0 };
    }
    var f = /^-?([a-zA-Z-]+)\(/.exec(s.slice(this.i));
    if (f) {
      var neg = s.charAt(this.i) === "-";
      var name = f[1].toLowerCase();
      var open = this.i + f[0].length - 1, close = matchClose(s, open);
      if (close < 0) throw 0;
      var inner = s.slice(open + 1, close);
      this.i = close + 1;
      var r = this.call(name, inner);
      return neg ? mul(r, { num: -1 }) : r;
    }
    throw 0;
  };
  Evaluator.prototype.sub = function (src) {
    if (this.depth > 12) throw 0;
    var e = new Evaluator(src, this.basis, this.vars, this.depth + 1, this.info);
    var v = e.expr(); e.ws();
    if (e.i !== e.s.length) throw 0;
    return v;
  };
  Evaluator.prototype.call = function (name, inner) {
    var self = this;
    if (name === "calc") return this.sub(inner);
    if (name === "var") {
      var parts = splitTop(inner, ",");
      var key = trim(parts[0]);
      var val = this.vars.hasOwnProperty(key) ? this.vars[key] : rootVars.hasOwnProperty(key) ? rootVars[key] : anyVars[key];
      if (val === undefined) {
        if (parts.length < 2) throw 0;
        val = parts.slice(1).join(",");
      }
      return this.sub(val);
    }
    if (name === "min" || name === "max" || name === "clamp") {
      var args = splitTop(inner, ",").map(function (a) { return self.resolve(self.sub(a)); });
      if (name === "clamp") {
        if (args.length !== 3) throw 0;
        return pick(args[0], Math.min(args[1].v, args[2].v) === args[1].v ? args[1] : args[2], "max").raw;
      }
      var best = args[0];
      for (var k = 1; k < args.length; k++) best = pick(best, args[k], name);
      return best.raw;
    }
    throw 0;
  };
  // collapse percentages against the viewport axis this property measures
  Evaluator.prototype.resolve = function (v) {
    if (v.num !== undefined) return { v: v.num, raw: v };
    if (v.pct) this.info.pct = true;
    var px = v.px + v.pct * this.basis / 100;
    return { v: px, raw: { px: px, pct: 0 } };
  };
  function pick(a, b, kind) {
    if (a.raw) return kind === "max" ? (b.v > a.v ? b : a) : (b.v < a.v ? b : a);
    return a;
  }
  function add(a, b, sign) {
    if (a.num !== undefined && b.num !== undefined) return { num: a.num + sign * b.num };
    if (a.num !== undefined || b.num !== undefined) {
      // 0 is a valid length in CSS math only as a literal; treat bare 0 as 0px
      var n = a.num !== undefined ? a : b;
      if (n.num !== 0) throw 0;
      if (a.num !== undefined) a = { px: 0, pct: 0 }; else b = { px: 0, pct: 0 };
    }
    return { px: a.px + sign * b.px, pct: a.pct + sign * b.pct };
  }
  function mul(a, b) {
    if (a.num !== undefined && b.num !== undefined) return { num: a.num * b.num };
    if (a.num !== undefined) { var t = a; a = b; b = t; }
    if (b.num === undefined) throw 0;
    return { px: a.px * b.num, pct: a.pct * b.num };
  }
  function fmt(v) {
    if (v.num !== undefined) return String(Math.round(v.num * 10000) / 10000);
    var px = Math.round(v.px * 100) / 100;
    if (v.pct) return "calc(" + (Math.round(v.pct * 1000) / 1000) + "% + " + px + "px)";
    return px + "px";
  }

  // replace each outermost clamp()/min()/max() in a declaration value
  // `basis` overrides the viewport guess for percentages (the real containing
  // block, measured per element); `info.pct` reports that one was used
  function evalMath(value, prop, localVars, info, basis) {
    if (!/(clamp|min|max)\(/i.test(value)) return value;
    if (basis === undefined) basis = VERTICAL.test(prop) ? vp.h : vp.w;
    info = info || {};
    var out = "", i = 0;
    for (;;) {
      var re = /(clamp|min|max)\(/gi;
      re.lastIndex = i;
      var m = re.exec(value);
      while (m && m.index > 0 && isIdentChar(value.charAt(m.index - 1))) { re.lastIndex = m.index + 1; m = re.exec(value); }
      if (!m) return out + value.slice(i);
      var open = m.index + m[0].length - 1, close = matchClose(value, open);
      if (close < 0) return value;
      var expr = value.slice(m.index, close + 1);
      var rep;
      try {
        var ev = new Evaluator(expr, basis, localVars, 0, info);
        var v = ev.expr();
        rep = fmt(v);
      } catch (e) { rep = expr; }
      out += value.slice(i, m.index) + rep;
      i = close + 1;
    }
  }

  /* ── declaration rewrites ─────────────────────────────────────────── */

  function four(vals) {
    if (vals.length === 1) return [vals[0], vals[0], vals[0], vals[0]];
    if (vals.length === 2) return [vals[0], vals[1], vals[0], vals[1]];
    if (vals.length === 3) return [vals[0], vals[1], vals[2], vals[1]];
    return vals;
  }

  var LOGICAL = {
    "padding-inline": ["padding-left", "padding-right"], "padding-block": ["padding-top", "padding-bottom"],
    "margin-inline": ["margin-left", "margin-right"], "margin-block": ["margin-top", "margin-bottom"],
    "inset-inline": ["left", "right"], "inset-block": ["top", "bottom"],
    "border-inline-width": ["border-left-width", "border-right-width"], "border-block-width": ["border-top-width", "border-bottom-width"],
    "padding-inline-start": ["padding-left"], "padding-inline-end": ["padding-right"],
    "padding-block-start": ["padding-top"], "padding-block-end": ["padding-bottom"],
    "margin-inline-start": ["margin-left"], "margin-inline-end": ["margin-right"],
    "margin-block-start": ["margin-top"], "margin-block-end": ["margin-bottom"],
    "inset-inline-start": ["left"], "inset-inline-end": ["right"],
    "inset-block-start": ["top"], "inset-block-end": ["bottom"]
  };

  var aspectRules = []; // [selector, ratio, media]
  var gapSelectors = {};

  var deferred = []; // percentages inside clamp()/min()/max(), resolved per element

  function rewriteDecl(prop, value, important, localVars, ctx) {
    var p = prop.toLowerCase(), v = value, out = [], k;
    if (F.vunits) v = v.replace(/(\d)(s|d|l)v(h|w|min|max)\b/g, "$1v$3");
    var imp = important ? " !important" : "";

    if (F.inset && p === "inset") {
      var q = four(splitTop(v, " ")), names = ["top", "right", "bottom", "left"];
      for (k = 0; k < 4; k++) out.push.apply(out, rewriteDecl(names[k], q[k], important, localVars, ctx));
      return out;
    }
    if (F.logical && LOGICAL[p]) {
      var sides = LOGICAL[p], vals = splitTop(v, " ");
      for (k = 0; k < sides.length; k++) out.push.apply(out, rewriteDecl(sides[k], vals[k] || vals[0], important, localVars, ctx));
      return out;
    }
    if (F.math) {
      var raw = v, info = {};
      v = evalMath(v, p, localVars, info);
      if (info.pct && ctx && p.indexOf("--") !== 0 && /^-?[\d.]+px$/.test(v)) {
        deferred.push({ sel: ctx.selector, prop: p, raw: raw, est: parseFloat(v), media: ctx.media, imp: important, vars: localVars });
      }
    }
    if (p.indexOf("--") === 0) { localVars[p] = v; out.push(p + ":" + v); return out; }
    if (F.xform && (p === "translate" || p === "scale" || p === "rotate")) {
      var a = splitTop(v, " ");
      if (v === "none") { out.push("transform:none" + imp); return out; }
      if (p === "rotate" && a.length > 1) return [p + ":" + v + imp];
      out.push("transform:" + p + "(" + a.slice(0, 2).join(",") + ")" + imp);
      return out;
    }
    if (F.aspect && p === "aspect-ratio" && ctx) {
      var r = v.split("/");
      var ratio = parseFloat(r[0]) / (r.length > 1 ? parseFloat(r[1]) : 1);
      if (ratio > 0) aspectRules.push([ctx.selector, ratio, ctx.media, ctx.hasHeight]);
    }
    if ((p === "gap" || p === "column-gap" || p === "row-gap") && ctx) gapSelectors[ctx.selector] = 1;
    if (F.mask && /^mask(-|$)/.test(p)) out.push("-webkit-" + p + ":" + v + imp);
    out.push(p + ":" + v + imp);
    return out;
  }

  function rewriteBlock(body, ctx) {
    var decls = splitTop(body, ";"), out = [], localVars = {};
    var hasHeight = /(^|;)\s*(height|block-size)\s*:/i.test(body);
    var c = ctx ? { selector: ctx.selector, media: ctx.media, hasHeight: hasHeight } : null;
    for (var i = 0; i < decls.length; i++) {
      var dcl = decls[i], colon = dcl.indexOf(":");
      if (colon < 0) continue;
      var prop = trim(dcl.slice(0, colon)), value = trim(dcl.slice(colon + 1)), important = false;
      if (!prop) continue;
      var bang = value.search(/!\s*important\s*$/i);
      if (bang >= 0) { important = true; value = trim(value.slice(0, bang)); }
      out.push.apply(out, rewriteDecl(prop, value, important, localVars, c));
    }
    return out.join(";");
  }

  /* ── selectors: :is() / :where() ──────────────────────────────────── */

  function expandSelector(sel) {
    var m = /:(is|where|matches|-webkit-any)\(/i.exec(sel);
    if (!m) return [sel];
    var open = m.index + m[0].length - 1, close = matchClose(sel, open);
    if (close < 0) return [sel];
    var before = sel.slice(0, m.index), after = sel.slice(close + 1);
    var args = splitTop(sel.slice(open + 1, close), ","), out = [];
    for (var i = 0; i < args.length; i++) {
      var a = trim(args[i]);
      var rel = /^(.*\S)\s*([>+~]?)\s*\*$/.exec(a);
      if (rel && /[\s>+~]/.test(a)) {
        // `X:is(.group:hover *)` = an X inside .group:hover
        var lead = before.match(/^(.*[\s>+~])?([^\s>+~]*)$/);
        var outer = lead[1] || "", subject = lead[2];
        out.push(outer + rel[1] + " " + (rel[2] ? rel[2] + " " : "") + subject + after);
      } else {
        out.push(before + a.replace(/^\*(?=[.#:[])/, "") + after);
      }
    }
    var all = [];
    for (var j = 0; j < out.length; j++) all.push.apply(all, expandSelector(out[j]));
    return all;
  }

  // One unknown selector (::file-selector-button, :is(), ...) voids a whole list
  // in these engines, so each selector is tested and only the parseable ones kept.
  var probe = d.createDocumentFragment(), validCache = {};
  function parseable(sel) {
    if (validCache.hasOwnProperty(sel)) return validCache[sel];
    var ok = true;
    try { probe.querySelector(sel); } catch (e) { ok = false; }
    return (validCache[sel] = ok);
  }
  function rewriteSelector(sel) {
    var parts = splitTop(sel, ","), out = [];
    for (var i = 0; i < parts.length; i++) {
      var list = F.sel && /:(is|where|matches)\(/i.test(parts[i]) ? expandSelector(trim(parts[i])) : [trim(parts[i])];
      for (var k = 0; k < list.length; k++) {
        if (parseable(list[k])) out.push(list[k]);
      }
    }
    return out.join(",");
  }

  /* ── stylesheet rewrite ───────────────────────────────────────────── */

  function collectVars(css) {
    var re = /([^{}]*)\{([^{}]*)\}/g, m;
    while ((m = re.exec(css))) {
      if (m[2].indexOf("--") < 0) continue;
      var isRoot = /(^|[\s,;}])(:root|html)\s*(,|$)/.test(trim(m[1]));
      var decls = splitTop(m[2], ";");
      for (var i = 0; i < decls.length; i++) {
        var c = decls[i].indexOf(":");
        if (c < 0) continue;
        var p = trim(decls[i].slice(0, c));
        if (p.indexOf("--") !== 0) continue;
        var v = trim(decls[i].slice(c + 1)).replace(/!\s*important\s*$/i, "");
        if (isRoot) rootVars[p] = v; else anyVars[p] = v;
      }
    }
  }

  function rewriteRules(css, media) {
    var out = "", i = 0, n = css.length;
    while (i < n) {
      var brace = css.indexOf("{", i), semi = css.indexOf(";", i);
      if (brace === -1) break;
      if (semi !== -1 && semi < brace && trim(css.slice(i, semi)).charAt(0) === "@") {
        var stmt = trim(css.slice(i, semi));
        if (!(F.layer && /^@layer\b/i.test(stmt))) out += stmt + ";";
        i = semi + 1;
        continue;
      }
      var close = matchClose(css, brace);
      if (close === -1) break;
      var prelude = trim(css.slice(i, brace)), body = css.slice(brace + 1, close);
      i = close + 1;
      if (prelude.charAt(0) === "@") {
        var name = (/^@([\w-]+)/.exec(prelude) || [])[1] || "";
        name = name.toLowerCase();
        if (name === "layer") {
          out += F.layer ? rewriteRules(body, media) : prelude + "{" + rewriteRules(body, media) + "}";
        } else if (name === "media") {
          out += prelude + "{" + rewriteRules(body, trim(prelude.slice(6))) + "}";
        } else if (name === "supports") {
          // Tailwind's @property fallback (initial values for --tw-*) is gated on
          // a Safari/Firefox sniff; old Chromium needs it too
          if (F.layer && /margin-trim|-moz-orient/.test(prelude)) out += rewriteRules(body, media);
          else out += prelude + "{" + rewriteRules(body, media) + "}";
        } else if (/keyframes$/.test(name)) {
          out += prelude + "{" + rewriteRules(body, media) + "}";
        } else if (name === "property") {
          // not understood by these engines; Tailwind's fallback above sets the values
        } else {
          out += prelude + "{" + body + "}";
        }
      } else if (/^[\d.]+%$|^(from|to)$/i.test(prelude) || /%\s*,/.test(prelude)) {
        out += prelude + "{" + rewriteBlock(body, null) + "}"; // keyframe selectors
      } else {
        var sel = rewriteSelector(prelude);
        if (sel) out += sel + "{" + rewriteBlock(body, { selector: sel, media: media }) + "}";
      }
    }
    return out;
  }

  function rewriteCss(css, base) {
    css = stripComments(css);
    if (base) {
      css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, function (all, q, u) {
        if (/^(data:|https?:|\/|#)/i.test(u)) return all;
        try { return "url(" + q + new URL(u, base).href + q + ")"; } catch (e) { return all; }
      });
    }
    return rewriteRules(css, null);
  }

  /* ── sheet bookkeeping ────────────────────────────────────────────── */

  var sources = []; // { node, text, base, out, key }
  var outEl = null;
  var dirtyCss = false;

  function sourceFor(node) {
    for (var i = 0; i < sources.length; i++) if (sources[i].node === node) return sources[i];
    return null;
  }

  function ownNode(node) { return node.hasAttribute && node.hasAttribute("data-legacy-css"); }

  function disable(node) {
    try { if (node.sheet) node.sheet.disabled = true; } catch (e) {}
  }

  function addStyle(node) {
    if (ownNode(node)) return;
    var text = node.textContent || "";
    var s = sourceFor(node);
    // a changed text gives the element a new, enabled sheet
    disable(node);
    if (s && s.text === text) return;
    if (!s) { s = { node: node }; sources.push(s); }
    s.text = text; s.out = null;
    dirtyCss = true;
    schedule();
  }

  function addLink(node) {
    if (sourceFor(node) || !/\bstylesheet\b/i.test(node.rel || "") || !node.href) return;
    if (new URL(node.href, location.href).origin !== location.origin) return;
    var s = { node: node, text: null, out: null, base: node.href };
    sources.push(s);
    var x = new XMLHttpRequest();
    x.open("GET", node.href, true);
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) { s.text = x.responseText; dirtyCss = true; schedule(); }
    };
    x.send();
    node.addEventListener("load", function () { if (s.out !== null) disable(node); });
  }

  function scan(root) {
    var list = root.querySelectorAll("style, link[rel~=stylesheet]");
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (n.tagName === "STYLE") addStyle(n); else addLink(n);
    }
  }

  var pending = 0;
  function schedule() {
    if (!pending) pending = setTimeout(flush, 0);
  }

  var varsKey = "";
  function flush() {
    pending = 0;
    if (dirtyCss) { dirtyCss = false; rebuildCss(); }
    inlineStyles(d);
    scheduleLayout();
  }

  function rebuildCss() {
    readViewport();
    sources = sources.filter(function (s) { return d.documentElement.contains(s.node); });
    sources.sort(function (a, b) { return a.node.compareDocumentPosition(b.node) & 4 ? -1 : 1; });
    rootVars = {}; anyVars = {};
    var i, s;
    for (i = 0; i < sources.length; i++) if (sources[i].text) collectVars(stripComments(sources[i].text));
    var key = vp.w + "x" + vp.h + "|" + vp.rem + "|" + JSON.stringify(rootVars) + JSON.stringify(anyVars);
    var css = "";
    aspectRules = []; gapSelectors = {}; deferred = [];
    for (i = 0; i < sources.length; i++) {
      s = sources[i];
      if (s.text === null || s.text === undefined) continue;
      if (s.out === null || s.key !== key) {
        try { s.out = rewriteCss(s.text, s.base); } catch (e) { s.out = ""; }
        s.key = key;
        s.aspect = aspectRules.slice(); s.gaps = gapSelectors; s.deferred = deferred;
        aspectRules = []; gapSelectors = {}; deferred = [];
      }
      var media = s.node.getAttribute("media");
      css += media && media !== "all" ? "@media " + media + "{" + s.out + "}" : s.out;
    }
    // aspect/gap bookkeeping is per source, so cached sources still contribute
    aspectRules = []; gapSelectors = {}; deferred = [];
    for (i = 0; i < sources.length; i++) {
      s = sources[i];
      if (s.deferred) deferred = deferred.concat(s.deferred);
      if (s.aspect) aspectRules = aspectRules.concat(s.aspect);
      if (s.gaps) for (var g in s.gaps) gapSelectors[g] = 1;
    }
    varsKey = key;
    if (!outEl) {
      outEl = d.createElement("style");
      outEl.setAttribute("data-legacy-css", "");
    }
    if (outEl.textContent !== css) outEl.textContent = css;
    if (outEl.parentNode !== d.head || d.head.lastChild !== outEl) d.head.appendChild(outEl);
    for (i = 0; i < sources.length; i++) if (sources[i].out !== null) disable(sources[i].node);
  }

  /* ── inline style attributes rendered on the server ───────────────── */

  // Only the declarations that need rewriting are kept, per element, so a
  // later React/motion update to any other property is never undone.
  var NEEDS = /(clamp|min|max)\(|(^|[;\s])(inset|padding-inline|padding-block|margin-inline|margin-block|translate|scale|rotate)\s*:|[sdl]v[hw]\b/i;
  var inlineDone = typeof WeakMap === "function" ? new WeakMap() : null;

  function inlineStyles(root) {
    if (!inlineDone) return;
    var els = root.querySelectorAll("[style]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (inlineDone.has(el)) continue;
      var attr = el.getAttribute("style") || "";
      if (!NEEDS.test(attr)) { inlineDone.set(el, null); continue; }
      var keep = splitTop(attr, ";").filter(function (dcl) { return NEEDS.test(dcl); }).join(";");
      inlineDone.set(el, keep);
      applyInline(el, keep);
    }
  }

  function applyInline(el, decls) {
    var parts = splitTop(rewriteBlock(decls, null), ";");
    for (var k = 0; k < parts.length; k++) {
      var c = parts[k].indexOf(":");
      if (c < 0) continue;
      var p = trim(parts[k].slice(0, c)), v = trim(parts[k].slice(c + 1)), pri = "";
      if (/!important$/.test(v)) { pri = "important"; v = trim(v.replace(/!important$/, "")); }
      try { el.style.setProperty(p, v, pri); } catch (e) {}
    }
  }

  function reapplyInline() {
    var els = d.querySelectorAll("[style]");
    for (var i = 0; i < els.length; i++) {
      var keep = inlineDone && inlineDone.get(els[i]);
      if (keep) applyInline(els[i], keep);
    }
  }

  /* ── aspect-ratio and flex gap by script ──────────────────────────── */

  var layoutTimer = 0;
  function scheduleLayout() {
    if (!F.aspect && !F.flexgap && !F.math) return;
    clearTimeout(layoutTimer);
    layoutTimer = setTimeout(layoutPass, 80);
  }

  var VAXIS = /^(top|bottom|height|min-height|max-height)$/;
  function resolveDeferred() {
    var touched = [], i, j, el, attr;
    // undo the previous pass first, so the cascade reads cleanly
    var prev = d.querySelectorAll("[data-legacy-pct]");
    for (i = 0; i < prev.length; i++) {
      var saved = JSON.parse(prev[i].getAttribute("data-legacy-pct"));
      for (var pp in saved) prev[i].style.setProperty(pp, saved[pp].v, saved[pp].p);
    }
    for (i = 0; i < deferred.length; i++) {
      var r = deferred[i], els;
      if (r.media && w.matchMedia && !w.matchMedia(r.media).matches) continue;
      try { els = d.querySelectorAll(r.sel); } catch (e) { continue; }
      for (j = 0; j < els.length; j++) {
        el = els[j];
        var cs = w.getComputedStyle(el);
        // only where this rule's estimate is what won the cascade
        if (Math.abs(parseFloat(cs.getPropertyValue(r.prop)) - r.est) > 0.6) continue;
        var cb = cs.position === "absolute" ? el.offsetParent : cs.position === "fixed" ? null : el.parentElement;
        if (cs.position === "absolute" && !cb) continue;
        var vert = VAXIS.test(r.prop);
        var basis = cb ? (vert ? cb.clientHeight : cb.clientWidth) : (vert ? vp.h : vp.w);
        var val = evalMath(r.raw, r.prop, r.vars, {}, basis);
        if (!/px$/.test(val)) continue;
        attr = el.getAttribute("data-legacy-pct");
        var rec = attr ? JSON.parse(attr) : {};
        if (!rec[r.prop]) rec[r.prop] = { v: el.style.getPropertyValue(r.prop), p: el.style.getPropertyPriority(r.prop) };
        el.setAttribute("data-legacy-pct", JSON.stringify(rec));
        touched.push([el, r.prop, val, r.imp]);
      }
    }
    for (i = 0; i < touched.length; i++) touched[i][0].style.setProperty(touched[i][1], touched[i][2], touched[i][3] ? "important" : "");
  }

  function layoutPass() {
    var i, j, els;
    if (F.math && deferred.length) resolveDeferred();
    if (F.aspect) {
      for (i = 0; i < aspectRules.length; i++) {
        var r = aspectRules[i];
        if (r[3]) continue; // the rule sets its own height
        if (r[2] && w.matchMedia && !w.matchMedia(r[2]).matches) continue;
        try { els = d.querySelectorAll(r[0]); } catch (e) { continue; }
        for (j = 0; j < els.length; j++) {
          var el = els[j];
          if (el.getAttribute("data-legacy-ar") === null) el.setAttribute("data-legacy-ar", el.style.height || "");
          el.style.height = el.getAttribute("data-legacy-ar");
          var box = el.getBoundingClientRect();
          if (box.width > 0 && box.height < box.width / r[1] - 1) el.style.height = box.width / r[1] + "px";
        }
      }
    }
    if (F.aspect) {
      // inline aspect-ratio from React styles (FlipCard, MediaSlot): React's
      // `style.aspectRatio = ...` is a no-op here, so read the server-rendered attribute
      els = d.querySelectorAll('[style*="aspect-ratio"]');
      for (j = 0; j < els.length; j++) {
        var ie = els[j];
        var src = ie.getAttribute("data-legacy-style") || ie.getAttribute("style") || "";
        var am = /aspect-ratio\s*:\s*([^;]+)/i.exec(src);
        if (!am) continue;
        var ratio = parseRatio(ie, am[1]);
        if (!(ratio > 0)) continue;
        if (ie.getAttribute("data-legacy-ar") === null) ie.setAttribute("data-legacy-ar", ie.style.height || "");
        ie.style.height = ie.getAttribute("data-legacy-ar");
        var ib = ie.getBoundingClientRect();
        if (ib.width > 0 && ib.height < ib.width / ratio - 1) ie.style.height = ib.width / ratio + "px";
      }
    }
    if (F.aspect) {
      // Old flexbox stretches an <img> to its natural height whatever its
      // width: a 260px-wide 744x220 ornament came out 220px tall. Top-align
      // just the images that are visibly taller than their own ratio.
      els = d.querySelectorAll("img");
      for (j = 0; j < els.length; j++) {
        var im = els[j];
        if (!im.naturalWidth || im.style.alignSelf) continue;
        var pcs = im.parentElement && w.getComputedStyle(im.parentElement);
        if (!pcs || !/flex/.test(pcs.display) || pcs.flexDirection.indexOf("row") !== 0) continue;
        var ir = im.getBoundingClientRect();
        if (ir.width > 0 && ir.height > ir.width * im.naturalHeight / im.naturalWidth + 2) {
          var a = w.getComputedStyle(im).alignSelf;
          if (a === "stretch" || a === "normal" || a === "auto") im.style.alignSelf = /center/.test(pcs.alignItems) ? "center" : "flex-start";
        }
      }
    }
    if (F.flexgap) {
      for (var sel in gapSelectors) {
        try { els = d.querySelectorAll(sel); } catch (e) { continue; }
        for (j = 0; j < els.length; j++) flexGap(els[j]);
      }
    }
  }

  // "4 / 5", "1.25", or var(--x, 4 / 5) resolved on the element
  function parseRatio(el, v) {
    v = trim(v).replace(/!\s*important$/i, "");
    var vm = /^var\(\s*(--[\w-]+)\s*(,([\s\S]*))?\)$/.exec(v);
    if (vm) {
      var cv = trim(w.getComputedStyle(el).getPropertyValue(vm[1]) || "");
      v = cv || trim(vm[3] || "");
    }
    var parts = v.split("/");
    var a = parseFloat(parts[0]), b = parts.length > 1 ? parseFloat(parts[1]) : 1;
    return a > 0 && b > 0 ? a / b : 0;
  }

  function flexGap(el) {
    var cs = w.getComputedStyle(el);
    if (!/flex/.test(cs.display)) return;
    var cg = parseFloat(cs.columnGap) || 0, rg = parseFloat(cs.rowGap) || 0;
    if (!cg && !rg) return;
    var dir = cs.flexDirection, col = dir.indexOf("column") === 0, rev = /reverse/.test(dir);
    var kids = [], c, k;
    for (k = 0; k < el.children.length; k++) {
      c = el.children[k];
      var kcs = w.getComputedStyle(c);
      if (kcs.display === "none" || kcs.position === "absolute" || kcs.position === "fixed") continue;
      if (c.getAttribute("data-legacy-gap") === null) {
        c.setAttribute("data-legacy-gap", JSON.stringify([c.style.marginLeft, c.style.marginRight, c.style.marginTop, c.style.marginBottom]));
      }
      var o = JSON.parse(c.getAttribute("data-legacy-gap"));
      c.style.marginLeft = o[0]; c.style.marginRight = o[1]; c.style.marginTop = o[2]; c.style.marginBottom = o[3];
      kids.push(c);
    }
    var mainSide = col ? (rev ? "marginBottom" : "marginTop") : (rev ? "marginRight" : "marginLeft");
    var main = col ? rg : cg, cross = col ? cg : rg;
    var base = [];
    for (k = 0; k < kids.length; k++) base.push(parseFloat(w.getComputedStyle(kids[k])[mainSide]) || 0);
    for (k = 1; k < kids.length; k++) kids[k].style[mainSide] = base[k] + main + "px";
    if (cs.flexWrap !== "nowrap" && cross && !col) {
      // a new line starts where an item drops below its predecessor: no main gap, cross gap above
      for (k = 1; k < kids.length; k++) {
        if (kids[k].offsetTop > kids[k - 1].offsetTop + 1) {
          kids[k].style[mainSide] = base[k] + "px";
          kids[k].style.marginTop = (parseFloat(w.getComputedStyle(kids[k]).marginTop) || 0) + cross + "px";
        }
      }
    }
  }

  function measureFlexGap() {
    var t = d.createElement("div");
    t.style.cssText = "display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden";
    t.appendChild(d.createElement("div"));
    t.appendChild(d.createElement("div"));
    d.body.appendChild(t);
    var ok = t.scrollHeight === 1;
    d.body.removeChild(t);
    return !ok;
  }

  /* ── wiring ───────────────────────────────────────────────────────── */

  var observer = new MutationObserver(function (records) {
    var css = false, nodes = false;
    for (var i = 0; i < records.length; i++) {
      var r = records[i], t = r.target;
      if (r.type === "characterData") {
        t = t.parentNode;
        if (t && t.tagName === "STYLE" && !ownNode(t)) { addStyle(t); css = true; }
        continue;
      }
      if (t && t.tagName === "STYLE" && !ownNode(t)) { addStyle(t); css = true; }
      for (var k = 0; k < r.addedNodes.length; k++) {
        var n = r.addedNodes[k];
        if (n.nodeType !== 1 || ownNode(n)) continue;
        nodes = true;
        if (n.tagName === "STYLE") { addStyle(n); css = true; }
        else if (n.tagName === "LINK") addLink(n);
        else if (n.querySelector && n.querySelector("style, link[rel~=stylesheet]")) { scan(n); css = true; }
      }
    }
    if (css || nodes) schedule();
  });
  observer.observe(d.documentElement, { childList: true, subtree: true, characterData: true });

  var resizeTimer = 0;
  w.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (F.math) {
        // clamp()/min()/max() were evaluated for the previous viewport
        dirtyCss = true;
        readViewport();
        reapplyInline();
      }
      schedule();
    }, 150);
  });

  function start() {
    F.flexgap = measureFlexGap();
    scan(d);
    dirtyCss = true;
    schedule();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", start);
  else start();
  w.addEventListener("load", function () { dirtyCss = true; schedule(); });
  // image sizes feed the aspect/flex fixes; load does not bubble, so capture it
  d.addEventListener("load", function (e) { if (e.target && e.target.tagName === "IMG") scheduleLayout(); }, true);
  w.__legacyCss = F;
  // For values React sets on the client, where an old engine rejects
  // clamp()/min()/max() silently: see src/lib/css-math.ts
  w.__legacyMath = function (value, prop) {
    if (!F.math || typeof value !== "string") return value;
    readViewport();
    return evalMath(value, prop || "width", {});
  };
})();
