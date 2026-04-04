---
name: Quillt design tokens
description: Current CSS custom property values, font stack, and width tokens in global.css
type: project
---

All tokens live in `src/styles/global.css` at `:root`.

**Colour palette**
- `--color-bg: #f9f7f2` (cream/off-white — applied globally including `--color-surface`)
- `--color-text: #1a1a1a` (near-black)
- `--color-text-muted: #6b6560` (warm grey — dates, excerpts)
- `--color-accent: #b45309` (burnt amber — links, hover states)
- `--color-accent-hover: #92400e`
- `--color-accent-mint: #b2f2d8` (mint green — active tag highlight)
- `--color-surface: #f9f7f2` (same as bg — no white card backgrounds)
- `--color-border: #e8e6e1`

**Typography**
- `--font-masthead: 'Archivo Black', 'Arial Black', sans-serif` — QUILLT wordmark and featured post titles only
- `--font-display: 'Newsreader', Georgia, serif` — post titles (h1 on post pages)
- `--font-body: 'Newsreader', Georgia, serif` — body text (same as display)
- `--font-ui: 'Inter', system-ui, sans-serif` — nav, dates, tags, buttons, card titles

Google Fonts @import: `Archivo+Black` + `Inter` + `Newsreader` (all with `display=swap`)
Note: Playfair Display has been removed.

**Layout widths**
- `--content-width: min(75vw, 1080px)` — article text columns, post page body
- `--wide-width: min(95vw, 1440px)` — hero images, homepage main container, nav

**Post page hero image**
- `95vw` centred, `clamp(300px, 55vh, 720px)` height, `border-radius: 0`

**Featured post image (homepage)**
- `100%` of `--wide-width` container, `clamp(320px, 60vh, 700px)` height

**Prose**
- `font-size: 1.25rem`, `line-height: 1.7`

**Status/UI colours**
- `--color-success: #15803d`
- `--color-error: #b91c1c`

**Code block colours**
- `--color-code-bg: #1c1917`
- `--color-code-text: #e7e5e4`

**Breakpoints (global.css)**
- 860px: single-column grid, body 18px, main padding 1.25rem sides
- 600px: hero image 42vh, body 17px, main padding 1rem sides, Posts nav link hidden

**Masthead sizing (Header.astro)**
- Desktop: `clamp(8rem, 12vw, 12rem)`, letter-spacing `-6px`, line-height `0.85`, padding `40px 60px`
- Tablet (≤860px): `clamp(5rem, 8vw, 7rem)`, letter-spacing `-4px`, padding `28px 2rem`
- Mobile (≤600px): `clamp(3rem, 10vw, 4rem)`, letter-spacing `-2.5px`, padding `20px 1rem`

**Why:** Colossal-inspired overhaul — cream background, Archivo Black masthead, 75% content width, 95vw hero images, editorial tag strip. Masthead scaled up 2026-04-01 to be intentionally dominant — first thing you notice.
**How to apply:** Always use these tokens rather than hardcoded hex values. All components use custom properties — zero hardcoded hex outside `:root` definitions.
