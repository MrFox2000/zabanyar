/**
 * One place for the public URL so metadata, sitemap and share links agree.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL  — explicit override (custom domain, static host)
 *   2. Vercel's own production URL env var — no manual step after a deploy
 *   3. the live deployment
 */
const explicit = process.env.NEXT_PUBLIC_SITE_URL;
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const SITE_URL = (explicit ?? (vercel ? `https://${vercel}` : "https://zabanyar-kappa.vercel.app")).replace(/\/$/, "");
