# Spec: Fix Live Collection Visibility

## Context
Keystatic shows posts locally but shows "Empty Collection" on Vercel. We need to ensure the GitHub storage config matches the actual repository structure.

## Requirements
1. **Verify Storage Config**: Ensure `keystatic.config.ts` has the correct `repository` string (hannahvcoleman/quilt_app).
2. **Path Alignment**: Check if the `path` in the collection matches the actual file structure in GitHub (e.g., `src/content/posts/*` vs `src/content/posts/*/`).
3. **App Directory (Vercel)**: Confirm that the `KEYSTATIC_GITHUB_CLIENT_ID` and `SECRET` are active in Vercel environment variables.
4. **Public Path**: Ensure images are mapped to the correct GitHub URL structure so they don't break on the live site.

## Verification
- Refresh the Vercel admin panel.
- Confirm the list of posts matches the `main` branch on GitHub.