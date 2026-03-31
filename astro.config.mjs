// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Update site to your GitHub Pages URL: https://<username>.github.io
// Update base to your repo name if it's not a root user site: '/<repo-name>'
export default defineConfig({
	output: 'static',
	site: 'https://hannahvcoleman.github.io',
	base: '/quilt_app',
	integrations: [mdx(), sitemap()],
});
