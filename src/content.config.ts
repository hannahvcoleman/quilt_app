import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx,mdoc}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		coverImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional().default(false),
		author: z.string().optional(),
	}),
});

export const collections = { posts };
