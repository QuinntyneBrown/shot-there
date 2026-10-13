import { GET } from '@/app/api/spots/[slug]/route';

/** Requests a spot page from the public API. */
export async function getSpotPage(slug: string) {
  const response = await GET(new Request(`http://localhost/api/spots/${slug}`), {
    params: Promise.resolve({ slug }),
  });
  return { status: response.status, body: response.status === 200 ? await response.json() : null };
}
