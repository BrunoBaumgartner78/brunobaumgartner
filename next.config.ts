import type { NextConfig } from 'next'
const isDev = process.env.NODE_ENV !== 'production'

const baseCSP = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' 'wasm-unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com;
  connect-src 'self' https://cdn.sanity.io https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com ${isDev ? 'ws:' : ''};
  img-src 'self' data: blob: https://cdn.sanity.io;
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim()

// Sehr locker NUR für /studio in DEV (um Cookie/CORS-Edgecases zu vermeiden)
const studioDevCSP = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  connect-src * data: blob: ws:;
  img-src * data: blob:;
  style-src 'self' 'unsafe-inline';
  font-src * data:;
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim()

const nextConfig: NextConfig = {
  async headers() {
    if (isDev) {
      return [
        // /studio: CSP sehr locker bzw. effektiv aus
        {
          source: '/studio/:path*',
          headers: [
            { key: 'Content-Security-Policy', value: studioDevCSP },
          ],
        },
        // Rest: deine „normale“ CSP
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

    // Production: /studio mit whitelists statt Wildcards
    return [
      {
        source: '/studio/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: `
            default-src 'self';
            script-src 'self' 'unsafe-inline';
            connect-src 'self' https://*.sanity.io https://*.api.sanity.io https://cdn.sanity.io;
            img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io;
            style-src 'self' 'unsafe-inline';
            font-src 'self' data: https://cdn.sanity.io;
            frame-ancestors 'none';
          `.replace(/\s{2,}/g, ' ').trim() },
        ],
      },
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
