import { ɵbypassSanitizationTrustResourceUrl as trustResourceUrl } from '@angular/core';
import type { SafeResourceUrl } from '@angular/platform-browser';

/**
 * The Junction Loft's episode, as the application passes it. The application
 * trusts the embed URL with `DomSanitizer`; a story's render function has no
 * injector, so it uses the function that `DomSanitizer` itself calls.
 */
export const episode = {
  watchUrl: 'https://www.youtube.com/watch?v=Jx7Lq2pT9aE',
  embedUrl: trustResourceUrl(
    'https://www.youtube-nocookie.com/embed/Jx7Lq2pT9aE',
  ) as SafeResourceUrl,
  title: 'Episode 4: The Junction Loft — big north light, tiny elevator',
  playContext: ': Episode 4, The Junction Loft',
};
