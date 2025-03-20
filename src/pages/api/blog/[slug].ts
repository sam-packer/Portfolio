import type {APIRoute} from "astro";
import {getCollection} from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const GET: APIRoute = async ({params}) => {
    const currentDate = dayjs().utc();

    const {slug} = params;

    const posts = (await getCollection("blog")).filter(post => {
        const postDate = dayjs(post.data.pubDate).utc();
        return postDate.isBefore(currentDate, "second") || postDate.isSame(currentDate, "second");
    });

    const post = posts.find((post) => post.slug === slug);

    if (!post) {
        return new Response(JSON.stringify({error: "Post not found"}), {
            status: 404,
            headers: {"Content-Type": "application/json"},
        });
    }

    const postDate = dayjs(post.data.pubDate).utc();

    const filteredPost = {
        id: post.id,
        data: post.data,
        body: post.body,
        slug: post.slug,
    };

    return new Response(JSON.stringify(filteredPost), {
        headers: {"Content-Type": "application/json"},
    });
};
