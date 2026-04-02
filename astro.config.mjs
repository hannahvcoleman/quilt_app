// @ts-check
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
	output: 'server',
	site: 'https://quillt-delta.vercel.app',
	integrations: [mdx(), sitemap(), react(), keystatic()],
	adapter: vercel(),
});
