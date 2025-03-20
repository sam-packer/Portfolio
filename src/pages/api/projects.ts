import type {APIRoute} from "astro";
import {getCollection} from "astro:content";

export const GET: APIRoute = async () => {
    const projects = await getCollection("projects");
    projects.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    const filteredProjects = projects.map((project) => ({
        id: project.id,
        data: project.data,
        body: project.body,
        slug: project.slug,
    }));

    return new Response(JSON.stringify(filteredProjects), {
        headers: {"Content-Type": "application/json"},
    })
};
