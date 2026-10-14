/**
 * Small React blocks for the Theme MDX pages (docs pages render with React
 * even in an Angular Storybook). Written with `createElement` so they need no
 * JSX transform. Every preview paints with the live `var(--token)`, so what
 * you see is the live stylesheet, not a copy of it.
 */
import { createElement as h } from 'react';

import { useTokens } from './tokens';

const code = { font: 'var(--text-code)' };
const muted = { color: 'var(--color-fg-muted)', font: 'var(--text-body-sm)' };
const row = {
  display: 'grid',
  gridTemplateColumns: 'minmax(160px, 300px) 1fr',
  gap: 16,
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid var(--color-border-default)',
};

function Meta({ token }) {
  return h(
    'div',
    null,
    h('code', { style: { ...code, fontWeight: 600 } }, `--${token.name}`),
    h('div', { style: muted }, token.value),
    token.note ? h('div', { style: muted }, token.note) : null,
  );
}

/** Colour swatches in a responsive grid. */
export function ColorGrid({ prefix }) {
  const tokens = useTokens(...[prefix].flat());
  return h(
    'div',
    {
      className: 'sb-unstyled',
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
        margin: '16px 0 32px',
      },
    },
    tokens.map((t) =>
      h(
        'div',
        {
          key: t.name,
          style: {
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--color-bg-surface)',
          },
        },
        h('div', {
          style: {
            height: 72,
            background: `var(--${t.name})`,
            borderBottom: '1px solid var(--color-border-default)',
          },
        }),
        h('div', { style: { padding: 12 } }, h(Meta, { token: t })),
      ),
    ),
  );
}

/** One row per token with a live preview rendered by `preview(token)`. */
export function TokenRows({ prefix, preview }) {
  const tokens = useTokens(...[prefix].flat());
  return h(
    'div',
    { className: 'sb-unstyled', style: { margin: '16px 0 32px' } },
    tokens.map((t) =>
      h('div', { key: t.name, style: row }, h(Meta, { token: t }), h('div', null, preview(t))),
    ),
  );
}

export const previews = {
  text: (t) => h('span', { style: { font: `var(--${t.name})` } }, 'Kensington Window Room'),
  fontSize: (t) =>
    h(
      'span',
      { style: { fontSize: `var(--${t.name})`, lineHeight: 'var(--line-height-tight)' } },
      'Liberty Village Loft',
    ),
  fontWeight: (t) =>
    h(
      'span',
      { style: { fontWeight: `var(--${t.name})`, fontSize: 'var(--font-size-lg)' } },
      'Show 7 studios',
    ),
  fontFamily: (t) =>
    h(
      'span',
      { style: { fontFamily: `var(--${t.name})`, fontSize: 'var(--font-size-2xl)' } },
      'Aa Bb Cc 0123',
    ),
  lineHeight: (t) =>
    h(
      'p',
      {
        style: {
          lineHeight: `var(--${t.name})`,
          maxWidth: 320,
          margin: 0,
          padding: 8,
          background: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-sm)',
        },
      },
      'North-facing windows, a white cyc wall and a freight elevator to the loading dock.',
    ),
  space: (t) =>
    h('div', {
      style: {
        width: `max(2px, var(--${t.name}))`,
        height: 16,
        background: 'var(--color-accent)',
        borderRadius: 2,
      },
    }),
  radius: (t) =>
    h('div', {
      style: {
        width: 96,
        height: 56,
        borderRadius: `var(--${t.name})`,
        background: 'var(--color-accent-subtle)',
        border: '1px solid var(--color-accent)',
      },
    }),
  shadow: (t) =>
    h('div', {
      style: {
        width: 140,
        height: 72,
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-bg-surface-raised)',
        boxShadow: `var(--${t.name})`,
      },
    }),
  duration: (t) =>
    h(
      'div',
      { className: 'st-motion-demo', style: { '--_duration': `var(--${t.name})` } },
      h('div', { className: 'st-motion-demo__dot' }),
    ),
  ease: (t) =>
    h(
      'div',
      { className: 'st-motion-demo', style: { '--_ease': `var(--${t.name})` } },
      h('div', { className: 'st-motion-demo__dot' }),
    ),
  size: (t) =>
    h('div', {
      style: {
        width: `min(100%, var(--${t.name}))`,
        height: `min(48px, var(--${t.name}))`,
        background: 'var(--color-success-bg)',
        border: '1px solid var(--color-success-border)',
        borderRadius: 4,
      },
    }),
  none: () => null,
};
