# Spec: Sync CMS with GitHub

## Context
Posts are visible locally but not on the Vercel deployment. We need to transition Keystatic from `local` storage to `github` storage for production.

## Requirements
1. **Config Update**: Modify `keystatic.config.ts` to use `storage: { kind: 'github', repo: 'hannahvcoleman/quilt_app' }` when not in development mode.
2. **Environment Variables**: Identify the required `KEYSTATIC_GITHUB_CLIENT_ID` and `KEYSTATIC_GITHUB_CLIENT_SECRET`.
3. **Vercel Setup**: Add these secrets to the Vercel project dashboard.
4. **Build Verification**: Ensure the site builds on Vercel without "File not found" errors.

## Verification
- Log into `quillt.vercel.app/keystatic` (or your live URL).
- Confirm existing posts are visible in the dashboard.
- Create a "Test Post" on the live site and verify it creates a commit in your GitHub repo.