import type { CycWallDto } from '@/lib/studios/cyc-wall-dto';
import type { NaturalLightDto } from '@/lib/studios/natural-light-dto';
import type { StudioPowerDto } from '@/lib/studios/studio-power-dto';

/** Measured specifications; lengths are in metres. */
export interface StudioSpecificationsDto {
  usableWidthM: number | null;
  usableDepthM: number | null;
  ceilingHeightM: number | null;
  windowDirection: string | null;
  naturalLight: NaturalLightDto;
  power: StudioPowerDto;
  cycWall: CycWallDto;
  backdrops: string | null;
}
