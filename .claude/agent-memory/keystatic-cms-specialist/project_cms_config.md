---
name: Project CMS configuration
description: Keystatic config, collections, storage, and file locations for the Quillt project
type: project
---

**Storage:** GitHub mode, repo `hannahvcoleman/quilt_app`, no pathPrefix (project is at repo root)

**Collections:**
- `posts` — slugField: `title`, path: `src/content/posts/*`, format: `{ contentField: 'content' }`
  - Fields: title (slug), description (text multiline), pubDate (date), coverImage (image → public/images/),
    tags (array of text), draft (checkbox), content (document with formatting/dividers/links/images)

**Config file:** `/Users/hannahcoleman/VS_Code/quilt_app/keystatic.config.ts`

**Route files (post-cleanup):**
- UI page: `src/pages/keystatic/[...params].astro` (project-owned, prerender: false) — kept for Astro 6 React renderer registration
- API handler: deleted — integration injects `/api/keystatic/[...params]` automatically; project-owned duplicate was causing route collision warnings
- React wrapper: `src/components/KeystaticApp.tsx` (required for Astro 6 React renderer registration in injected SSR routes)

**Deployment:** Vercel at https://quillt-delta.vercel.app, output: 'server', @astrojs/vercel adapter

**Integration:** `@keystatic/astro` called as `keystatic()` (no args — integration takes 0 params, any args are silently ignored)

**Root cause of past Keystatic breakage:** Swapped environment variables in Vercel — not a code problem. CMS is working as of 2026-04-01.

**Astro content schema:** `src/content/config.ts` — must stay in sync with keystatic.config.ts
