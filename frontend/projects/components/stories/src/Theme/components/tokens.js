/**
 * The Theme pages render straight from `styles/tokens.css` — the stylesheet
 * the components consume — so they cannot drift from it. `main.ts` serves the
 * styles folder at `/styles`; this reads the light `:root` block (names, raw
 * values and trailing comments) and every preview paints with the live
 * `var(--token)`.
 */
import { useEffect, useState } from 'react';

let pending;

function load() {
  pending ??= fetch('./styles/tokens.css')
    .then((response) => response.text())
    .then(parse);
  return pending;
}

function parse(css) {
  const start = css.indexOf(':root {');
  const block = css.slice(start, css.indexOf('\n}', start));
  const declaration = /--([\w-]+):\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g;
  return [...block.matchAll(declaration)].map(([, name, value, note]) => ({
    name,
    value: value.replace(/\s+/g, ' ').trim(),
    note: note ?? '',
  }));
}

/** The tokens whose names start with any of `prefixes`, in stylesheet order. */
export function useTokens(...prefixes) {
  const [tokens, setTokens] = useState([]);
  const key = prefixes.join('|');
  useEffect(() => {
    let live = true;
    load().then((all) => {
      if (live) setTokens(all.filter((t) => prefixes.some((p) => t.name.startsWith(p))));
    });
    return () => {
      live = false;
    };
  }, [key]);
  return tokens;
}
