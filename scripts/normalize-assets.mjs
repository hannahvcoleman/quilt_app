import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);
const CONTENT_EXTS = new Set(['.md', '.mdoc', '.mdx']);

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
	const normalizedExt = ext.toLowerCase();
	return normalizedBase + normalizedExt;
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

async function main() {
	let files;
	try {
		files = await walk(POSTS_DIR);
	} catch {
		// posts dir doesn't exist yet — nothing to do
		return;
	}

	const renames = await renameImages(files);
	await updateContentReferences(files, renames);

	if (renames.size === 0) {
		console.log('normalize-assets: all image filenames are already normalized.');
	}
}

main().catch((err) => {
	console.error('normalize-assets error:', err);
	// Do not exit with non-zero — never block dev/build
});
