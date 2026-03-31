// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';

// Rewrites /images/... paths in markdown to include the base prefix
function remarkBaseImages(base) {
	const prefix = base.replace(/\/$/, '');
	return () => (tree) => {
		visit(tree, 'image', (node) => {
			if (node.url.startsWith('/') && !node.url.startsWith(prefix)) {
				node.url = prefix + node.url;
			}
		});
	};
}

// Update site to your GitHub Pages URL: https://<username>.github.io
// Update base to your repo name if it's not a root user site: '/<repo-name>'
export default defineConfig({
	output: 'static',
	site: 'https://hannahvcoleman.github.io',
	base: '/quilt_app',
	markdown: {
		remarkPlugins: [remarkBaseImages('/quilt_app')],
	},
	integrations: [mdx(), sitemap()],
});
