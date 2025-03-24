import {z, defineCollection} from "astro:content";

const blog = defineCollection({
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        revDate: z.coerce.date().optional(),
        image: image().optional(),
        badge: z.string().optional(),
        tags: z.array(z.string()).refine(items => new Set(items).size === items.length, {
            message: "tags must be unique",
        }).optional()
    })
});

const popups = defineCollection({
    schema: z.object({
        id: z.string(),
        title: z.string(),
        link: z.string().url(),
        linkText: z.string(),
        eventDate: z.coerce.date().optional(),
        location: z.string().optional(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
    })
});

const projects = defineCollection({
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
        pubDate: z.coerce.date(),
        image: image().optional(),
        badge: z.string().optional(),
        tags: z.array(z.string()).refine(items => new Set(items).size === items.length, {
            message: "tags must be unique",
        }).optional(),
    })
});

export const collections = {blog, popups, projects};
