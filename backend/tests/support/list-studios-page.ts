import { GET } from '@/app/api/studios/route';

/** Requests the public studio list with the given query string. */
export async function listStudiosPage(query = '') {
  const response = await GET(new Request(`http://localhost/api/studios${query}`));
  return { status: response.status, body: await response.json() };
}
