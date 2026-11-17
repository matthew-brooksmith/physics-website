/* The essay list engine. You shouldn't need to edit this — settings live in
   config.js. Everything user-supplied is inserted with textContent, never
   innerHTML, so a filename or PDF title can't inject markup. */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

  /* ── helpers ── */
  function folderURL() {
    var f = String(CONFIG.folder || "essays/");
    return f.charAt(f.length - 1) === "/" ? f : f + "/";
  }

  // A filename may only be a plain .pdf name: no slashes, no "..", no scheme.
  // Stops a tampered manifest pointing the page somewhere else.
  function isSafeFile(f) {
    return typeof f === "string" && /\.pdf$/i.test(f) &&
           f.indexOf("/") < 0 && f.indexOf("\\") < 0 && f.indexOf("..") < 0;
  }

  function safeHref(h) {
    return typeof h === "string" && /^(https?:|mailto:)/i.test(h.trim()) ? h.trim() : null;
  }

  function validDate(y, m, d) {
    var dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  }

  // "2026-11-17 On the arrow of time.pdf" → { iso, title }
  function parseName(file) {
    var stem = file.replace(/\.pdf$/i, "");
    var m = stem.match(/^(\d{4})-(\d{2})-(\d{2})(?:[\s_\-–—]+(.*))?$/);
    var iso = null, rest = stem;
    if (m) {
      rest = m[4] || "";
      if (validDate(+m[1], +m[2], +m[3])) iso = m[1] + "-" + m[2] + "-" + m[3];
    }
    return { iso: iso, title: rest.replace(/_/g, " ").replace(/\s+/g, " ").trim() };
  }

  function prettyDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return (+p[2]) + " " + MONTHS[+p[1] - 1] + " " + p[0];
  }

  function prettySize(bytes) {
    if (!(bytes > 0)) return "";
    if (bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ── turn a manifest entry (or bare filename) into an essay ── */
  function normalise(entry) {
    var e = typeof entry === "string" ? { file: entry } : (entry || {});
    if (!isSafeFile(e.file)) return null;
    var parsed = parseName(e.file);
    var over = (CONFIG.meta && CONFIG.meta[e.file]) || {};
    var title = over.title || parsed.title || e.title ||
                e.file.replace(/\.pdf$/i, "");
    return {
      file: e.file,
      iso: parsed.iso || (typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : null),
      title: String(title),
      summary: String(over.summary || e.summary || ""),
      pages: +e.pages || 0,
      size: +e.size || 0
    };
  }

  /* ── discovery: manifest.json, else a server directory listing ── */
  function discover() {
    var dir = folderURL();
    return fetch(dir + "manifest.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (list) {
        if (Array.isArray(list) && list.length) return list;
        // Local `python3 -m http.server` lists the folder; parse that instead.
        return fetch(dir, { cache: "no-store" })
          .then(function (r) { return r.ok ? r.text() : null; })
          .then(function (html) {
            if (!html) return [];
            var doc = new DOMParser().parseFromString(html, "text/html");
            var seen = {}, out = [];
            Array.prototype.forEach.call(doc.querySelectorAll("a[href]"), function (a) {
              var f;
              try { f = decodeURIComponent((a.getAttribute("href") || "").split("?")[0].split("/").pop() || ""); }
              catch (_) { return; }
              if (isSafeFile(f) && !seen[f]) { seen[f] = 1; out.push(f); }
            });
            return out;
          })
          .catch(function () { return []; });
      });
  }

  /* ── rendering ── */
  function renderList(essays) {
    var list = $("list");
    var desc = CONFIG.order !== "asc";
    essays.sort(function (a, b) {
      if (!a.iso && !b.iso) return a.title.localeCompare(b.title);
      if (!a.iso) return 1;            // undated always last
      if (!b.iso) return -1;
      return desc ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso);
    });

    $("count").textContent = String(essays.length);

    essays.forEach(function (e) {
      var href = folderURL() + encodeURIComponent(e.file);
      var li = el("li", "item");

      var date = el("time", "date", e.iso ? prettyDate(e.iso) : "Undated");
      if (e.iso) date.setAttribute("datetime", e.iso);

      var body = el("div", "body");
      var a = el("a", "title", e.title);
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      body.appendChild(a);
      if (e.summary) body.appendChild(el("p", "summary", e.summary));

      var bits = [];
      if (e.pages) bits.push(e.pages + (e.pages === 1 ? " page" : " pages"));
      bits.push("PDF" + (e.size ? " · " + prettySize(e.size) : ""));
      var meta = el("div", "meta");
      meta.appendChild(el("span", null, bits.join(" · ")));
      var dl = el("a", "download", "Download");
      dl.href = href;
      dl.setAttribute("download", e.file);
      meta.appendChild(dl);
      body.appendChild(meta);

      li.appendChild(date);
      li.appendChild(body);
      list.appendChild(li);
    });
  }

  function renderEmpty() {
    var box = $("empty");
    box.appendChild(el("h3", null, "No essays found"));
    var p = el("p");
    p.appendChild(document.createTextNode("Put a PDF in the "));
    p.appendChild(el("code", null, folderURL()));
    p.appendChild(document.createTextNode(" folder. If this is the live site, the deploy may still be running, or "));
    p.appendChild(el("code", null, folderURL() + "manifest.json"));
    p.appendChild(document.createTextNode(" wasn't generated. Opening index.html straight from disk won't work either — see README §1."));
    box.appendChild(p);
    document.body.classList.add("is-empty");
  }

  function renderStatic() {
    if (CONFIG.title) {
      $("wordmark").textContent = CONFIG.title;
      $("footerName").textContent = CONFIG.title;
    }
    $("year").textContent = String(new Date().getFullYear());
    $("heading").textContent = CONFIG.heading || "Essays";
    $("intro").textContent = CONFIG.intro || "";
    if (!CONFIG.grain) $("grain").remove();

    var s = CONFIG.support || {};
    var buttons = [
      { href: safeHref(s.substack), label: "Subscribe", sub: "substack", subCls: "btn-sub tt", cls: "btn btn-primary" },
      { href: safeHref(s.buymeacoffee), label: "Buy me a coffee", sub: "“buy me a coffee”", subCls: "btn-sub it", cls: "btn" }
    ].filter(function (b) { return b.href; });

    if (!buttons.length) {
      document.body.classList.add("no-support");
      return;
    }
    $("supportTitle").textContent = s.heading || "Support";
    // In the text, "Substack" is set like LaTeX's \texttt{substack}, and
    // "buy me a coffee" like \textit{``buy me a coffee''}.
    String(s.text || "").split(/(substack|buy\s+me\s+a\s+coffee)/i).forEach(function (part, i) {
      var node = !(i % 2) ? document.createTextNode(part)
               : /substack/i.test(part) ? el("span", "tt", part.toLowerCase())
               : el("em", "it", "\u201c" + part.toLowerCase() + "\u201d");
      $("supportText").appendChild(node);
    });
    buttons.forEach(function (b) {
      var a = el("a", b.cls);
      a.href = b.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.appendChild(el("span", "btn-label", b.label));
      a.appendChild(el("span", b.subCls || "btn-sub", b.sub));
      $("supportButtons").appendChild(a);
    });
  }

  renderStatic();
  discover().then(function (raw) {
    var essays = raw.map(normalise).filter(Boolean);
    if (essays.length) renderList(essays); else renderEmpty();
  });
})();
