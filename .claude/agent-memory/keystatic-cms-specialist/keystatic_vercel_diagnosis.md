---
name: Keystatic debugging history — resolved
description: Historical record of Keystatic debugging. Root cause was swapped Vercel env vars, not code. All workarounds cleaned up 2026-04-01.
type: project
---

**Root cause (resolved):** Swapped environment variables in Vercel project settings. The OAuth flow requires `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to be correctly set. CMS is working as of 2026-04-01.

**Workarounds added during debugging (now cleaned up):**
- `keystatic({ injectRoutes: false })` — integration takes 0 args; this was silently ignored dead code. Removed.
- `pathPrefix: 'quilt_app'` in storage config — wrong; project is at repo root, this prefix caused Keystatic to look for content at a non-existent path. Removed.
- `src/pages/api/keystatic/[...params].ts` — duplicate of the route the integration already injects. Caused route collision warnings at build. Deleted.

**Kept from debugging (still valid):**
- `output: 'server'` — correct for Vercel SSR adapter.
- `export const prerender = true` on content pages — required with `output: 'server'` to opt static pages back into static generation.
- `src/pages/keystatic/[...params].astro` + `src/components/KeystaticApp.tsx` — still needed in Astro 6. The integration injects `keystatic-astro-page.astro` via `injectRoute()`, but in Astro 6 injected external routes do not get framework renderers registered in the SSR manifest. The project-owned wrapper forces React into the manifest so `client:only="react"` hydration works.

**Astro 6 injected route renderer issue:** This is a framework behavior separate from the env var problem. Do not remove the wrapper page without first verifying that `"renderers"` in the built manifest includes the React renderer entry when the wrapper is absent.
