#!/usr/bin/env node
// Screenshots HTML mocks for a video's slides, as listed in <folder>/shots.json:
//
//   [{ "name": "list-default", "mock": "pages/studios/default",
//      "viewport": "desktop" | "phone", "focus": "css selector", "clip": "css selector",
//      "pad": 32, "theme": "light" | "dark", "wait": 1200 }]
//
// "focus" scrolls the element to the middle of the viewport. "clip" crops to the
// element plus "pad"; a list of selectors crops to the box around all of them.
// Output: <folder>/img/<name>.jpg.
//
//   node tools/video-shots/capture-shots.mjs docs/videos/NN-topic [name ...]
import { mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launch } from '../video-build/browser.mjs';

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 810 }, deviceScaleFactor: 1.25 },
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const [folderArg, ...only] = process.argv.slice(2);
const folder = resolve(folderArg);
const mocks = resolve('docs/mocks');
const shots = JSON.parse(readFileSync(join(folder, 'shots.json'), 'utf8')).filter((s) => !only.length || only.includes(s.name));
mkdirSync(join(folder, 'img'), { recursive: true });

const browser = await launch();
const contexts = {};
for (const shot of shots) {
  const kind = shot.viewport || 'desktop';
  contexts[kind] ??= await browser.newContext({ ...VIEWPORTS[kind], reducedMotion: 'no-preference' });
  const page = await contexts[kind].newPage();
  const url = `${pathToFileURL(join(mocks, `${shot.mock}.html`))}?chrome=0&theme=${shot.theme || 'light'}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // The mocks scroll smoothly; measuring mid-scroll shifts every crop.
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.waitForTimeout(shot.wait ?? (shot.mock.startsWith('pages/') ? 300 : 1200));
  const path = join(folder, 'img', `${shot.name}.jpg`);
  const selectors = [shot.clip ?? []].flat();
  if (selectors.length) {
    const pad = shot.pad ?? 32;
    const fixed = await page.locator(selectors[0]).first().evaluate((el) => {
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).position === 'fixed' || n.matches('dialog[open]')) return true;
      }
      return false;
    });
    let box = await measure(page, selectors, shot.name);
    if (!fixed) {
      // Make the viewport tall enough for the crop, then scroll the crop to the top.
      const size = page.viewportSize();
      const needed = Math.ceil(box.height + pad * 2);
      if (needed > size.height) await page.setViewportSize({ width: size.width, height: needed });
      await page.evaluate((y) => window.scrollBy(0, y), box.y - pad);
      await page.waitForTimeout(150);
      box = await measure(page, selectors, shot.name);
    }
    const size = page.viewportSize();
    const x = Math.max(0, box.x - pad);
    const y = Math.max(0, box.y - pad);
    const clip = { x, y, width: Math.min(size.width - x, box.width + pad * 2), height: Math.min(size.height - y, box.height + pad * 2) };
    await page.screenshot({ path, clip, type: 'jpeg', quality: 86 });
  } else {
    if (shot.focus) {
      await page.locator(shot.focus).first().evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(150);
    }
    await page.screenshot({ path, type: 'jpeg', quality: 86 });
  }
  await page.close();
  console.log(`${shot.name}  ${shot.mock}`);
}
await browser.close();

// The box around every selector, in viewport coordinates.
async function measure(page, list, name) {
  const boxes = [];
  for (const selector of list) {
    const b = await page.locator(selector).first().boundingBox();
    if (!b) throw new Error(`${name}: "${selector}" is not visible`);
    boxes.push(b);
  }
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return {
    x,
    y,
    width: Math.max(...boxes.map((b) => b.x + b.width)) - x,
    height: Math.max(...boxes.map((b) => b.y + b.height)) - y,
  };
}
