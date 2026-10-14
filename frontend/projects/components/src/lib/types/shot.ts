import { ResponsiveImage } from './responsive-image';

export interface Shot {
  image: ResponsiveImage;
  caption: string;
  title?: string;
}
