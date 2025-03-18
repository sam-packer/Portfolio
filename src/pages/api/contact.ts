import type {APIRoute} from "astro";
import {getSecret} from "astro:env/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "https://sampacker.com",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
};

export const POST: APIRoute = async ({request}) => {
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

    if (outcome.success) {
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({message: "All form fields are required."}),
                {status: 400}
            );
        }
        const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

        const emailPayload = {
            sender: {name, email: 'contact-form@sampacker.com'},
            to: [{name: "Sam Packer", email: 'me@sampacker.com'}],
            replyTo: {name, email},
            subject: `New Contact Form Submission from ${name}`,
            htmlContent: `
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
                Accept: 'application/json',
            } as HeadersInit,
            body: JSON.stringify(emailPayload),
        });

        if (!emailSend.ok) {
            const errorDetails = await emailSend.text();
            throw new Error(`Failed to send email: ${errorDetails}`);
        }

        return new Response(
            JSON.stringify({message: "Your message has been sent, thank you!"}),
            {
                status: 200,
                headers: {...corsHeaders, "Content-Type": "application/json"},
            }
        );
    }

    return new Response(
        JSON.stringify({message: "Human verification failed."}),
        {
            status: 400,
            headers: {...corsHeaders, "Content-Type": "application/json"},
        }
    );
}

export const OPTIONS: APIRoute = ({request}) => {
    const origin = request.headers.get("Origin");
    if (origin && ["https://sampacker.com"].includes(origin)) {
        // Handle CORS preflight requests.
        return new Response(null, {
            headers: {
                ...corsHeaders,
                "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "",
                "Access-Control-Allow-Origin": origin,
            },
        });
    }
    return new Response(null, {status: 403});
}

export const GET: APIRoute = ({params, request}) => {
    return new Response(JSON.stringify({message: "online!"}), {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
