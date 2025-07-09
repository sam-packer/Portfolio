import type { APIRoute } from "astro";
import os from "os";

export const GET: APIRoute = async ({ params }) => {
    const { slug } = params;
    const hostname = os.hostname();

    if (slug !== hostname) {
        return new Response(
            JSON.stringify({ error: "Server not found", expected: hostname }),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    return new Response(
        JSON.stringify({
            status: "ok",
            server: hostname,
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
};
