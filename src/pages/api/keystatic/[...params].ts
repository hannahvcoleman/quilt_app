// Project-owned Keystatic API route handler.
// The @keystatic/astro integration injects /api/keystatic/[...params] via
// injectRoute(), but in Astro 6 with output: 'server' the injected route
// silently fails (returning 204 No Content / 401) because it isn't tracked
// through the project's own file tree. This file takes precedence and ensures
// the handler is correctly compiled and registered.
import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const prerender = false;
export const ALL = makeHandler({ config });
