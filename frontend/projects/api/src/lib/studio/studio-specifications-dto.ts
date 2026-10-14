import { NaturalLightDto } from './natural-light-dto';

export interface StudioSpecificationsDto {
  usableWidthM: number;
  usableDepthM: number;
  ceilingHeightM: number;
  windowDirection: string;
  naturalLight: NaturalLightDto;
  outletCount: number;
  outletType: string;
  has20ACircuits: boolean;
  hasCycWall: boolean;
  cycWallCondition: string | null;
  backdrops: string[];
}
