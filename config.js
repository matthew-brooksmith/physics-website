/* ══════════════════════════════════════════════════════════════════════
   CONFIG — this is the file you edit. Nothing else needs touching.
   ──────────────────────────────────────────────────────────────────────
   ADDING AN ESSAY
   • Drop the finished PDF into the essays/ folder and push. That's it.
   • Name it by date, then title, so it can be ordered and labelled:
        2026-11-17 On the arrow of time.pdf   → "On the arrow of time", 17 November 2026
        2026-11-17_noether_and_symmetry.pdf   → "noether and symmetry", 17 November 2026
   • No title after the date? The title stored inside the PDF is used
     instead (File → Properties → Title in most editors; \title{} in LaTeX
     with hyperref). No date at all? The essay still shows, undated, at the
     end of the list.
   • The PDF's "Subject" field, if you fill it in, becomes the one-line
     summary under the title. Or set one below in `meta`.
   • Serve over HTTP, not file:// — see README.md.

   Everything here is inserted as text rather than markup, so nothing you
   type can turn into code on the page.
   ══════════════════════════════════════════════════════════════════════ */
const CONFIG = {
  title:   "Matthew Brooksmith",   // wordmark, top-left. "" to hide.
  heading: "Essays in physics",    // the big line above the list
  intro:   "Topics include the foundations of physics and the philosophy of physics. I write to consolidate and grow my own ideas and improve my understanding of the subject.",
  folder:  "essays/",              // where your PDFs live
  order:   "desc",                 // "desc" = newest first, "asc" = oldest first
  grain:   true,                   // faint paper texture over the background

  // ── Support buttons ─────────────────────────────────────────────────
  // Your page addresses (see README §4 for how they were set up).
  // Leave one as "" and its button simply doesn't appear; leave both empty
  // and the whole "Support" section disappears.
  support: {
    heading: "Support the writing",
    text:    "If you found one of the essays to be insightful or useful, you can subscribe on Substack or buy me a coffee.",
    substack:     "https://substack.com/@matthewbrooksmith",
    buymeacoffee: "https://buymeacoffee.com/matthewbrooksmith",
  },

  meta: {   // optional per-file overrides, keyed by EXACT filename
    // "2026-11-17 On the arrow of time.pdf": { title: "On the Arrow of Time", summary: "Why entropy picks a direction." },
  },
};
