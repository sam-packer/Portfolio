import type {APIRoute} from "astro";
import {getCollection} from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const prerender = true;

export const GET: APIRoute = async () => {
    const now = dayjs().utc();
    const alerts = (await getCollection("alerts")).filter(alert => {
        const startDate = dayjs(alert.data.startDate).utc();
        const endDate = dayjs(alert.data.endDate).utc();
        return startDate.isBefore(now, "second") && endDate.isAfter(now, "second");
    });

    const filteredData = alerts.map((alert) => ({
        data: alert.data,
        rendered: alert.rendered?.html ?? "",
    }));

    return new Response(JSON.stringify(filteredData), {
        headers: {"Content-Type": "application/json"},
    })
};
