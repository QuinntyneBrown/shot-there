import { create } from 'storybook/theming';

/**
 * Brands the Storybook manager with the ShotThere tokens. The manager runs
 * outside the preview iframe, so manager-head.html links tokens.css and the
 * theme reads each role from the manager document.
 * See https://storybook.js.org/docs/configure/user-interface/theming
 */
const root = getComputedStyle(document.documentElement);
const token = (name: string) => root.getPropertyValue(`--${name}`).trim();
const px = (name: string) => parseFloat(token(name)) * 16;
const dark = matchMedia('(prefers-color-scheme: dark)').matches;

const theme = create({
  base: dark ? 'dark' : 'light',

  colorPrimary: token('color-accent'),
  colorSecondary: token('color-accent'),

  // UI
  appBg: token('color-bg-surface-sunken'),
  appContentBg: token('color-bg-surface'),
  appPreviewBg: token('color-bg-canvas'),
  appBorderColor: token('color-border-default'),
  appBorderRadius: px('radius-sm'),

  // Fonts
  fontBase: token('font-family-sans'),
  fontCode: token('font-family-mono'),

  // Text colors
  textColor: token('color-fg-default'),
  textMutedColor: token('color-fg-muted'),
  textInverseColor: token('color-fg-inverse'),

  // Toolbar default and active colors
  barTextColor: token('color-fg-muted'),
  barSelectedColor: token('color-fg-accent'),
  barHoverColor: token('color-accent-hover'),
  barBg: token('color-bg-surface'),

  // Form colors
  inputBg: token('color-bg-surface'),
  inputBorder: token('color-border-strong'),
  inputTextColor: token('color-fg-default'),
  inputBorderRadius: px('radius-sm'),

  brandTitle: 'ShotThere Design System',
  brandUrl: 'https://github.com/quinntynebrown/shot-there',
  brandTarget: '_self',
});

export default theme;
