import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
const HEIC_EXTS = new Set(['.heic']);
const CONTENT_EXTS = new Set(['.mdoc', '.md', '.mdx']);

async function walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const results = [];
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...(await walk(fullPath)));
		} else {
			results.push(fullPath);
		}
	}
	return results;
}

function normalizeName(filename) {
	const ext = path.extname(filename);
	const base = path.basename(filename, ext);
	const normalizedBase = base.replace(/\s+/g, '-');
	// Lowercase extension and canonicalize .jpeg → .jpg
	let normalizedExt = ext.toLowerCase();
	if (normalizedExt === '.jpeg') normalizedExt = '.jpg';
	return normalizedBase + normalizedExt;
}

/**
 * Convert any .heic files to .jpg using Sharp (which bundles libheif).
 * Returns a Map of oldBasename → newBasename for content-reference updates.
 */
async function convertHeicFiles(files) {
	const conversions = new Map();

	let sharp;
	try {
		sharp = (await import('sharp')).default;
	} catch {
		console.warn('normalize-assets: sharp not available — skipping HEIC conversion.');
		return conversions;
	}

	for (const filePath of files) {
		const ext = path.extname(filePath).toLowerCase();
		if (!HEIC_EXTS.has(ext)) continue;

		const dir = path.dirname(filePath);
		const oldName = path.basename(filePath);
		const newName = path.basename(filePath, path.extname(filePath)) + '.jpg';
		const newPath = path.join(dir, newName);

		try {
			await sharp(filePath).jpeg({ quality: 90 }).toFile(newPath);
			await fs.unlink(filePath);
			conversions.set(oldName, newName);
			console.log(`normalize-assets: converted ${oldName} → ${newName} (sharp)`);
		} catch (sharpErr) {
			// Sharp may not support HEVC-encoded HEIC on all platforms.
			// Fall back to macOS sips if available.
			try {
				await execFileAsync('sips', ['-s', 'format', 'jpeg', filePath, '--out', newPath]);
				await fs.unlink(filePath);
				conversions.set(oldName, newName);
				console.log(`normalize-assets: converted ${oldName} → ${newName} (sips fallback)`);
			} catch {
				console.error(`normalize-assets: HEIC conversion failed for ${oldName} (tried sharp and sips). Please convert manually.`);
			}
		}
	}

	return conversions;
}

async function renameImages(files) {
	const renames = new Map(); // oldName → newName (just the basename)

	for (const filePath of files) {
		const ext = path.extname(filePath);
		if (!IMAGE_EXTS.has(ext.toLowerCase())) continue;

		const dir = path.dirname(filePath);
		const oldName = path.basename(filePath);
		const newName = normalizeName(oldName);

		if (oldName === newName) continue;

		const newPath = path.join(dir, newName);
		const tmpPath = path.join(dir, `__tmp_${Date.now()}_${newName}`);

		await fs.rename(filePath, tmpPath);
		await fs.rename(tmpPath, newPath);

		renames.set(oldName, newName);
		console.log(`normalize-assets: renamed ${oldName} → ${newName}`);
	}

	return renames;
}

async function updateContentReferences(files, renames) {
	if (renames.size === 0) return;

	for (const filePath of files) {
		const ext = path.extname(filePath);
		if (!CONTENT_EXTS.has(ext)) continue;

		let content = await fs.readFile(filePath, 'utf-8');
		let changed = false;

		for (const [oldName, newName] of renames) {
			if (content.includes(oldName)) {
				content = content.replaceAll(oldName, newName);
				changed = true;
			}
		}

		if (changed) {
			await fs.writeFile(filePath, content, 'utf-8');
			console.log(`normalize-assets: updated references in ${path.relative(path.join(__dirname, '..'), filePath)}`);
		}
	}
}

/**
 * Keystatic GitHub storage mode writes coverImage paths relative to the posts root
 * (e.g. `./slug/coverImage.jpg`) instead of relative to the entry mdoc file
 * (e.g. `./coverImage.jpg`). This function detects and fixes those paths so
 * Astro's image() schema can resolve them at build time.
 */
async function fixKeystatiCoverImagePaths(files) {
	for (const filePath of files) {
		const ext = path.extname(filePath);
		if (!CONTENT_EXTS.has(ext)) continue;

		const postDir = path.dirname(filePath);
		const slug = path.basename(postDir); // e.g. "creating-a-new-gallery-post"

		let content = await fs.readFile(filePath, 'utf-8');

		// Match: coverImage: ./slug/filename.ext  (with or without quotes)
		const wrongPathPattern = new RegExp(
			`(coverImage:\\s*['"]?)\\.\\.?\/${slug}\\/([^'"\\s]+)(['"]?)`,
			'g'
		);

		const fixed = content.replace(wrongPathPattern, (_, prefix, filename, suffix) => {
			return `${prefix}./${filename}${suffix}`;
		});

		if (fixed !== content) {
			await fs.writeFile(filePath, fixed, 'utf-8');
			console.log(`normalize-assets: fixed coverImage path in ${path.relative(path.join(__dirname, '..'), filePath)}`);
		}
	}
}

async function runOnce() {
	let files;
	try {
		files = await walk(POSTS_DIR);
	} catch {
		// posts dir doesn't exist yet — nothing to do
		return;
	}

	const conversions = await convertHeicFiles(files);
	// Re-walk after conversions so renameImages sees the new .jpg files
	const filesAfterConversion = conversions.size > 0 ? await walk(POSTS_DIR) : files;
	const renames = await renameImages(filesAfterConversion);

	// Merge both maps for content-reference updates
	const allChanges = new Map([...conversions, ...renames]);
	await updateContentReferences(filesAfterConversion, allChanges);

	// Fix Keystatic GitHub-mode coverImage paths (must run after renames)
	await fixKeystatiCoverImagePaths(filesAfterConversion);

	if (allChanges.size === 0) {
		console.log('normalize-assets: all image filenames are already normalized.');
	}
}

async function watchMode() {
	// Full scan first, then watch for new additions
	await runOnce();

	const { default: chokidar } = await import('chokidar');

	console.log('normalize-assets: watching for new images in', POSTS_DIR);

	const watcher = chokidar.watch(POSTS_DIR, {
		ignoreInitial: true,      // already scanned above
		persistent: true,
		awaitWriteFinish: { stabilityThreshold: 300, pollInterval: 100 },
	});

	watcher.on('add', async (filePath) => {
		const ext = path.extname(filePath).toLowerCase();
		if (!IMAGE_EXTS.has(ext)) return;

		const dir = path.dirname(filePath);
		const oldName = path.basename(filePath);
		const newName = normalizeName(oldName);

		if (oldName === newName) return;

		const newPath = path.join(dir, newName);
		const tmpPath = path.join(dir, `__tmp_${Date.now()}_${newName}`);

		try {
			await fs.rename(filePath, tmpPath);
			await fs.rename(tmpPath, newPath);
			console.log(`normalize-assets: renamed ${oldName} → ${newName}`);

			// Update any content files that already reference the old name
			let allFiles;
			try { allFiles = await walk(POSTS_DIR); } catch { return; }
			await updateContentReferences(allFiles, new Map([[oldName, newName]]));
		} catch (err) {
			console.error('normalize-assets: rename failed:', err.message);
		}
	});

	watcher.on('error', (err) => console.error('normalize-assets watcher error:', err));
}

const isWatch = process.argv.includes('--watch');

if (isWatch) {
	watchMode().catch((err) => {
		console.error('normalize-assets error:', err);
	});
} else {
	runOnce().catch((err) => {
		console.error('normalize-assets error:', err);
		// Do not exit with non-zero — never block dev/build
	});
}
