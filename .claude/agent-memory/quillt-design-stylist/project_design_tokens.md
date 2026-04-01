---
name: Quillt design tokens
description: Current CSS custom property values, font stack, and width tokens in global.css
type: project
---

All tokens live in `src/styles/global.css` at `:root`.

**Colour palette**
- `--color-bg: #faf9f6` (warm off-white/cream)
- `--color-text: #1a1a1a` (near-black)
- `--color-text-muted: #6b6560` (warm grey — dates, excerpts)
- `--color-accent: #b45309` (burnt amber)
- `--color-accent-hover: #92400e`
- `--color-surface: #ffffff`
- `--color-border: #e8e6e1`

**Typography**
- `--font-display: 'Playfair Display', serif` — masthead/wordmark only, 900 weight loaded
- `--font-body: 'Newsreader', Georgia, serif` — body text and post titles, weights 400/400i/700 loaded
- `--font-ui: 'Inter', system-ui, sans-serif` — nav, dates, tags, buttons, weights 400/500/600/700 loaded

Google Fonts @import: `Inter` + `Newsreader` + `Playfair+Display` (all with `display=swap`)

**Layout widths**
- `--content-width: min(70vw, 1000px)` — article text columns
- `--wide-width: min(85vw, 1280px)` — hero images, main containers, nav

**Status/UI colours**
- `--color-success: #15803d`
- `--color-error: #b91c1c`

**Code block colours**
- `--color-code-bg: #1c1917`
- `--color-code-text: #e7e5e4`

**Breakpoints (global.css)**
- 860px: single-column grid, body 18px, main padding 1.25rem sides
- 600px: hero image 40vh, body 17px, main padding 1rem sides, Posts nav link hidden

**Why:** Matches DESIGN_BRIEF.md targets (70% viewport for body text, 85% for full-bleed images on desktop up to 1440px). Status/code tokens added in priority 6 colour audit pass.
**How to apply:** Always use these tokens rather than hardcoded hex values. All components now use custom properties — zero hardcoded hex outside `:root` definitions.
