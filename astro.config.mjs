import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import expressiveCode from "astro-expressive-code";
import remarkMermaid from 'remark-mermaidjs'
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
    site: 'https://sklasfeld.github.io',
    markdown: {
        // Applied to .md and .mdx files
        remarkPlugins: [remarkMermaid],
      },
    integrations: [expressiveCode(), mdx(), sitemap(), tailwind({
        applyBaseStyles: false
    })]
});