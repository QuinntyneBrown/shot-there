const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(['www.youtube.com', 'youtube.com', 'm.youtube.com']);

/** The 11-character YouTube video ID from a bare ID, a `watch?v=` URL or a youtu.be URL; otherwise null (ICD §15.1). */
export function extractVideoId(input: string): string | null {
  const value = input.trim();
  if (VIDEO_ID.test(value)) return value;
  if (!URL.canParse(value)) return null;

  const url = new URL(value);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  let candidate: string | null = null;
  if (url.hostname === 'youtu.be') {
    candidate = url.pathname.slice(1).replace(/\/$/, '');
  } else if (YOUTUBE_HOSTS.has(url.hostname) && url.pathname === '/watch') {
    candidate = url.searchParams.get('v');
  }
  return candidate !== null && VIDEO_ID.test(candidate) ? candidate : null;
}
