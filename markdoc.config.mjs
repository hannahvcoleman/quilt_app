import { component, defineMarkdocConfig } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    gallery: {
      render: component('./src/components/Gallery.astro'),
      attributes: {
        images: { type: Array },
        layout: { type: String },
      },
    },
    image70: {
      render: component('./src/components/Image70.astro'),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        caption: { type: String },
      },
    },
  },
});
