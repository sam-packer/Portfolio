<script>
    import dayjs from "dayjs";
    import timezone from "dayjs/plugin/timezone";
    import utc from "dayjs/plugin/utc";
    import localizedFormat from "dayjs/plugin/localizedFormat";

    export let post;

    dayjs.extend(utc);
    dayjs.extend(localizedFormat);
    dayjs.extend(timezone);

    const displayDate = post.data.pubDate ?
        dayjs.tz(post.data.pubDate, dayjs.tz.guess()).format("LL")
        : null;
    const updatedDate = post.data.revDate
        ? dayjs.tz(post.data.revDate, dayjs.tz.guess()).format("LL")
        : null;
</script>

{#if displayDate && updatedDate}
    <time>{displayDate} (last updated on {updatedDate})</time>
{:else}
    <time>{displayDate}</time>
{/if}