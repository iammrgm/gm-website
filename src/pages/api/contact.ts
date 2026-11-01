import type { APIRoute } from "astro";

export const prerender = false;

// Sent through Cloudflare Email Routing's send_email binding (SEND_EMAIL in wrangler.jsonc).
// The destination must be a verified Email Routing address on the account.
const FROM = "website@garethmatthews.uk";
const TO = "gareth@departmnt.xyz";

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

const encodeHeader = (v: string) => `=?UTF-8?B?${btoa(String.fromCharCode(...new TextEncoder().encode(v)))}?=`;

const json = (body: object, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ error: "Expected a form submission" }, 400);
  }

  // Honeypot: real visitors never see this field.
  if (String(data.get("website") ?? "")) return json({ ok: true }, 200);

  const name = clean(data.get("name"), 200);
  const email = clean(data.get("email"), 320);
  const requestType = clean(data.get("request"), 100);
  const message = String(data.get("message") ?? "").trim().slice(0, 4000);

  if (!name || !requestType || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Missing or invalid fields" }, 400);
  }

  if (!import.meta.env.PROD) return json({ error: "Email only sends from the deployed site" }, 503);

  const { env } = await import("cloudflare:workers");
  const { EmailMessage } = await import("cloudflare:email");
  const binding = (env as { SEND_EMAIL?: { send(m: unknown): Promise<void> } }).SEND_EMAIL;
  if (!binding) return json({ error: "Contact form is not configured" }, 500);

  const raw = [
    `From: Gareth Matthews website <${FROM}>`,
    `To: <${TO}>`,
    `Reply-To: ${encodeHeader(name)} <${email}>`,
    `Subject: ${encodeHeader(`New enquiry: ${requestType} from ${name}`)}`,
    `Message-ID: <${crypto.randomUUID()}@garethmatthews.uk>`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Request: ${requestType}`,
    "",
    (message || "(no message)").replace(/\r?\n/g, "\r\n"),
  ].join("\r\n");

  try {
    await binding.send(new EmailMessage(FROM, TO, raw));
  } catch {
    return json({ error: "Failed to send" }, 502);
  }
  return json({ ok: true }, 200);
};
