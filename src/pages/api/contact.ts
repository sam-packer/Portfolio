import type {APIRoute} from "astro";
import {getSecret} from "astro:env/server";

const debug = false;

export const POST: APIRoute = async ({request}) => {
    if (!debug) {
        const origin = request.headers.get("Origin");
        if (!origin || origin !== "https://sampacker.com") {
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
            {
                status: 400,
                headers: {"Content-Type": "application/json"},
            }
        );
    }

    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

    const emailPayload = {
        'sender': {name, email: 'contact-form@sampacker.com'},
        'to': [{name: "Sam Packer", email: 'me@sampacker.com'}],
        'replyTo': {name, email},
        'subject': `New Contact Form Submission from ${name}`,
        'htmlContent': `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <div style="display: flex; justify-content: center; padding: 30px 15px;">
            <div style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px; box-sizing: border-box;">
       
              <h2 style="color: #333333; margin-top: 0;">New Contact Form Submission</h2>
              <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>
        
              <p style="margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 20px 0 5px;"><strong>Message:</strong></p>
              <p style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin: 0;">${message}</p>
        
              <div style="border-top: 1px solid #e0e0e0; margin: 30px 0 10px;"></div>
              <p style="font-size: 12px; color: #888888; text-align: center; margin: 0;">This message was sent via your website contact form.</p>
            </div>
          </div>
        </body>
        </html>
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
    if (!debug) {
        const origin = request.headers.get("Origin");

        if (!origin || origin !== "https://sampacker.com") {
            return new Response(null, {status: 403});
        }
    }

    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*"
        },
    });
};

export async function GET({ redirect }) {
    return redirect("https://sampacker.com", 303);
}
