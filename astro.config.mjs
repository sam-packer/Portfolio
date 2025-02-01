import {defineConfig, passthroughImageService} from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from "@astrojs/partytown";
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from "@tailwindcss/vite";


// https://astro.build/config
export default defineConfig({
    site: 'https://sampacker.com',
    integrations: [mdx(), partytown({
        config: {
            "forward": ["dataLayer.push"]
        }
    }), sitemap(), svelte()],
    vite: {
        plugins: [tailwindcss()],
    },
    image: {
        service: passthroughImageService()
    }
    /*redirects: {
        "/linkedin": "https://www.linkedin.com/in/samuel-packer",
        "/github": "https://github.com/sam-packer",
    }*/
});