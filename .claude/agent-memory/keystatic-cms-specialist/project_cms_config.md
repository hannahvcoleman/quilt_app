---
name: Project CMS configuration
description: Keystatic config, collections, storage, and file locations for the Quillt project
type: project
---

**Storage:** GitHub mode, repo `hannahvcoleman/quilt_app`

**Collections:**
- `posts` — slugField: `title`, path: `src/content/posts/*`, format: `{ contentField: 'content' }`
  - Fields: title (slug), description (text multiline), pubDate (date), coverImage (image → public/images/),
    tags (array of text), draft (checkbox), content (document with formatting/dividers/links/images)

**Config file:** `/Users/hannahcoleman/VS_Code/quilt_app/keystatic.config.ts`

**Route files:**
- UI page: `src/pages/keystatic/[...params].astro` (project-owned, prerender: false)
- API handler: `src/pages/api/keystatic/[...params].ts` (project-owned, prerender: false)
- React wrapper: `src/components/KeystaticApp.tsx` (required for Astro 6 React renderer registration)

**Deployment:** Vercel at https://quillt-delta.vercel.app

**Integration:** `@keystatic/astro@5.0.6` with `--legacy-peer-deps` (Astro 6 not in peer dep range)

**Astro content schema:** `src/content/config.ts` (verify location) — must stay in sync with keystatic.config.ts
