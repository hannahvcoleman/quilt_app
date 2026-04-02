---
name: Quillt component file map
description: Key component and layout file paths, their roles, and design-relevant class names
type: project
---

**Global styles:** `src/styles/global.css`
**Constants (SITE_TITLE etc.):** `src/consts.ts` — currently: SITE_TITLE='Quillt', SITE_DESCRIPTION='writing that flows', SITE_AUTHOR='Quillt'

**Layout files:**
- `src/layouts/PostLayout.astro` — wraps individual post pages. Hero image `.cover-image` is 95vw, outside `<main>`. `<main>` uses `--content-width` (75vw). `<article>` is full width of main. Prose at 1.25rem/1.7. Post h1 uses `--font-display` (Newsreader) at `clamp(2.25rem, 4.5vw, 4rem)`.

**Page files:**
- `src/pages/index.astro` — homepage. `main` uses `--wide-width` (95vw). Featured post `.featured-image` at `clamp(320px, 60vh, 700px)`. `.featured-title` uses `--font-masthead` (Archivo Black), tight `-3px` letter-spacing. Remaining posts in `.post-grid` (2-col, collapses to 1-col at 860px). Grid divider is `2px solid var(--color-text)`.

**Component files:**
- `src/components/Header.astro` — Magazine masthead layout. Three sections: `.header-topbar` (nav links right-aligned), `.masthead-wrap` (QUILLT wordmark in Archivo Black, `clamp(4rem, 8vw, 8rem)`, `-5px` letter-spacing, `40px 60px` padding), `.tag-strip` (category nav using `.tag-btn` global class). Header has `border-bottom: 2px solid var(--color-text)`. Tag strip has hardcoded placeholder categories — active category gets mint green background via `.active` class.
- `src/components/PostCard.astro` — homepage grid cards. `border-radius: 0` on `.post-card` container. `.card-image img` is 220px tall, `border-radius: 0`. h2 uses `--font-display` (Newsreader), 1.35rem, weight 700. Tags are `1px solid var(--color-text)`, no border-radius, uppercase micro-type.
- `src/components/SubscribeForm.astro` — subscribe CTA (do not touch backend logic)
- `src/components/Footer.astro`
- `src/components/BaseHead.astro` — font loading is via `@import` in global.css, not BaseHead

**Global class patterns:**
- `.tag-btn` — editorial tag/category button (1px solid border, no border-radius, 8px 15px padding, hover inverts)
- `.tag-strip` — horizontal scrolling category bar (used in Header)
- `.prose` — post body content styles
- `.sr-only` — screen-reader only

**Why:** Knowing these locations avoids grep-hunting in future sessions.
**How to apply:** Read these files directly before making any changes to confirm current state.
