import { Shot } from './shot';

export interface LightboxData {
  title: string;
  shots: readonly Shot[];
  startIndex: number;
}
