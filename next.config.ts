import type { NextConfig } from "next";

/**
 * Two ways to ship the same app:
 *   - normal (`npm run build`): server routes included → Vercel/Node hosting
 *   - static (`npm run build:static`): pure HTML/CSS/JS → any static host
 * Only the AI routes disappear in static mode; every lesson is client-side anyway.
 */
const isStatic = process.env.NEXT_BUILD_STATIC === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  devIndicators: false,
  ...(isStatic
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        // Note: a static export cannot emit the per-route prefetch payloads
        // (that needs cacheComponents), so <Link> prefetch requests 404 harmlessly.
        // Navigation itself is unaffected; the server build prefetches normally.
      }
    : {}),
};

export default nextConfig;
