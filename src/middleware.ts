import { defineMiddleware } from "astro:middleware";

const PROTECTED_PREFIXES = ["/keystatic", "/api/keystatic"];

// Gates the CMS admin (and its API routes) behind HTTP Basic Auth in
// production only. Local dev is left open — it's your own machine, and the
// Cloudflare env bindings this reads aren't available there anyway. The
// "cloudflare:workers" import only resolves under the Cloudflare adapter
// (production), never under the Node adapter dev runs on, so it's loaded
// dynamically and only when actually needed.
export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const isProtected = PROTECTED_PREFIXES.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`));
  if (!isProtected || !import.meta.env.PROD) {
    return next();
  }

  const { env } = await import("cloudflare:workers");
  const user = env.CMS_BASIC_AUTH_USER;
  const password = env.CMS_BASIC_AUTH_PASSWORD;

  if (!user || !password) {
    return new Response("CMS auth is not configured yet.", { status: 503 });
  }

  const expected = `Basic ${btoa(`${user}:${password}`)}`;
  if (request.headers.get("authorization") !== expected) {
    return new Response("Authentication required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="CMS", charset="UTF-8"' },
    });
  }

  return next();
});
