import type { LoadIn } from '@/lib/studios/load-in';
import type { ParkingOption } from '@/lib/studios/parking-option';

export interface StudioLogisticsDto {
  loadIn: LoadIn | null;
  loadInNote: string | null;
  parking: ParkingOption | null;
  parkingNote: string | null;
  transit: string | null;
  washroom: string | null;
  changingArea: string | null;
  clientSeating: string | null;
  noise: string | null;
}
