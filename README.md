# Portfolio

This is my personal portfolio site, built using [Astro](https://astro.build) with Svelte and Tailwind CSS. It serves as a central place to highlight my professional background, projects, blog posts, and technical writing.

## Live Site

Visit: [https://www.sampacker.com](https://www.sampacker.com)

## Tech Stack

- **Astro** – Modern static site generator focused on performance
- **Svelte** – Lightweight JavaScript framework for interactive components
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development
- **DaisyUI** – Premade components using Tailwind CSS under the hood
- **MDX** – Markdown with JSX/MDX support for writing rich content
- **Plausible Analytics** – Privacy-first analytics integration
- **RSS/XML** – Syndicated blog feed with custom styling

## Project Structure Overview

```

├── public/              # Static files (images, JSON, RSS)
├── src/
│   ├── assets/          # Images and icons for blog and project content
│   ├── components/      # Reusable UI components (Astro + Svelte)
│   ├── content/         # Markdown/MDX-based blog posts and project writeups
│   ├── layouts/         # Layout wrappers for pages and posts
│   ├── pages/           # Astro page routes
│   └── styles/          # Global CSS styling
├── astro.config.mjs     # Astro site config
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project metadata and scripts

````

## Notable Astro Components

- **`BlogCard.astro`** – Renders a summary view of a blog post with title, tags, and preview text.
- **`ProjectCard.astro`** – Displays a project's title, description, and image for easy browsing.
- **`Header.astro` / `Footer.astro`** – Site-wide navigation and footer with consistent layout.
- **`ExperienceCard.astro`** – Used on the experience page to show roles, companies, and timelines.
- **`FloatingBackToTop.astro`** – Adds a persistent back-to-top button on long pages.

These components are designed to be modular and reusable across multiple pages, following Astro’s server-first rendering model and Svelte's interactivity.

## Features

- Responsive design using Tailwind and DaisyUI
- Content-driven with Astro Content Collections and MDX
- Dynamic blog and project pages with slugs and pagination
- Lightweight client-side interactions using Svelte
- Pre-configured RSS feed and sitemap for SEO
- Redirects for `/github` and `/linkedin` paths

## Setup Instructions

Install dependencies and run the local development server:

```bash
pnpm install
pnpm run dev
````

Build for production:

```bash
pnpm build
```

## License

MIT © [Samuel Packer](https://github.com/sam-packer)