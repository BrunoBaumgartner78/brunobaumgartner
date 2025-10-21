// next.config.ts
import type { NextConfig } from 'next'
import path from 'path'

const isDev = process.env.NODE_ENV !== 'production'

// Basis-CSP (für alles außer /studio im DEV)
const baseCSP = `
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' 'wasm-unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com;
  connect-src 'self'
    https://cdn.sanity.io https://*.sanity.io https://*.api.sanity.io
    https://www.google-analytics.com https://*.google-analytics.com https://region1.google-analytics.com
    https://www.googletagmanager.com https://*.googletagmanager.com
    https://vitals.vercel-insights.com
    ${isDev ? 'ws:' : ''};
  img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim()

// Sehr lockere CSP nur für /studio in DEV (SPA/Preview/CORS)
const studioDevCSP = `
  default-src 'self';
  base-uri 'self';
  object-src 'none';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  connect-src * data: blob: ws:;
  img-src * data: blob:;
  style-src 'self' 'unsafe-inline';
  font-src * data:;
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim()

const nextConfig: NextConfig = {
  // Lint-Fehler sollen Builds (z.B. Vercel) nicht blockieren
  eslint: { ignoreDuringBuilds: true },

  // Optional: @-Alias -> 'src' (hilft gegen "Module not found: '@/…'")
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.join(__dirname, 'src'),
    }
    return config
  },

  async headers() {
    if (isDev) {
      return [
        // /studio (nur DEV): sehr lockere CSP
        {
          source: '/studio/:path*',
          headers: [{ key: 'Content-Security-Policy', value: studioDevCSP }],
        },
        // Rest (DEV): normale CSP + Security-Header
        {
          source: '/:path*',
          headers: [
            { key: 'Content-Security-Policy', value: baseCSP },
            { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
      ]
    }

    // Production
    return [
      // /studio (PROD): gezielte Whitelist für Sanity
      {
        source: '/studio/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              base-uri 'self';
              object-src 'none';
              script-src 'self' 'unsafe-inline';
              connect-src 'self' https://*.sanity.io https://*.api.sanity.io https://cdn.sanity.io;
              img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io;
              style-src 'self' 'unsafe-inline';
              font-src 'self' data: https://cdn.sanity.io;
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
      // Rest (PROD): Basis-CSP + Security-Header
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: baseCSP },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
