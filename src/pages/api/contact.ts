import type { APIRoute } from "astro";

export const prerender = false;

const CONTACT_EMAIL = "hello@departmnt.xyz";

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const requestType = String(data.get("request") || "").trim();

  if (!name || !email || !requestType) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  // Cloudflare env bindings only resolve under the Cloudflare adapter
  // (production); local dev runs on the Node adapter and has no secret here.
  const apiKey = import.meta.env.PROD ? (await import("cloudflare:workers")).env.RESEND_API_KEY : undefined;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Contact form is not configured yet" }), {
      status: 500,
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Website <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      reply_to: email,
      subject: `New enquiry: ${requestType} from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nRequest: ${requestType}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(JSON.stringify({ error: "Failed to send", detail }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
