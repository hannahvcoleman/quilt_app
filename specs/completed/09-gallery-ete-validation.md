## 7. End-to-End (E2E) Validation
- **Tool**: Playwright.
- **Test Case 1 (The "Anti-Raw-Text" Test)**:
    - Navigate to `/posts/gallery-test`.
    - Assert that the text content of the page DOES NOT contain "{% gallery".
    - Assert that the element `.gallery-container` (or your specific class) exists.
- **Test Case 2 (The "Asset Resolution" Test)**:
    - Verify that all `<img>` tags inside the gallery have a `src` that starts with `/_astro/` (proving they aren't 404-ing relative paths).