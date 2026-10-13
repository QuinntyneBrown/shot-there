import { z } from 'zod';
import { extractVideoId } from '@/lib/videos/extract-video-id';

const MESSAGE = 'Enter a YouTube link or video ID';

/** A pasted YouTube link or ID, stored as the video ID; empty clears the video. */
export const videoIdField = () =>
  z
    .string({ error: MESSAGE })
    .trim()
    .max(2000, { error: MESSAGE })
    .transform((value, context) => {
      if (value === '') return null;
      const id = extractVideoId(value);
      if (id === null) context.addIssue({ code: 'custom', message: MESSAGE });
      return id;
    })
    .nullable()
    .default(null);
