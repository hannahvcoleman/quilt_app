import { describe, it, expect } from 'vitest';
import { normalizeExt, autoLayout, computeMasterRatio } from '../utils/gallery-utils';

// Minimal ImageMetadata shape sufficient for ratio tests
function img(width: number, height: number) {
	return { width, height, src: 'test.jpg', format: 'jpg' as const };
}

describe('normalizeExt', () => {
	it('lowercases extensions', () => {
		expect(normalizeExt('photo.JPG')).toBe('photo.jpg');
		expect(normalizeExt('photo.PNG')).toBe('photo.png');
	});

	it('canonicalises .jpeg → .jpg', () => {
		expect(normalizeExt('photo.jpeg')).toBe('photo.jpg');
		expect(normalizeExt('photo.JPEG')).toBe('photo.jpg');
	});

	it('leaves already-normalised names unchanged', () => {
		expect(normalizeExt('photo.jpg')).toBe('photo.jpg');
	});

	it('handles strings with no extension', () => {
		expect(normalizeExt('noext')).toBe('noext');
	});
});

describe('autoLayout', () => {
	it('returns 2x1 for 2 images', () => expect(autoLayout(2)).toBe('2x1'));
	it('returns 3x1 for 3 images', () => expect(autoLayout(3)).toBe('3x1'));
	it('returns 2x2 for 4 images', () => expect(autoLayout(4)).toBe('2x2'));
	it('returns 3x3 for 6–9 images', () => {
		expect(autoLayout(6)).toBe('3x3');
		expect(autoLayout(9)).toBe('3x3');
	});
	it('falls back to 2x1 for other counts', () => {
		expect(autoLayout(0)).toBe('2x1');
		expect(autoLayout(1)).toBe('2x1');
		expect(autoLayout(5)).toBe('2x1');
	});
});

describe('computeMasterRatio', () => {
	it('returns 1 for an empty images array', () => {
		expect(computeMasterRatio([])).toBe(1);
	});

	it('returns 1 when passed [{}] (no resolved image)', () => {
		expect(computeMasterRatio([{ resolved: null }])).toBe(1);
	});

	it('returns 1 when all items have no resolved image', () => {
		expect(computeMasterRatio([{ resolved: null }, { resolved: null }])).toBe(1);
	});

	it('uses the first resolved image to compute ratio', () => {
		const images = [{ resolved: img(800, 600) }];
		expect(computeMasterRatio(images)).toBeCloseTo(800 / 600);
	});

	it('uses the first valid image even when the second is empty', () => {
		const images = [{ resolved: img(400, 500) }, { resolved: null }];
		expect(computeMasterRatio(images)).toBeCloseTo(400 / 500);
	});

	it('skips leading null and uses first non-null resolved image', () => {
		const images = [{ resolved: null }, { resolved: img(1920, 1080) }];
		expect(computeMasterRatio(images)).toBeCloseTo(1920 / 1080);
	});
});
