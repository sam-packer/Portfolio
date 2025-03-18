import rss from "@astrojs/rss";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {SITE_TITLE, SITE_DESCRIPTION, TIMEZONE} from "../config";
import {getCollection} from "astro:content";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(context) {
    const blog = await getCollection("blog");

    const now = dayjs.utc();

    const filteredPosts = blog
        .filter(post => {
            const postDate = dayjs.tz(post.data.pubDate, TIMEZONE).utc();
            return postDate.isBefore(now, "second") || postDate.isSame(now, "second");
        })
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return rss({
        stylesheet: "/rss/styles.xsl",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: import.meta.env.SITE,
        items: filteredPosts.map((post) => ({
            title: post.data.title,
            pubDate: dayjs.tz(post.data.pubDate, TIMEZONE).utc().toString(),
            description: post.data.description,
            link: `/blog/${post.slug}/`,
        })),
    });
}
