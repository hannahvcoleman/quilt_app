# Spec: Gallery Component Robustness & Validation

## 1. Problem Statement
The Gallery component currently fails to render (displaying raw Markdoc tags) when "Smart Quotes" are used in the `.mdoc` files. Additionally, the dynamic ratio logic crashes or fails when passed empty objects `[{}]` or missing `src` attributes.

## 2. Objective
Implement automated sanitization for Markdoc syntax and harden the `Gallery.astro` component to handle partial or empty data gracefully.

## 3. Technical Requirements

### A. Syntax Sanitization (The "Quote" Fix)
- **Automated Cleanup**: A script or task to find and replace all "smart/curly" quotes (`“`, `”`, `‘`, `’`) with standard straight quotes (`"`, `'`) across all `.mdoc` files.
- **Validation**: The build should fail or log a high-priority warning if non-standard quotes are detected in the content directory.

### B. Component Hardening (The "Empty" Fix)
- **Null-Safety**: `Gallery.astro` must check for the existence of `images[0].src` before calculating the Master Ratio.
- **Fallback**: If no valid `src` is found in the array:
    - Default the `aspect-ratio` to `1 / 1`.
    - Render a styled `div.gallery-placeholder` for each empty item to maintain the grid layout.
- **Type Safety**: Ensure the `GalleryProps` interface correctly reflects that `src`, `alt`, and `caption` are optional.

### C. Regression Testing
- **Unit Tests**: Implement `src/components/Gallery.test.ts` using Vitest.
- **Test Scenarios**:
    - Renders successfully with a completely empty `images` array.
    - Renders a 1:1 grid when passed `[{}]`.
    - Correctly identifies the ratio when the first image is valid but the second is empty.

## 4. Success Criteria
- [ ] `gallery-test` post renders the grid layout instead of raw text.
- [ ] `npm test` passes with 100% coverage on the Gallery fallback logic.
- [ ] No manual file editing is required to "fix" the quotes after a Keystatic save.