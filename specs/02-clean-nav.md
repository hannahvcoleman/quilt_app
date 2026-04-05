# Spec: Streamline Navigation

## Context
The current header contains menu buttons that do not serve a purpose as the site is moving toward a single-page editorial flow.

## Requirements
1. **Modify `src/components/Header.astro`**:
   - Locate the navigation links/buttons.
   - Remove the menu items (e.g., specific category links or placeholder buttons).
   - Retain the "Quillt" masthead/logo.
2. **Visual Consistency**: Ensure the header layout remains centered or properly aligned according to the `DESIGN_BRIEF.md` (bold, confident, editorial feel).

## Verification
- Run `npm run dev` and confirm only the "Quillt" masthead is visible in the header.
- Check responsive view to ensure no "ghost" hamburger menu remains.