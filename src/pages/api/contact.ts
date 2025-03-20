import type {APIRoute} from "astro";
import {getSecret} from "astro:env/server";

const debug = false;

export const POST: APIRoute = async ({request}) => {
    if (!debug) {
        if (request.headers.get("Origin") !== "https://www.sampacker.com") {
            return new Response(
                JSON.stringify({message: "You are not allowed to make requests to this endpoint from the specified origin."}),
                {
                    status: 403,
                    headers: {"Content-Type": "application/json"},
                }
            );
        }
    }

    const SECRET_KEY = getSecret("TURNSTILE_KEY");
    const BREVO_API_KEY = getSecret("BREVO_KEY");

    const body = await request.json();

    const token = body["cf-turnstile-response"];
    const name = body["name"];
    const email = body["email"];
    const message = body["message"];
    const ip = request.headers.get("CF-Connecting-IP");

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            secret: SECRET_KEY,
            response: token,
            remoteip: ip,
        }),
    });

    const outcome = await result.json();

    if (!outcome.success) {
        return new Response(
            JSON.stringify({message: "Turnstile verification failed."}),
            {
                status: 403,
                headers: {"Content-Type": "application/json"},
            }
        );
    }

    if (!name || !email || !message) {
        return new Response(
            JSON.stringify({message: "All form fields are required."}),
            {status: 400}
        );
    }

    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

    const emailPayload = {
        'sender': {name, email: 'contact-form@sampacker.com'},
        'to': [{name: "Sam Packer", email: 'me@sampacker.com'}],
        'replyTo': {name, email},
        'subject': `New Contact Form Submission from ${name}`,
        'htmlContent': `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `,
    };

    const emailSend = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        } as HeadersInit,
        body: JSON.stringify(emailPayload),
    });

    if (!emailSend.ok) {
        const errorDetails = await emailSend.json();
        return new Response(JSON.stringify({message: !debug ? "The server failed to send the email." : errorDetails}), {
            status: 500,
            headers: {"Content-Type": "application/json"},
        });
    }

    return new Response(
        JSON.stringify({message: "Message was sent successfully."}),
        {
            status: 200,
            headers: {"Content-Type": "application/json"},
        }
    );
}

export const OPTIONS: APIRoute = ({request}) => {
    const origin = request.headers.get("Origin");
    if (origin && ["https://www.sampacker.com"].includes(origin)) {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "",
                "Access-Control-Allow-Origin": origin,
            },
        });
    }
    return new Response(null, {status: 403});
}

export const GET: APIRoute = () => {
    return new Response(null, {
        status: 303,
        headers: {
            "Location": "https://www.sampacker.com",
        },
    });
};
