# Spec: Environment & Dev Server Recovery

## Context
The project is currently blocked because the local Node.js version (v20.12.2) is unsupported by Astro 6. We need to upgrade and verify that `npm run dev` and `keystatic` are accessible.

## Requirements
1. **Node Upgrade**: Ensure the active shell is using Node.js >= 22.12.0 (preferably the latest LTS).
2. **Clean Dependencies**:
   - Delete `node_modules` and `package-lock.json`.
   - Run `npm install` to ensure all native modules are rebuilt for the new Node version.
3. **Ghost Processes**: Check if a previous instance of the dev server is "hanging" on port 4321 and kill it if necessary.
4. **Execution**: Run `npm run dev`.

## Verification
- Access the homepage at `http://localhost:4321`.
- Access the Keystatic admin at `http://localhost:4321/keystatic`.
- Confirm the terminal shows no "Unsupported Engine" warnings.