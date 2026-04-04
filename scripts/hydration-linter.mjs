import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

async function getAstroFiles(dir) {
  let files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await getAstroFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.astro')) {
      files.push(fullPath);
    } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function lintIslands() {
  console.log('🔍 Linting Astro Islands & Components...\n');
  const files = await getAstroFiles(SRC_DIR);
  let warnings = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const relativePath = path.relative(ROOT_DIR, file);

    // Check 1: React components imported in Astro files should explicitly define a client:* directive if they have interactivity.
    // Extremely simplistic regex checking for react components rendered without client:* directives.
    const reactComponentMatch = content.match(/<([A-Z]\w+)[^>]*(?<!client:\w+)[^>]*\/>/g);
    
    // Check 2: Vanilla <script> tags lacking 'is:inline' or similar if they manipulate DOM directly often
    const inlineScriptMatch = content.match(/<script(?!.*\bis:inline\b)(?!.*\bdefine:vars\b)[^>]*>/g);

    if (relativePath.includes('KeystaticApp.tsx')) {
      // KeystaticApp is a pure React island logic block managed by Keystatic, ignore.
      continue;
    }

    let fileHasWarnings = false;

    if (inlineScriptMatch && content.includes('document.getElementById')) {
        console.warn(`[WARNING] ${relativePath}: Found vanilla <script> manipulating DOM. Consider if this logic can be deferred or componentized.`);
        fileHasWarnings = true;
        warnings++;
    }

    if (file.endsWith('.astro')) {
        // Find React imports
        if (content.includes("from 'react'") || content.includes("from '@keystatic/")) {
             // Check if used without hydration
             const unhydrated = content.match(/<([A-Z]\w+)[^>]*>/g)?.filter(tag => !tag.includes('client:'));
             if (unhydrated && unhydrated.length > 0) {
                 console.warn(`[INFO] ${relativePath}: Found uppercase component (${unhydrated[0]}). Ensure it doesn't require a 'client:' hydration directive if it's an interactive React component.`);
                 fileHasWarnings = true;
                 warnings++;
             }
        }
    }
  }

  if (warnings === 0) {
    console.log('✅ All Astro Islands and scripts look well-configured.');
  } else {
    console.log(`\n⚠️ Found ${warnings} potential hydration/script issues.`);
  }
}

lintIslands().catch(console.error);
