# AGENTS.md

Documentation for AI agents and contributors working in this repository.

> **Agents: keep this file current.** Whenever a file is added, updated, or deleted — including blog posts, components, styles, config files, or public assets — update the relevant section of this document before ending the task.

---

---

## Stack

- **Astro 5** — static site generator
- **Tailwind CSS 3** with `@tailwindcss/typography`
- **Astro Expressive Code** — code block rendering
- **MDX** — extended markdown support
- **TypeScript** — strict mode
- **Netlify** — deployment (Node 22, `npm run build`, publish dir `dist`)

---

## Directory Structure

```
src/
  components/       # Reusable Astro components
  content/
    blog/           # Blog posts (.md or .mdx)
      biobank-intro-series/   # Example multi-part series
    pages/          # Static pages (about, terms)
    projects/       # Project showcases
  data/
    site-config.ts  # Site metadata, nav links, hero content
  layouts/
    BaseLayout.astro
  pages/            # Astro file-based routing
  styles/
    global.css      # CSS variables, base layer overrides
  utils/
    data-utils.ts   # Series/tag filtering utilities
public/
  blog_images/      # All blog post images, subdirectory per series
```

---

## Blog Post Frontmatter

Every blog post requires at minimum `title` and `publishDate`. All other fields are optional.

```yaml
---
title: 'Post Title'
excerpt: 'Short description used in previews'
publishDate: 'Mar 13 2026'
updatedDate: 'Apr 1 2026'       # optional
isFeatured: false                # optional, default false
draft: false                     # optional, default false
tags:
  - biobank
  - all-of-us
series:                          # optional, for multi-part series
  name: 'Biobank Intro Series'
  order: 8
  image:                         # optional series cover image
    src: '/blog_images/...'
    alt: '...'
    caption: '...'
seo:                             # optional
  image:
    src: '/blog_images/...'
    alt: '...'
---
```

---

## Series

Multi-part series are subdirectories under `src/content/blog/`. Posts are connected by matching `series.name` in frontmatter and ordered by `series.order`.

- Series pages are auto-generated at `/blog/[series-slug]/`
- Previous/next navigation within a post respects `series.order`
- File naming convention: `01-slug.md`, `02-slug.md`, etc.

---

## Blog Post Formatting

### Figures

```html
<figure class="my-8 !max-w-none">
  <img src="/blog_images/..." alt="..." class="!max-w-none mx-auto w-full" />
  <figcaption class="text-center text-sm opacity-80 mt-2">
    <em>Caption text.</em>
  </figcaption>
</figure>
```

For light/dark mode image variants:

```html
<img src="/blog_images/light.png" class="block dark:hidden" alt="..." />
<img src="/blog_images/dark.png" class="hidden dark:block" alt="..." />
```

### Code Blocks

Fenced code blocks are rendered by Astro Expressive Code. Always specify the language.

```python
# python example
```

```bash
# bash example
```

Font size is set to `1.05rem` in `astro.config.mjs` via `styleOverrides.codeFontSize`.

### Collapsible Code Blocks

Wrap code blocks in `<details open>` to make them collapsible. The `open` attribute means visible by default.

```html
<details open>
<summary>Code</summary>

```bash
your code here
```

</details>
```

Rules:
- Always include a blank line between `<summary>` and the opening code fence
- Always include a blank line before `</details>`
- Use `<summary>Code</summary>` as the label (neutral, works open or closed)

### Tables

Standard markdown table syntax. Column order convention for data path tables: Format | Notes | Path.

```markdown
| Format | Notes | Path |
|--------|-------|------|
| Phased VCFs | By chromosome | `gs://...` |
```

### Task List Checkboxes

Use standard markdown task list syntax. Bullets are hidden via CSS.

```markdown
- [ ] Item one
- [ ] Item two
```

The CSS in `global.css` handles hiding the bullet and sizing the checkbox. Do not use raw HTML `<input type="checkbox">` for this — use `- [ ]`.

### No Em Dashes

Do not use em dashes (`—`). Rewrite as separate sentences or use a comma instead.

---

## Theming

Colors are CSS custom properties defined in `src/styles/global.css` and consumed by Tailwind via `tailwind.config.cjs`.

| Variable | Light | Dark |
|----------|-------|------|
| `--color-text-main` | `#171717` | `#F2F1EC` |
| `--color-bg-main` | `#F2F1EC` | `#171717` |
| `--color-bg-muted` | `#EAE9E1` | `#242424` |
| `--color-accent` | `#2C5282` | `#63B3ED` |

Dark mode is class-based (`html.dark`). Toggle is handled client-side in `BaseLayout.astro`.

---

## Global CSS Rules of Note

Defined in `src/styles/global.css` inside `@layer base`:

- `summary` — sets text color to `--color-text-main` so it's visible in dark mode
- `li:has(> input[type="checkbox"])` — hides bullet, adds hanging indent for task list items
- `li:has(> input[type="checkbox"]) input[type="checkbox"]` — scales checkbox to 1.3x

---

## Images

- Store blog images in `public/blog_images/[series-name]/`
- Reference in markdown as `/blog_images/[series-name]/filename.png`
- Always include descriptive `alt` text

---

## Deployment

Netlify auto-deploys from `main`. Changes must be committed and pushed to appear on the live site. The branch must exist on the remote before Netlify can deploy it.
