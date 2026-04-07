/**
 * Pure utility functions extracted from Gallery.astro for testability.
 */

/** Lowercase the extension and canonicalise .jpeg → .jpg */
export function normalizeExt(s: string): string {
	const dot = s.lastIndexOf('.');
	if (dot === -1) return s;
	let ext = s.slice(dot).toLowerCase();
	if (ext === '.jpeg') ext = '.jpg';
	if (ext === '.heic') ext = '.jpg'; // HEIC files are converted to JPEG at prebuild
	return s.slice(0, dot) + ext;
}

/** Derive a sensible default grid layout from the number of images. */
export function autoLayout(count: number): string {
	if (count === 2) return '2x1';
	if (count === 3) return '3x1';
	if (count === 4) return '2x2';
	if (count >= 6 && count <= 9) return '3x3';
	return '2x1';
}

/**
 * Derive the Master Ratio from the first resolved image.
 * Falls back to 1 (square) when no resolved image is present.
 */
export function computeMasterRatio(
	resolvedImages: Array<{ resolved: { width: number; height: number } | null }>
): number {
	const first = resolvedImages.find((img) => img.resolved)?.resolved;
	return first ? first.width / first.height : 1;
}
