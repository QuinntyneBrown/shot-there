/** Colours (hex, named, rgb(), hsl()) are read from tokens by role, never written as values (ICD-STY-2). tokens.css is the DS copy that defines them. */
export default {
  ignoreFiles: ['projects/components/styles/tokens.css'],
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
  },
};
