import rss from "@astrojs/rss";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {getCollection} from "astro:content";

dayjs.extend(utc);

export async function GET(context) {
    const blog = await getCollection("blog");

    const now = dayjs.utc();

    const filteredPosts = blog
        .filter(post => {
            const postDate = dayjs(post.data.pubDate).utc();
            return postDate.isBefore(now, "second") || postDate.isSame(now, "second");
        })
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return rss({
        stylesheet: "/rss/styles.xsl",
        title: "RSS | Sam Packer",
        description: "Read insightful articles by Sam Packer covering software development, tech trends, project experiences, and practical tips. Stay updated and enhance your skills through engaging, informative content.",
        site: import.meta.env.SITE,
        items: filteredPosts.map((post) => ({
            title: post.data.title,
            pubDate: dayjs(post.data.pubDate).utc().toString(),
            description: post.data.description,
            link: `/blog/${post.id}/`,
        })),
    });
}
