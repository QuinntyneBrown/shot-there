import { describe, expect, it } from 'vitest';
import { expectProblem } from '@/tests/support/expect-problem';
import { PUT as updateStudio } from '@/app/api/admin/studios/[id]/route';
import { GET as findRedirect } from '@/app/api/slug-redirects/[type]/[slug]/route';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aStudio } from '@/tests/support/builders';
import type { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { studioSaveBody } from '@/tests/support/studio-input';

stubSiteOriginPerTest();

const update = (id: string, body: unknown) =>
  updateStudio(adminRequest(`/api/admin/studios/${id}`, { method: 'PUT', body }), idParams(id));

async function redirectFor(slug: string) {
  const response = await findRedirect(new Request(`http://localhost/api/slug-redirects/studio/${slug}`), {
    params: Promise.resolve({ type: 'studio', slug }),
  });
  return response.status === 200 ? (await response.json()).toSlug : null;
}

describe('L2-075 stable URLs for published studios', () => {
  it('Given a published studio, when the owner renames it without changing the slug, then its URL stays the same', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'old-loft', name: 'Old Loft' })] });

    await update('s1', await studioSaveBody('s1', { name: 'Brand New Name' }));

    expect((dependencies.studios as InMemoryStudioRepository).rows[0].slug).toBe('old-loft');
    expect(await redirectFor('old-loft')).toBeNull();
  });

  it('Given a published studio whose slug the owner changes, when the old slug is looked up, then it redirects to the new slug', async () => {
    const dependencies = useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'old-loft' })] });

    const response = await update('s1', await studioSaveBody('s1', { slug: 'the-junction-loft' }));

    expect(response.status).toBe(200);
    expect((dependencies.studios as InMemoryStudioRepository).rows[0].slug).toBe('the-junction-loft');
    expect(await redirectFor('old-loft')).toBe('the-junction-loft');
  });

  it('Given a studio already renamed once, when its slug changes again, then the oldest slug redirects straight to the newest with no chain', async () => {
    useSignedInOwner({
      studios: [aStudio({ id: 's1', slug: 'second-name' })],
      slugRedirects: [{ type: 'studio', fromSlug: 'first-name', toSlug: 'second-name' }],
    });

    await update('s1', await studioSaveBody('s1', { slug: 'third-name' }));

    expect(await redirectFor('first-name')).toBe('third-name');
    expect(await redirectFor('second-name')).toBe('third-name');
  });

  it('Given a studio that returns to an earlier slug, when it is saved, then that slug no longer redirects', async () => {
    useSignedInOwner({
      studios: [aStudio({ id: 's1', slug: 'second-name' })],
      slugRedirects: [{ type: 'studio', fromSlug: 'first-name', toSlug: 'second-name' }],
    });

    await update('s1', await studioSaveBody('s1', { slug: 'first-name' }));

    expect(await redirectFor('first-name')).toBeNull();
    expect(await redirectFor('second-name')).toBe('first-name');
  });

  it('Given a draft studio whose slug changes, when saved, then no redirect is recorded', async () => {
    useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'draft-loft', status: 'draft' })] });

    await update('s1', await studioSaveBody('s1', { slug: 'renamed-loft' }));

    expect(await redirectFor('draft-loft')).toBeNull();
  });

  it.each([
    ['taken-loft', 'already_in_use'],
    ['Not A Slug', 'invalid_format'],
  ])('Given the slug %s, when saved, then the save is refused naming slug with %s', async (slug, code) => {
    useSignedInOwner({ studios: [aStudio({ id: 's1', slug: 'old-loft' }), aStudio({ id: 's2', slug: 'taken-loft' })] });

    const response = await update('s1', await studioSaveBody('s1', { slug }));

    const problem = await expectProblem(response, 'validation-failed', 400);
    expect(problem.errors).toContainEqual({ field: 'slug', code, message: expect.any(String) });
  });
});
