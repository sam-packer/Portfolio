import type {APIRoute} from "astro";
import {getCollection} from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const GET: APIRoute = async () => {
    const currentDate = dayjs().utc();

    const posts = (await getCollection("blog"))
        .filter(post => {
            const postDate = dayjs(post.data.pubDate).utc();
            return postDate.isBefore(currentDate, "second") || postDate.isSame(currentDate, "second");
        })
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    const filteredPosts = posts.map((post) => ({
        id: post.id,
        data: post.data,
        body: post.body,
        slug: post.slug,
    }));

    return new Response(JSON.stringify(filteredPosts), {
        headers: {"Content-Type": "application/json"},
    })
};
