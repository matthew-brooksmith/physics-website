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
  intro:   "Notes and longer pieces written while learning physics. Each one is a PDF; click a title to read it.",
  folder:  "essays/",              // where your PDFs live
  order:   "desc",                 // "desc" = newest first, "asc" = oldest first
  grain:   true,                   // faint paper texture over the background

  about: {
    heading: "About",
    // One paragraph per string. Rewrite these in your own words.
    body: [
      "I am a student writing about the physics I am learning, one essay at a time.",
      "This site is a plain archive: no social media, no tracking, just the essays."
    ],
    // Only http(s) and mailto links are accepted; anything else is dropped.
    links: [
      // e.g. { label: "Email", href: "mailto:you@example.com" },
      // { label: "Photography", href: "https://matthew-brooksmith.github.io/photography-website/" },
    ]
  },

  // ── Support buttons ─────────────────────────────────────────────────
  // Paste your page addresses here once the accounts exist (see README §4).
  // Leave one as "" and its button simply doesn't appear; leave both empty
  // and the whole "Support" section disappears.
  support: {
    heading: "Support the writing",
    text:    "Get new essays by email on Substack, or buy me a coffee if one helped you.",
    substack:     "",  // e.g. "https://yourname.substack.com"
    buymeacoffee: "",  // e.g. "https://buymeacoffee.com/yourname"
  },

  meta: {   // optional per-file overrides, keyed by EXACT filename
    // "2026-11-17 On the arrow of time.pdf": { title: "On the Arrow of Time", summary: "Why entropy picks a direction." },
  },
};
