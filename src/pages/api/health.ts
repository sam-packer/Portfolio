import type { APIRoute } from "astro";
import os from "os";

export const GET: APIRoute = async () => {
    const hostname = os.hostname();

    return new Response(
        JSON.stringify({
            status: "ok",
            server: hostname
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};
