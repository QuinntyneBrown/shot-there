import { getDependencies } from '@/lib/data/dependency-container';
import type { GuideCandidate } from '@/lib/guides/guide-candidate';

const LIMIT = 20;

/** Studios and spots of any status whose name contains the text, ignoring case, by name; at most 20. */
export async function searchGuideCandidates(text: string): Promise<GuideCandidate[]> {
  const needle = text.toLocaleLowerCase('en-CA');

  const { studios, spots } = getDependencies();
  const [allStudios, allSpots] = await Promise.all([studios.listAll(), spots.listAll()]);
  const candidates: GuideCandidate[] = [
    ...allStudios.map(({ id, name, neighbourhood, status }) => ({ kind: 'studio' as const, id, name, neighbourhood, status })),
    ...allSpots.map(({ id, name, neighbourhood, status }) => ({ kind: 'spot' as const, id, name, neighbourhood, status })),
  ];
  return candidates
    .filter((candidate) => candidate.name.toLocaleLowerCase('en-CA').includes(needle))
    .sort((a, b) => a.name.localeCompare(b.name, 'en-CA'))
    .slice(0, LIMIT);
}
