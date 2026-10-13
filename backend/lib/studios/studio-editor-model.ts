import type { EditorImage } from '@/lib/images/editor-image';
import type { EditorTestShot } from '@/lib/images/editor-test-shot';
import type { Disclosure } from '@/lib/publishing/disclosure';
import type { LocationStatus } from '@/lib/publishing/location-status';
import type { GearItemRecord } from '@/lib/studios/gear-item-record';
import type { LoadIn } from '@/lib/studios/load-in';
import type { NaturalLightInput } from '@/lib/studios/natural-light-input';
import type { ParkingOption } from '@/lib/studios/parking-option';
import type { RubricScoresInput } from '@/lib/studios/rubric-scores-input';
import type { StudioFeeRecord } from '@/lib/studios/studio-fee-record';

/** A studio of any status as the owner's editor reads it (ICD §13.10). */
export interface StudioEditorModel {
  id: string;
  slug: string;
  status: LocationStatus;
  publishedAt: string | null;
  updatedAt: string;
  name: string;
  neighbourhood: string | null;
  addressOrCrossStreets: string | null;
  bookingUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  hourlyRate: number | null;
  minBookingHours: number | null;
  fees: StudioFeeRecord[];
  priceVerifiedAt: string;
  usableWidth: number | null;
  usableDepth: number | null;
  ceilingHeight: number | null;
  windowDirection: string | null;
  naturalLight: NaturalLightInput;
  outletCount: number | null;
  outletType: string | null;
  has20aCircuits: boolean | null;
  hasCycWall: boolean | null;
  cycWallCondition: string | null;
  backdrops: string[];
  gear: GearItemRecord[];
  loadIn: LoadIn | null;
  loadInNote: string | null;
  parking: ParkingOption | null;
  transit: string | null;
  washroom: string | null;
  changingArea: string | null;
  clientSeating: string | null;
  noise: string | null;
  scores: RubricScoresInput;
  whoItsFor: string | null;
  whoShouldSkip: string | null;
  disclosure: Disclosure | null;
  disclosureProvider: string | null;
  /** The stored video ID. */
  videoLink: string | null;
  episodeTitle: string | null;
  testShots: EditorTestShot[];
  gallery: EditorImage[];
}
