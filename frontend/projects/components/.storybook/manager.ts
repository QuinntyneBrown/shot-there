import { addons } from 'storybook/manager-api';

import shotThereTheme from './theme';

addons.setConfig({
  theme: shotThereTheme,
  // Docs-first like the Fluent docsite: the addon panel opens on demand.
  showPanel: false,
  sidebar: {
    showRoots: true,
  },
});
