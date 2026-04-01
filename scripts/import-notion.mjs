#!/usr/bin/env node
/**
 * Notion → post import script
 *
 * Usage:
 *   npm run import -- path/to/notion-export-folder
 *
 * In Notion: ··· → Export → Markdown & CSV → Download
 * Unzip the download, then point this script at the folder.
 *
 * The script will:
 *   1. Find the .md file in the folder
 *   2. Extract title, description, and date from the content
 *   3. Copy and rename images to public/images/<slug>/
 *   4. Group consecutive images into <Gallery> components
 *   5. Write a ready-to-publish .mdx to src/content/posts/<slug>.mdx
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from 'fs';
import { join, extname, basename, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── helpers ────────────────────────────────────────────────────────────────

function slugify(str) {
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/-+/g, '-');
}

function autoLayout(count) {
	if (count === 2) return '2x1';
	if (count === 3) return '3x1';
	if (count === 4) return '2x2';
	if (count >= 6) return '3x3';
	return '2x1';
}

function today() {
	return new Date().toISOString().split('T')[0];
}

// ─── parse args ──────────────────────────────────────────────────────────────

const inputPath = process.argv[2];
if (!inputPath) {
	console.error('Usage: npm run import -- <path-to-notion-export-folder>');
	process.exit(1);
}

const folderPath = resolve(inputPath);
if (!existsSync(folderPath)) {
	console.error(`Folder not found: ${folderPath}`);
	process.exit(1);
}

// ─── find the .md file ───────────────────────────────────────────────────────

const files = readdirSync(folderPath);
const mdFile = files.find(f => f.endsWith('.md'));
if (!mdFile) {
	console.error('No .md file found in the export folder. Make sure you exported as Markdown & CSV.');
	process.exit(1);
}

const mdPath = join(folderPath, mdFile);
let content = readFileSync(mdPath, 'utf8');

// ─── extract metadata ────────────────────────────────────────────────────────

// Title: first # heading
const titleMatch = content.match(/^#\s+(.+)$/m);
const title = titleMatch ? titleMatch[1].trim() : basename(mdFile, '.md');
const slug = slugify(title);

// Remove the title line from content (we'll put it in frontmatter)
if (titleMatch) {
	content = content.replace(titleMatch[0], '').trimStart();
}

// Description: first non-empty paragraph of plain text (no images, no headings)
const descMatch = content.match(/^(?!#|!\[|<|-)([^\n]+(?:\n(?!\n)[^\n]+)*)/m);
const description = descMatch
	? descMatch[0].replace(/\s+/g, ' ').trim().slice(0, 160)
	: `${title}.`;

// ─── process images ──────────────────────────────────────────────────────────

const imageDir = join(ROOT, 'public', 'images', slug);
mkdirSync(imageDir, { recursive: true });

// Find all image references: ![alt](path)
const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
let imageIndex = 0;
const imageMap = {}; // original path → new public path

content = content.replace(imageRegex, (match, alt, rawPath) => {
	// Decode URL encoding from Notion (e.g. "My%20Post/image.png")
	const decodedPath = decodeURIComponent(rawPath);

	// Skip external URLs
	if (decodedPath.startsWith('http')) {
		return match;
	}

	const originalPath = resolve(folderPath, decodedPath);
	if (!existsSync(originalPath)) {
		console.warn(`  ⚠ Image not found, skipping: ${decodedPath}`);
		return match;
	}

	imageIndex++;
	const ext = extname(originalPath) || '.jpg';
	const newFilename = `img-${String(imageIndex).padStart(2, '0')}${ext}`;
	const newPublicPath = `/images/${slug}/${newFilename}`;

	copyFileSync(originalPath, join(imageDir, newFilename));
	imageMap[rawPath] = newPublicPath;

	return `![${alt}](${newPublicPath})`;
});

// ─── group consecutive images into Gallery components ────────────────────────

const IMG_LINE = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/;

const lines = content.split('\n');
const output = [];
let galleryBuffer = [];

function flushGallery() {
	if (galleryBuffer.length === 0) return;

	if (galleryBuffer.length === 1) {
		// Single image — keep as markdown
		output.push(galleryBuffer[0]);
	} else {
		// Multiple images — emit Gallery component
		const layout = autoLayout(galleryBuffer.length);
		const imagesJson = galleryBuffer
			.map(line => {
				const m = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
				const alt = m ? m[1] : '';
				const src = m ? m[2] : '';
				return alt
					? `  { src: "${src}", alt: "${alt}" }`
					: `  { src: "${src}" }`;
			})
			.join(',\n');
		output.push(
			`<Gallery layout="${layout}" images={[\n${imagesJson}\n]} />`
		);
	}
	galleryBuffer = [];
}

for (const line of lines) {
	if (IMG_LINE.test(line)) {
		galleryBuffer.push(line);
	} else if (line.trim() === '' && galleryBuffer.length > 0) {
		// Allow a single blank line between images in a group
		// We peek ahead — for now just hold it
		galleryBuffer.push('__BLANK__');
	} else {
		// Flush any trailing blanks from the gallery buffer
		while (galleryBuffer.length && galleryBuffer[galleryBuffer.length - 1] === '__BLANK__') {
			galleryBuffer.pop();
		}
		flushGallery();
		output.push(line);
	}
}
// Flush any remaining gallery
while (galleryBuffer.length && galleryBuffer[galleryBuffer.length - 1] === '__BLANK__') {
	galleryBuffer.pop();
}
flushGallery();

let processedContent = output.join('\n');

// ─── determine cover image ────────────────────────────────────────────────────

const coverMatch = processedContent.match(/!\[[^\]]*\]\(([^)]+)\)/);
const coverImage = coverMatch ? coverMatch[1] : undefined;

// ─── build frontmatter ────────────────────────────────────────────────────────

const frontmatter = [
	'---',
	`title: '${title.replace(/'/g, "\\'")}'`,
	`description: '${description.replace(/'/g, "\\'")}'`,
	`pubDate: '${today()}'`,
	coverImage ? `coverImage: '${coverImage}'` : null,
	`draft: false`,
	'---',
	'',
	`import Gallery from '../../components/Gallery.astro';`,
	'',
].filter(l => l !== null).join('\n');

// ─── write output ─────────────────────────────────────────────────────────────

const outputPath = join(ROOT, 'src', 'content', 'posts', `${slug}.mdx`);
writeFileSync(outputPath, frontmatter + '\n' + processedContent.trimStart());

// ─── summary ──────────────────────────────────────────────────────────────────

console.log(`
✓ Imported: "${title}"
  slug:    ${slug}
  post:    src/content/posts/${slug}.mdx
  images:  public/images/${slug}/ (${imageIndex} file${imageIndex === 1 ? '' : 's'})

Next steps:
  1. Review the post:  open src/content/posts/${slug}.mdx
  2. Check images:     open public/images/${slug}/
  3. Preview locally:  npm run dev  →  http://localhost:4321/posts/${slug}
  4. Publish:          git add . && git commit -m "Add: ${title}" && git push
`);
