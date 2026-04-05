// Project-owned Keystatic API route handler.
// Mirrors the pattern used in src/pages/keystatic/[...params].astro:
// the @keystatic/astro integration injects /api/keystatic/[...params]
// via injectRoute(), but in Astro 6 with output: 'server' the injected
// route can silently fail (returning 204 No Content) because it isn't
// tracked through the project's own file tree. This file takes precedence
// over the injected route and ensures the handler is correctly compiled.
import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const prerender = false;
export const all = makeHandler({ config });
