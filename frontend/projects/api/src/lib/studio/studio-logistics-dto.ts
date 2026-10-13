import { LoadIn } from './load-in';

export interface StudioLogisticsDto {
  loadIn: LoadIn;
  loadInNote: string | null;
  parking: string;
  transit: string;
  washroom: string;
  /** Null when the studio has no changing area. */
  changingArea: string | null;
  clientSeating: string;
  noise: string;
}
