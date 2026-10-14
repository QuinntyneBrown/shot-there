import { listAdminContent } from '@/lib/admin/list-admin-content';
import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { createStudio } from '@/lib/studios/create-studio';
import { parseStudioInput } from '@/lib/studios/parse-studio-input';
import { toStudioEditorModel } from '@/lib/studios/to-studio-editor-model';

export const GET = withRequestLogging(async (request: Request) => {
  await requireOwnerSession(request);
  return Response.json(await listAdminContent('studios'));
});

export const POST = withRequestLogging(async (request: Request) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const studio = await createStudio(await parseStudioInput(request));
  return Response.json(toStudioEditorModel(studio), { status: 201, headers: { location: `/api/admin/studios/${studio.id}` } });
});
