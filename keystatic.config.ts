import { config, collection, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

export default config({
	storage: process.env.NODE_ENV === 'development'
		? { kind: 'local' }
		: {
				kind: 'github',
				repo: 'hannahvcoleman/quilt_app',
		  },
	ui: {
		brand: { name: 'Quillt' },
	},

	collections: {
		posts: collection({
			label: 'Posts',
			slugField: 'title',
			path: 'src/content/posts/*/index',
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
					directory: 'src/content/posts',
					publicPath: './',
				}),
				tags: fields.array(
					fields.text({ label: 'Tag' }),
					{ label: 'Tags' }
				),
				draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
				author: fields.text({ label: 'Author', defaultValue: '' }),
				content: fields.markdoc({
					label: 'Content',
					extension: 'md',
					options: {
						bold: true,
						italic: true,
						strikethrough: true,
						heading: true,
						unorderedList: true,
						orderedList: true,
						blockquote: true,
						divider: true,
						link: true,
						image: {
							directory: 'src/content/posts',
							publicPath: './',
						},
					},
					components: {
						gallery: block({
							label: 'Gallery',
							schema: {
								images: fields.array(
									fields.object({
										src: fields.image({
											label: 'Image',
											directory: 'src/content/posts',
											publicPath: './',
										}),
										alt: fields.text({ label: 'Alt text' }),
										caption: fields.text({ label: 'Caption' }),
									}),
									{ label: 'Images', itemLabel: props => props.fields.caption.value || 'Image' }
								),
								layout: fields.select({
									label: 'Layout',
									options: [
										{ label: 'Auto', value: 'auto' },
										{ label: '2x1', value: '2x1' },
										{ label: '3x1', value: '3x1' },
										{ label: '2x2', value: '2x2' },
										{ label: '3x3', value: '3x3' },
									],
									defaultValue: 'auto',
								}),
							},
						}),
						image70: block({
							label: '70% Width Image',
							schema: {
								src: fields.image({
									label: 'Image',
									directory: 'src/content/posts',
									publicPath: './',
								}),
								alt: fields.text({ label: 'Alt text' }),
								caption: fields.text({ label: 'Caption' }),
							},
						}),
					},
				}),
			},
		}),
	},
});
