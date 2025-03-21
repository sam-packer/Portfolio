import type {APIRoute} from "astro";
import {getCollection} from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const GET: APIRoute = async () => {
    const now = dayjs().utc();
    const popups = (await getCollection("popups")).filter(popup => {
        const startDate = dayjs(popup.data.startDate).utc();
        const endDate = dayjs(popup.data.endDate).utc();
        return startDate.isBefore(now, "second") && endDate.isAfter(now, "second");
    });

    const filteredData = popups.map((popup) => ({
        data: popup.data,
        rendered: popup.rendered?.html ?? "",
    }));

    return new Response(JSON.stringify(filteredData), {
        headers: {"Content-Type": "application/json"},
    })
};
