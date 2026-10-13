import { z } from 'zod';
import { requiredText } from '@/lib/http/input-fields';

/** Strict, as on every administration endpoint (ICD C-22, E39). */
export const guideCandidateQuerySchema = z.object({ q: requiredText('Enter part of a name', 100) });
