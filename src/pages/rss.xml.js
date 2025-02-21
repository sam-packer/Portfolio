import rss from "@astrojs/rss";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {SITE_TITLE, SITE_DESCRIPTION} from "../config";
import {getCollection} from "astro:content";

dayjs.extend(utc);

export async function GET(context) {
    const blog = await getCollection("blog");

    const now = dayjs.utc();

    // Hide posts that haven't been published yet
    const filteredPosts = blog
        .filter(post => {
            const postDate = dayjs(post.data.pubDate).utc(); // Convert post date to UTC
            return postDate.isBefore(now, "second") || postDate.isSame(now, "second");
        })
        .sort((a, b) => dayjs(b.data.pubDate).utc().valueOf() - dayjs(a.data.pubDate).utc().valueOf());

    return rss({
        stylesheet: "/rss/styles.xsl",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: import.meta.env.SITE,
        items: filteredPosts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.slug}/`,
        })),
    });
}
