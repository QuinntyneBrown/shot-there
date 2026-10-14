import { describe, expect, it } from 'vitest';
import { GET as getStudio } from '@/app/api/studios/[slug]/route';
import { POST as subscribe } from '@/app/api/subscribers/route';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { captureLogs } from '@/tests/support/captured-logs';
import { expectProblem } from '@/tests/support/expect-problem';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';

let clientNumber = 0;

function signUp(body: unknown) {
  return subscribe(
    new Request('http://localhost/api/subscribers', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `192.0.2.${++clientNumber}` },
      body: JSON.stringify(body),
    }),
  );
}

describe('ICD §9.2 problem details', () => {
  it('Given an unknown slug, when requested, then the response is a not-found problem with every property present and the correlation ID of the header', async () => {
    useFakeDependencies();

    const response = await getStudio(new Request('http://localhost/api/studios/nowhere'), {
      params: Promise.resolve({ slug: 'nowhere' }),
    });

    const problem = await expectProblem(response, 'not-found', 404);
    expect(problem).toEqual({
      type: 'urn:shotthere:problem:not-found',
      title: expect.any(String),
      status: 404,
      detail: null,
      correlationId: response.headers.get('x-correlation-id'),
      errors: [],
      missingFields: [],
    });
  });

  it.each([
    ['a missing required field', { sourcePath: '/' }, 'email', 'required'],
    ['a value of the wrong type', { email: 42, sourcePath: '/' }, 'email', 'invalid_type'],
    ['a malformed email', { email: 'not-an-email', sourcePath: '/' }, 'email', 'invalid_format'],
    ['an over-long email', { email: `${'a'.repeat(250)}@example.com`, sourcePath: '/' }, 'email', 'out_of_range'],
    ['an undeclared property', { email: 'a@example.com', sourcePath: '/', isAdmin: true }, 'isAdmin', 'unrecognized_key'],
  ])('Given %s, when submitted, then a validation-failed problem names the field and the code', async (_label, body, field, code) => {
    useFakeDependencies();

    const problem = await expectProblem(await signUp(body), 'validation-failed', 400);

    expect(problem.errors).toContainEqual({ field, code, message: expect.any(String) });
  });

  it('Given an unparsable JSON body, when submitted, then the error is invalid_format on the whole body', async () => {
    useFakeDependencies();

    const response = await subscribe(
      new Request('http://localhost/api/subscribers', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.250' },
        body: '{not json',
      }),
    );

    const problem = await expectProblem(response, 'validation-failed', 400);
    expect(problem.errors).toEqual([{ field: '', code: 'invalid_format', message: expect.any(String) }]);
  });

  it('Given an unhandled error, when it reaches the wrapper, then the response is an internal-error problem without internal detail', async () => {
    captureLogs();
    const handler = withRequestLogging(async () => {
      throw new TypeError('secret internal detail');
    });

    const response = await handler(new Request('http://localhost/api/anything'));

    const problem = await expectProblem(response, 'internal-error', 500);
    expect(JSON.stringify(problem)).not.toContain('secret internal detail');
  });
});
