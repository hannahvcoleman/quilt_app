/**
 * sanitize-quotes.mjs
 *
 * Replaces smart/curly quotes with standard straight quotes in all .mdoc files
 * under src/content/posts/.
 *
 * Run:  node scripts/sanitize-quotes.mjs
 * Validate only (no writes):  node scripts/sanitize-quotes.mjs --check
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

// Map of smart quote → straight quote replacements
const REPLACEMENTS = [
	['\u201C', '"'], // " LEFT DOUBLE QUOTATION MARK
	['\u201D', '"'], // " RIGHT DOUBLE QUOTATION MARK
	['\u2018', "'"], // ' LEFT SINGLE QUOTATION MARK
	['\u2019', "'"], // ' RIGHT SINGLE QUOTATION MARK
];

async function walk(dir) {
	let results = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) results.push(...(await walk(full)));
		else if (entry.name.endsWith('.mdoc')) results.push(full);
	}
	return results;
}

async function sanitize(checkOnly = false) {
	let files;
	try {
		files = await walk(POSTS_DIR);
	} catch {
		// posts dir doesn't exist yet — nothing to do
		return;
	}

	let violations = 0;

	for (const filePath of files) {
		const original = await fs.readFile(filePath, 'utf-8');
		let sanitized = original;

		for (const [smart] of REPLACEMENTS) {
			if (sanitized.includes(smart)) violations++;
			sanitized = sanitized.replaceAll(smart, REPLACEMENTS.find(([s]) => s === smart)[1]);
		}

		if (sanitized !== original) {
			const rel = path.relative(path.join(__dirname, '..'), filePath);
			if (checkOnly) {
				console.warn(`[sanitize-quotes] WARN: smart quotes detected in ${rel}`);
			} else {
				await fs.writeFile(filePath, sanitized, 'utf-8');
				console.log(`[sanitize-quotes] fixed: ${rel}`);
			}
		}
	}

	if (violations === 0) {
		console.log('[sanitize-quotes] all .mdoc files are clean.');
	} else if (checkOnly) {
		console.warn(`[sanitize-quotes] ${violations} smart quote(s) found — run without --check to fix.`);
		process.exitCode = 1;
	}
}

const isCheck = process.argv.includes('--check');
sanitize(isCheck).catch((err) => {
	console.error('[sanitize-quotes] error:', err);
});
