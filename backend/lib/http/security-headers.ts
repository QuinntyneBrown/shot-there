const frameSources = ['https://www.youtube-nocookie.com', process.env.MAP_PROVIDER_ORIGIN].filter(Boolean).join(' ');

/** Security headers sent on every response. */
export const securityHeaders: Readonly<Record<string, string>> = {
  'Content-Security-Policy': `default-src 'self'; script-src 'self'; frame-src ${frameSources}; frame-ancestors 'none'; object-src 'none'; base-uri 'self'`,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};
