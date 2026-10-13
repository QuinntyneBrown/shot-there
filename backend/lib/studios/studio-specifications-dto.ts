import type { NaturalLightDto } from '@/lib/studios/natural-light-dto';
import type { PowerDto } from '@/lib/studios/power-dto';

/** Measured specifications; lengths are in metres. */
export interface StudioSpecificationsDto {
  usableWidth: number;
  usableDepth: number;
  ceilingHeight: number;
  windowDirection: string;
  naturalLight: NaturalLightDto;
  power: PowerDto;
  hasCycWall: boolean;
  /** Null whenever there is no cyc wall. */
  cycWallCondition: string | null;
  backdrops: string[];
}
