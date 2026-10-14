import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { GET as unknownRoute } from '@/app/api/[...path]/route';
import { POST as upload } from '@/app/api/admin/images/route';
import { GET as listStudios } from '@/app/api/studios/route';
import { POST as subscribe } from '@/app/api/subscribers/route';
import { proxy } from '@/proxy';
import { adminRequest, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { expectProblem } from '@/tests/support/expect-problem';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { ownerHeaders } from '@/tests/support/owner-account';

stubSiteOriginPerTest();

const signUp = (contentType: string) =>
  subscribe(
    new Request('http://localhost/api/subscribers', {
      method: 'POST',
      headers: { 'content-type': contentType, 'x-forwarded-for': '192.0.2.99' },
      body: JSON.stringify({ email: 'jane@example.com', sourcePath: '/' }),
    }),
  );

describe('ICD C-1, C-2 media types', () => {
  it('Given a successful JSON response, when inspected, then its content type names UTF-8', async () => {
    useFakeDependencies();

    const response = await listStudios(new Request('http://localhost/api/studios'));

    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
  });

  it('Given a JSON body sent as text/plain, when submitted, then the response is 415 unsupported-media-type', async () => {
    useFakeDependencies();

    await expectProblem(await signUp('text/plain'), 'unsupported-media-type', 415);
  });

  it('Given a JSON body whose content type carries a charset, when submitted, then it is accepted', async () => {
    useFakeDependencies();

    expect((await signUp('application/json; charset=utf-8')).status).toBe(200);
  });

  it('Given an image upload sent as JSON, when submitted, then the response is 415 unsupported-media-type', async () => {
    useSignedInOwner();

    const response = await upload(adminRequest('/api/admin/images', { method: 'POST', body: { file: 'x' } }));

    await expectProblem(response, 'unsupported-media-type', 415);
  });
});

describe('ICD T-5 methods and §9.1 unknown routes', () => {
  it.each([
    ['PATCH', '/api/studios', 'GET'],
    ['POST', '/api/studios/the-loft', 'GET'],
    ['GET', '/api/subscribers', 'POST'],
    ['PUT', '/api/admin/studios', 'GET, POST'],
    ['PATCH', '/api/admin/spots/p1', 'GET, PUT, DELETE'],
    ['GET', '/api/admin/guides/g1/publish', 'POST, DELETE'],
    ['OPTIONS', '/api/health', 'GET'],
  ])('Given %s %s, when received, then the response is 405 with Allow: %s and an empty body', async (method, path, allow) => {
    const response = await proxy(new NextRequest(`https://shotthere.ca${path}`, { method, headers: ownerHeaders('tok') }));

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe(allow);
    expect(await response.text()).toBe('');
  });

  it('Given a supported method, when received, then the proxy passes it on', async () => {
    const response = await proxy(new NextRequest('https://shotthere.ca/api/studios'));

    expect(response.status).toBe(200);
  });

  it('Given an API path that matches no route, when requested, then the response is a 404 not-found problem', async () => {
    useFakeDependencies();

    const response = await unknownRoute(new Request('http://localhost/api/nothing-here'));

    await expectProblem(response, 'not-found', 404);
  });
});
