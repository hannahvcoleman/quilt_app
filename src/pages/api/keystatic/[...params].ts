// Required for Keystatic CMS API routes in Astro 6.
// Re-exports the Keystatic API handler so Astro's router handles
// /api/keystatic/[...params] with the correct server-side function.
export { all as GET, all as POST, all as ALL } from '@keystatic/astro/internal/keystatic-api.js';
export const prerender = false;
