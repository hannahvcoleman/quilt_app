import { config, collection, fields } from '@keystatic/core';

export default config({
	storage: {
		kind: 'github',
		repo: 'hannahvcoleman/quilt_app',
	},

	collections: {
		posts: collection({
			label: 'Posts',
			slugField: 'title',
			path: 'src/content/posts/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				description: fields.text({
					label: 'Description',
					multiline: true,
					validation: { isRequired: true },
				}),
				pubDate: fields.date({
					label: 'Published date',
					validation: { isRequired: true },
					defaultValue: { kind: 'today' },
				}),
				coverImage: fields.image({
					label: 'Cover image',
					directory: 'public/images',
					publicPath: '/images/',
				}),
				tags: fields.array(
					fields.text({ label: 'Tag' }),
					{ label: 'Tags' }
				),
				draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
				content: fields.document({
					label: 'Content',
					formatting: true,
					dividers: true,
					links: true,
					images: {
						directory: 'public/images',
						publicPath: '/images/',
					},
				}),
			},
		}),
	},
});
