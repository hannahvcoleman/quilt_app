---
name: Keystatic Astro 6 blank page fix
description: Root cause and fix for /keystatic showing blank page in Astro 6 with output:static
type: project
---

In Astro 6 with `output: 'static'`, the `@keystatic/astro` integration injects two routes via
`injectRoute()`:
- `/keystatic/[...params]` — the UI page
- `/api/keystatic/[...params]` — the API handler

Both use `prerender: false`. The UI page renders `<Keystatic client:only="react" />`.

**Root cause of blank page:** When ALL project pages are prerendered (`prerender: true`), Astro's
build pipeline only registers framework renderers (like `@astrojs/react`) in the server manifest
for pages where it can statically trace React usage through the project file tree. Injected external
routes (`origin: "external"`) are NOT traced this way. Without the React renderer in the server
manifest (`"renderers": []`), the `client:only="react"` hydration directive emits no script tags
— resulting in an empty HTML shell.

**Secondary bug in previous code:** `src/pages/keystatic/[...params].astro` had:
```
import { Keystatic } from '@keystatic/astro/internal/keystatic-page.js';
```
This path is NOT in the `@keystatic/astro` package exports map, causing a Vite build error
("Missing specifier").

**Fix implemented:**

1. `src/components/KeystaticApp.tsx` — thin wrapper using the PUBLIC export:
```tsx
import { makePage } from '@keystatic/astro/ui';
import config from '../../keystatic.config';
const KeystaticApp = makePage(config);
export default KeystaticApp;
```

2. `src/pages/keystatic/[...params].astro` — project-owned page that imports the wrapper:
```astro
---
import KeystaticApp from '../../components/KeystaticApp';
export const prerender = false;
---
<KeystaticApp client:only="react" />
```

3. `src/pages/api/keystatic/[...params].ts` — already existed correctly:
```ts
export { all as GET, all as POST, all as ALL } from '@keystatic/astro/internal/keystatic-api.js';
export const prerender = false;
```

**How to verify fix worked:** Check the compiled server chunk — look for:
`const renderers = [Object.assign({"name":"@astrojs/react",...})]`
If `renderers` array is non-empty, the React renderer is registered and client:only will work.

**Route collision warnings:** Astro warns about duplicate routes (project file + injected external).
This is expected and harmless — project routes take priority. Will become a hard error in a future
Astro version, but is currently just a warning.

**Why:** `@keystatic/astro@5.0.6` declares peer dep `astro: "2||3||4||5"` — it was designed
for Astro 5. Astro 6 changed how server manifest renderers are populated for injected routes.
