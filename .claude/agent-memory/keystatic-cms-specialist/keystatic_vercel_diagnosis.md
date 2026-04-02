---
name: Keystatic Vercel blank page and 404 root cause diagnosis
description: Full diagnosis of why /keystatic is blank and /api/keystatic returns 404 on Vercel — renderers:[] in manifest is the smoking gun
type: project
---

The build produces `"renderers":[]` in the Astro manifest baked into the server entry. This means NO framework renderers (including React) are registered in the SSR bundle, even though `@astrojs/react` is in the integrations array. Without a registered React renderer, any `client:only="react"` directive produces an empty shell — blank page.

**Why:** The `keystatic()` integration ignores the `{ injectRoutes: false }` argument (it takes 0 params at runtime), so both project-owned routes AND integration-injected routes are registered for the same patterns. This causes 4 collision warnings at build time. More critically, because both versions of `/keystatic/[...params]` are compiled — one using `src/components/KeystaticApp` and one using the internal `keystatic-page.js` — Astro's manifest ends up with a confused route table and the React renderer is not committed to the manifest's `renderers` array.

**Route collision detail:**
- `/api/keystatic/[...params]` is registered twice: `src/pages/api/keystatic/[...params].ts` (origin: project) AND `node_modules/@keystatic/astro/internal/keystatic-api.js` (origin: external)
- `/keystatic/[...params]` is registered twice: `src/pages/keystatic/[...params].astro` (origin: project) AND `node_modules/@keystatic/astro/internal/keystatic-astro-page.astro` (origin: external)
- The project-owned route wins (listed first in manifest routes array), but the injected route chunk is also compiled and registered in `entryModules`

**The `renderers:[]` smoking gun:** The Astro manifest serialized into the Vercel function has `"renderers":[]`. React is not registered. `client:only="react"` cannot hydrate. The UI page renders an empty HTML shell.

**Vercel config.json duplicate routes:** Because both project and injected routes compile, the Vercel `config.json` has `/api/keystatic` and `/keystatic` patterns listed TWICE each — not functionally harmful since both point to `_render`, but confirms the collision is real.

**pathPrefix: 'quilt_app' is NOT the cause of 404s.** This is a GitHub storage config for where Keystatic reads/writes content in the repo. It is irrelevant to HTTP routing.

**Env vars:** The `makeHandler` in the built chunk shows it reads `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` from the environment. If these are not set in Vercel project settings, the OAuth flow will fail — causing API 404s or auth errors even if the UI loads. This is a likely secondary cause of the API 404s.

**The fix direction:** Stop the double-registration. Either remove the project-owned routes and rely solely on the integration's injected routes (and find another way to register the React renderer), OR pass a real `injectRoutes: false`-equivalent — but since the integration ignores that arg, the only reliable fix is to patch the integration call or remove the project-owned routes and instead use `vite.ssr.noExternal` or a renderer registration shim to force React into the manifest. The cleanest path may be to remove `keystatic()` from the integrations array entirely and manually inject only the needed routes and renderer config.

**How to apply:** When asked to fix this, the core problem to solve is getting `"renderers":[...]` to include the React renderer entry in the final manifest. The collision is a symptom; the empty renderers array is the root cause of the blank page.
