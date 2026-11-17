# Physics essays — website

A single page that lists your essays. The only two things you change are the
PDFs in `essays/` and the settings in `config.js`. Same look and same build as
the photography site: two colours, Anton headings, no trackers, no CDNs.

```
physics-website/
├── index.html                  page structure
├── config.js                   ← your settings. This is the file you edit
├── app.js                      the list engine (leave alone)
├── style.css                   the design
├── fonts.css  fonts/           self-hosted Anton + Newsreader (see §6)
├── favicon.svg  grain.svg      small graphics
├── _headers                    security headers, for if you leave GitHub Pages
├── tools/build-manifest.py     makes essays/manifest.json (the workflow runs it)
├── tools/fetch-fonts.py        downloads the fonts once, so Google isn't involved
├── .github/workflows/deploy.yml  strips PDF metadata, builds the list, publishes
└── essays/
    └── 2026-11-17 Lorem ipsum and the arrow of time.pdf   ← placeholder, delete later
```

---

## 1. Adding an essay

1. Export the finished essay as a PDF.
2. Name it **date, space, title**: `2026-11-17 On the arrow of time.pdf`.
   The date orders the list (newest first) and the rest becomes the title.
3. Put it in `essays/`.
4. Commit and push (GitHub Desktop: write a summary, **Commit to main**,
   **Push origin**). The site updates itself in about a minute.

Optional extras:

- **Summary line.** Whatever is in the PDF's *Subject* field shows under the
  title. Or add one in `config.js` under `meta`.
- **Nicer title** (capitals, punctuation a filename can't hold like `?` or
  `:`): set it in `config.js` under `meta`, or leave the filename as just the
  date and the title stored inside the PDF is used.
- **Fixing a typo** in an essay: replace the PDF under the same name and push.

To remove an essay, delete the file and push. Delete the lorem ipsum
placeholder once your first real essay is in.

> **iCloud note.** This folder lives in iCloud Drive. That's fine, but if a
> PDF shows a cloud icon in Finder it hasn't downloaded to this Mac yet, and
> git can't see it. Right-click → **Download Now** before committing.

## 2. Previewing locally

Double-clicking `index.html` won't work (browsers block folder reads on
`file://`). In Terminal, from this folder:

```
python3 -m http.server
```

then open **http://localhost:8000/**. Ctrl-C stops it. Locally the list is
built from the folder itself, so titles come from filenames and there are no
page counts. The live site has both.

## 3. Publishing on GitHub Pages (once)

1. On github.com open the **physics-website** repository → **Settings** →
   **Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push anything to `main` (or open the **Actions** tab → *Deploy essays* →
   **Run workflow**).
4. A minute later the site is at
   `https://matthew-brooksmith.github.io/physics-website/`.

A custom domain works exactly as in the photography site's README §4.
Netlify and Cloudflare Pages are free alternatives that also read `_headers`.

## 4. Setting up Substack and Buy Me a Coffee

The page shows a **Support** section with one button per service. A button
only appears once its address is filled in, so you can set up one, both, or
neither.

**Buy Me a Coffee** (one-off tips):

1. Go to **buymeacoffee.com** → **Start my page**. Sign up with email or Google.
2. Pick your page name. This becomes the address, e.g.
   `buymeacoffee.com/matthewbrooksmith`.
3. Add a short bio and a photo; you can skip memberships and shop.
4. **Settings → Payouts**: connect Stripe (or PayPal where offered) so money
   can reach your bank. Stripe asks for ID and bank details.
5. Copy your page address.

**Substack** (readers subscribe by email; paid subscriptions optional):

1. Go to **substack.com** → **Start writing**. Sign up.
2. Name the publication and pick its address, e.g.
   `matthewbrooksmith.substack.com`.
3. Write a one-line description. A short first post announcing the essays
   site is a good start.
4. Optional: **Settings → Payments** turns on paid subscriptions through
   Stripe. Free subscribers need no setup.
5. Copy the publication address.

Then in `config.js`:

```js
support: {
  ...
  substack:     "https://matthewbrooksmith.substack.com",
  buymeacoffee: "https://buymeacoffee.com/matthewbrooksmith",
},
```

Commit, push, done. If you're under 18, payouts on either service need a
parent or guardian to own the Stripe account.

The buttons are plain links, not the services' embed widgets, so neither
company can see who visits your site.

## 5. Privacy

On every deploy, the workflow strips hidden metadata from each published PDF.
Word, Pages and LaTeX record your account name, the software used and
sometimes the original file path; only *Title* and *Subject* are kept,
because the site shows those anyway. The build refuses to publish if an
author field survives.

The copies in the repository itself are untouched, and a public repository
can be browsed by anyone. Free GitHub Pages needs a public repository, so if
that bothers you, clear the author field when exporting (in Pages/Word:
File → Properties) before committing.

## 6. Fonts

Anton (headings, as on the photography site) and Newsreader (reading text)
are served from this site, not Google. The word "substack" is set in
Latin Modern Mono (`fonts/lmmono10-regular.woff2`), the open version of
LaTeX's `\texttt` font, declared at the top of `style.css`. To change them, edit `FAMILIES` in
`tools/fetch-fonts.py`, run it, and commit `fonts.css` and `fonts/`.
