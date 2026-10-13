/** Every app path, relative to the site root. Routes and links read paths from here. */
export const APP_PATHS = {
  home: '',
  studios: 'studios',
  studio: 'studios/:slug',
  spots: 'spots',
  map: 'map',
  compare: 'compare',
  guides: 'guides',
  editorialPolicy: 'editorial-policy'
} as const;
