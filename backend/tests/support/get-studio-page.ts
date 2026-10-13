import { GET } from '@/app/api/studios/[slug]/route';

/** Requests a studio page from the public API. */
export async function getStudioPage(slug: string) {
  const response = await GET(new Request(`http://localhost/api/studios/${slug}`), {
    params: Promise.resolve({ slug }),
  });
  return { status: response.status, body: response.status === 200 ? await response.json() : null };
}
