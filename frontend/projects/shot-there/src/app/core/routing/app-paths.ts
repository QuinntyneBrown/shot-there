/** Every app path, relative to the site root. Routes and links read paths from here. */
export const APP_PATHS = {
  home: '',
  studios: 'studios',
  studio: 'studios/:slug',
  compare: 'compare'
} as const;
