import { z } from 'zod';

const ROLE_KIND = { test_shot: 'studio', gallery: 'studio', sample_shot: 'spot' } as const;

/** The text fields of an image upload (ICD E40): the role and the location it belongs to, which must suit the role. */
export const uploadFieldsSchema = z
  .strictObject({
    role: z.enum(['test_shot', 'gallery', 'sample_shot'], { error: 'Choose gallery, standard test shot or sample shot' }),
    locationKind: z.enum(['studio', 'spot'], { error: 'Choose a studio or a spot' }),
    locationId: z.string({ error: 'Choose the location' }).min(1, { error: 'Choose the location' }).max(64),
  })
  .superRefine((fields, context) => {
    if (ROLE_KIND[fields.role] !== fields.locationKind) {
      context.addIssue({
        code: 'custom',
        path: ['role'],
        message: `A ${fields.role} image belongs to a ${ROLE_KIND[fields.role]}`,
        params: { code: 'invalid_value' },
      });
    }
  });
