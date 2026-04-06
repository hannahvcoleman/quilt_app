import { test, expect } from '@playwright/test';

test.describe('Gallery post — /posts/gallery-test', () => {
	test('Test 3: 2×1 gallery grid renders with correct layout and item count', async ({ page }) => {
		await page.goto('/posts/gallery-test');

		// The 2×1 gallery must be present — this fails if the tag renders as raw text
		const gallery2x1 = page.locator('.gallery[data-layout="2x1"]');
		await expect(gallery2x1).toBeVisible();

		// Must contain exactly 2 .gallery-item children
		const items = gallery2x1.locator('.gallery-item');
		await expect(items).toHaveCount(2);
	});

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

	test('Test 4: 2×1 and 3×3 galleries share the same fixed height (within 5px)', async ({ page }) => {
		await page.goto('/posts/gallery-test');

		const h2x1 = await page.locator('.gallery[data-layout="2x1"]').evaluate(el => el.getBoundingClientRect().height);
		const h3x3 = await page.locator('.gallery[data-layout="3x3"]').evaluate(el => el.getBoundingClientRect().height);

		expect(Math.abs(h2x1 - h3x3)).toBeLessThanOrEqual(5);
	});

	test('Test 5: every .gallery-item is visible with non-zero dimensions', async ({ page }) => {
		await page.goto('/posts/gallery-test');

		const items = page.locator('.gallery-item');
		const count = await items.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			await expect(items.nth(i)).toBeVisible();
			const box = await items.nth(i).boundingBox();
			expect(box!.width).toBeGreaterThan(0);
			expect(box!.height).toBeGreaterThan(0);
		}
	});

	test('Test 6: gallery images have object-fit: cover in computed styles', async ({ page }) => {
		await page.goto('/posts/gallery-test');

		const imgs = page.locator('.gallery img');
		const count = await imgs.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const objectFit = await imgs.nth(i).evaluate(el => window.getComputedStyle(el).objectFit);
			expect(objectFit).toBe('cover');
		}
	});
});
