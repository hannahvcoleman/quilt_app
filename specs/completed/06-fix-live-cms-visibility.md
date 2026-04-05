# Spec: Fix Live CMS Visibility

## Context
Posts are visible in local development and exist in the GitHub `main` branch under `src/content/posts/*/index.md`. However, the Vercel deployment at `quillt-delta.vercel.app/keystatic` shows an "Empty Collection."

## Requirements
1. **Verify Environment Variables**: Confirm the following are set in the Vercel Dashboard:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
2. **Validate Storage Configuration**: Ensure `keystatic.config.ts` uses the `github` strategy for production and points to the correct repository: `hannahvcoleman/quilt_app`.
3. **Check Branch Mapping**: Verify that Keystatic is explicitly told to read from the `main` branch.
4. **Path Sync**: Double-check that the `path` logic (`src/content/posts/*/index`) matches the exact casing and structure found in the GitHub repo.

## Verification
- Log in to the live Keystatic admin via GitHub.
- Confirm all 5 posts (First Light, Hello World, etc.) appear in the list.
- Edit a post and confirm it triggers a "CMS" commit on GitHub.