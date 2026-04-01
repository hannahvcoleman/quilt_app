---
name: Quillt component file map
description: Key component and layout file paths, their roles, and design-relevant class names
type: project
---

**Global styles:** `src/styles/global.css`
**Constants (SITE_TITLE etc.):** `src/consts.ts` — currently: SITE_TITLE='Quillt', SITE_DESCRIPTION='writing that flows', SITE_AUTHOR='Quillt'

**Layout files:**
- `src/layouts/PostLayout.astro` — wraps individual post pages. `main` uses `--wide-width`; `article` uses `--content-width`. Hero image in `.cover-image`. Side padding: `clamp(1rem, 4vw, 3rem)`.
- (BaseLayout assumed but not yet inspected)

**Page files:**
- `src/pages/index.astro` — homepage. `main` uses `--wide-width`. Features a `.featured-post` hero section (first post, `.featured-title` in `--font-display` 900 weight, `.featured-image` at 52vh clamp). Remaining posts in `.post-grid` (2-col fixed, `repeat(2, 1fr)`, collapses to 1-col at 860px). Grid only renders when 2+ posts exist.

**Component files:**
- `src/components/Header.astro` — sticky header. `.site-title` is the Quillt wordmark. Nav in `.nav-links`. `.nav-posts` (Posts link) is `display: none` at 600px — logo already links home.
- `src/components/PostCard.astro` — homepage grid cards. `.post-card` has `border-radius: 10px`. `.card-image img` has `border-radius: 0`. `h2` uses `--font-display`, 900 weight, 1.3rem.
- `src/components/SubscribeForm.astro` — subscribe CTA (do not touch backend logic)
- `src/components/Footer.astro`
- `src/components/BaseHead.astro`

**Why:** Knowing these locations avoids grep-hunting in future sessions.
**How to apply:** Read these files directly before making any changes to confirm current state.
