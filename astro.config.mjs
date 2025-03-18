import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: 'https://www.sampacker.com',
    integrations: [mdx(), sitemap(), svelte()],
    vite: {
        plugins: [tailwindcss()],
    },
    redirects: {
        "/linkedin": "https://www.linkedin.com/in/samuel-packer",
        "/github": "https://github.com/sam-packer",
    },
    prefetch: {
        prefetchAll: true
    },
    output: 'server',
    adapter: cloudflare({
        imageService: 'cloudflare'
    })
});