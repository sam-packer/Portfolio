import type {APIRoute} from "astro";
import {getCollection} from "astro:content";

export const GET: APIRoute = async ({params}) => {
    const {slug} = params;
    const projects = await getCollection("projects");

    const project = projects.find((project) => project.id === slug);

    if (!project) {
        return new Response(JSON.stringify({error: "Project not found"}), {
            status: 404,
            headers: {"Content-Type": "application/json"},
        });
    }

    const filteredProject = {
        id: project.id,
        data: project.data,
        body: project.body,
    };

    return new Response(JSON.stringify(filteredProject), {
        headers: {"Content-Type": "application/json"},
    });
};
