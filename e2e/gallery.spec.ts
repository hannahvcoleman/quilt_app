import { test, expect } from '@playwright/test';

test.describe('Gallery post — /posts/gallery-test', () => {
	test('Test 1: no raw Markdoc text and .gallery element exists', async ({ page }) => {
		await page.goto('/posts/gallery-test');

		// No raw Markdoc tags should appear in the page body
		const bodyText = await page.locator('body').innerText();
		expect(bodyText).not.toContain('{% gallery');

		// At least one .gallery figure should be rendered
		await expect(page.locator('.gallery').first()).toBeVisible();
	});

	test('Test 2: all gallery <img> srcs are Astro-processed (not raw relative paths)', async ({ page }) => {
		await page.goto('/posts/gallery-test');

		const imgs = page.locator('.gallery img');
		const count = await imgs.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const src = await imgs.nth(i).getAttribute('src');
			// Dev: /_image?href=... — Prod: /_astro/...
			// Both confirm Astro processed the image; neither is a raw relative path.
			expect(src).toMatch(/^\/_astro\/|^\/_image\?/);
		}
	});
});
