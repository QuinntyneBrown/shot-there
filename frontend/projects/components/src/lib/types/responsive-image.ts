import { ResponsiveImageSource } from './responsive-image-source';

export interface ResponsiveImage {
  alt: string;
  width: number;
  height: number;
  sources: readonly ResponsiveImageSource[];
  fallbackUrl: string;
}
