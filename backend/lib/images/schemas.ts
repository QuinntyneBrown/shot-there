import { z } from 'zod';

/** The text fields of an image upload: its role and exactly one owning location. */
export const uploadFieldsSchema = z
  .object({
    role: z.enum(['test_shot', 'gallery', 'sample_shot'], { message: 'Choose gallery, standard test shot or sample shot' }),
    studioId: z.string().min(1).optional(),
    spotId: z.string().min(1).optional(),
  })
  .strict()
  .refine((fields) => (fields.studioId === undefined) !== (fields.spotId === undefined), {
    message: 'Choose the studio or spot the image belongs to',
    path: ['studioId'],
    params: { code: 'required' },
  });
