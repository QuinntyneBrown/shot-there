import { z } from 'zod';
import { requiredText } from '@/lib/http/input-fields';

/** The text fields of an image upload: its role and exactly one owning location. */
export const uploadFieldsSchema = z
  .object({
    role: z.enum(['testShot', 'gallery', 'sampleShot'], { message: 'Choose gallery, standard test shot or sample shot' }),
    studioId: z.string().min(1).optional(),
    spotId: z.string().min(1).optional(),
  })
  .strict()
  .refine((fields) => (fields.studioId === undefined) !== (fields.spotId === undefined), {
    message: 'Choose the studio or spot the image belongs to',
    path: ['studioId'],
    params: { code: 'required' },
  });

/** One image's place and alt text in the editor's save body. */
export const imageOrderItemSchema = z.strictObject({
  id: z.string({ error: 'Choose an image' }).min(1, { error: 'Choose an image' }),
  altText: requiredText('Describe this image', 500),
  sortOrder: z.number({ error: 'Enter a whole number of 0 or more' }).int({ error: 'Enter a whole number of 0 or more' }).min(0, { error: 'Enter a whole number of 0 or more' }),
});
