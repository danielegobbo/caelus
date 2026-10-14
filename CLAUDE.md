# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Local copies of the published Lovable site <https://kandengues-smile-studio.lovable.app/>
("Dentista para Kandengues", a pediatric dentistry clinic in Luanda; content is in Portuguese).
There is no application source code here: the original React/TypeScript project lives in Lovable.
Each top-level folder is an independent copy of the same 10-page site:

| Folder | What it is | Port |
| --- | --- | --- |
| `lovable-code/` | Byte-exact mirror of the published site (HTML, compiled JS/CSS, images, `robots.txt`, `sitemap.xml`). **Has its own nested git repo.** | 8080 |
| `lovable/` | Mirror made by another tool; hosting telemetry scripts stripped from the HTML. | 8080 |
| `lovable-codex/` | Mirror made by another tool (Codex), HTML unmodified, includes `__l5e/` and `~flock.js`. **Do not modify this folder.** | 8081 |

A static, React-free rewrite of the site (clean HTML + vanilla `main.js`) lives outside this repo
in `C:\Users\danie\apps\lovable-claude` (its own git repo).

## Running a copy

No build, lint or test tooling exists. Each mirror is served with Python 3:

```sh
cd lovable-code && python serve.py [port]   # or double-click avvia.cmd
```

Pages cannot be opened from disk (`file://`): they use absolute `/assets/...` URLs and ES modules.
`lovable-code/serve.py` also maps `/sobre` -> `sobre/index.html` without a 301 redirect (the client
router expects the slash-less path) and hides the helper files; the other two mirrors use the plain
`SimpleHTTPRequestHandler`. `serve.py`, `avvia.cmd`, `README.md` and `mirror-report.json` are not part
of the site and must be excluded when deploying to static hosting.

To check rendering, headless Chrome works (Edge headless produces no output on this machine):
`"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --screenshot=out.png --window-size=1280,900 --virtual-time-budget=6000 http://127.0.0.1:8080/`.
Scroll-reveal sections start at `opacity-0` and depend on IntersectionObserver, so headless
screenshots may catch them blank or mid-fade; that is timing, not a bug. Headless Chrome also
enforces a ~500px minimum window width, so "mobile" screenshots overflow on the original too.

## How the mirrored site is built (big picture)

- The original is TanStack Start (React SSR, Vite). Each route (`/`, `/sobre`, `/servicos`,
  `/medicos`, `/galeria`, `/blog`, `/contacto`, `/faq`, `/privacidade`, `/termos`) is saved as
  `<route>/index.html` containing fully server-rendered markup, then hydrated by
  `assets/index-*.js` plus per-route chunks (`assets/<route>-*.js`) and shared components
  (`Section`, `PageHero`, `ServicesGrid`, `DoctorsGrid`, `GalleryGrid`, `StatsBand`).
- Asset filenames carry Vite content hashes; some `.jpg` files are actually PNG data. Never rename
  them in a mirror: the compiled JS references the exact names, including dynamically imported ones
  that do not appear in any HTML.
- `assets/styles-*.css` is compiled Tailwind v4 holding the design tokens (`:root` oklch colors,
  `--gradient-*`, `--shadow-soft/lift`, `.lux-card`, `.eyebrow`, `animate-lux-in`). It only contains
  classes used by the original source, so new Tailwind classes added to the HTML have no effect.
- Content that is *not* in the SSR HTML and only exists in the JS bundles: FAQ answers (Radix
  accordion, closed panels render empty), counter target values (6+, 5400+, 10, 98%), the mobile
  menu, cookie banner (`localStorage` key `dpk-cookies`), gallery lightbox and newsletter toast.
  Clinic data (phone, WhatsApp, email, address, hours, social links) is a single object in
  `assets/index-*.js` reused across pages.

## Git state to be aware of

- Single repo for the whole folder (branch `main`, remote `origin` = `github.com/danielegobbo/caelus`).
  `lovable-code/`'s former nested repo history was merged in, so its earlier commits appear in the log.
- `.gitattributes` is `* -text`: git must never normalize line endings, the mirrors are byte-exact.
- `gh` is not installed; pushing needs the user to be authenticated with GitHub on this machine.
