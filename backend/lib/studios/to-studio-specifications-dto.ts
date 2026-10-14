import { present } from '@/lib/shared/present';
import type { StudioRecord } from '@/lib/studios/studio-record';
import type { StudioSpecificationsDto } from '@/lib/studios/studio-specifications-dto';

export function toStudioSpecificationsDto(studio: StudioRecord): StudioSpecificationsDto {
  const hasCycWall = present(studio.hasCycWall, 'hasCycWall');
  return {
    usableWidth: present(studio.usableWidthM, 'usableWidth'),
    usableDepth: present(studio.usableDepthM, 'usableDepth'),
    ceilingHeight: present(studio.ceilingHeightM, 'ceilingHeight'),
    windowDirection: present(studio.windowDirection, 'windowDirection'),
    naturalLight: {
      morning: present(studio.lightMorning, 'naturalLight.morning'),
      midday: present(studio.lightMidday, 'naturalLight.midday'),
      afternoon: present(studio.lightAfternoon, 'naturalLight.afternoon'),
      evening: present(studio.lightEvening, 'naturalLight.evening'),
    },
    power: {
      outletCount: present(studio.outletCount, 'outletCount'),
      outletType: present(studio.outletType, 'outletType'),
      has20aCircuits: present(studio.has20ACircuits, 'has20aCircuits'),
    },
    hasCycWall,
    cycWallCondition: hasCycWall ? studio.cycWallCondition : null,
    backdrops: studio.backdrops,
  };
}
