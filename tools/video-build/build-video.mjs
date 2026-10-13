#!/usr/bin/env node
// Builds NN-topic.mp4 from slides.html, the narration MP3 and its timing manifest.
//
//   node tools/video-build/build-video.mjs docs/videos/NN-topic --check
//   node tools/video-build/build-video.mjs docs/videos/NN-topic --slides-only
//   node tools/video-build/build-video.mjs docs/videos/NN-topic
//
// Env: EDGE_PATH (browser), FFMPEG_PATH.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseScript, words } from '../video-audio/script.mjs';
import { launch } from './browser.mjs';

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const WPM = 150;
const args = process.argv.slice(2);
const folder = resolve(args.find((a) => !a.startsWith('--')));
const name = basename(folder);
const cache = join(folder, '..', '.cache', name);
mkdirSync(join(cache, 'slides'), { recursive: true });

const script = parseScript(join(folder, 'script.md'));
if (script.errors.length) fail(script.errors.join('\n'));
const manifestPath = join(cache, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : estimate(script);
if (!existsSync(manifestPath)) console.warn('No timing manifest yet: times below are estimates at 150 words per minute.');

const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const deck = pathToFileURL(join(folder, 'slides.html')).href;
await page.goto(deck, { waitUntil: 'load' });
const slides = await page.$$eval('body > section', (els) => els.map((s) => ({ id: s.id, cue: s.dataset.cue || null })));

// Resolve each cue to a time.
const paragraphs = manifest.sections.flatMap((s) => s.paragraphs);
const times = slides.map((slide, i) => {
  if (i === 0) {
    if (slide.cue) fail(`slide 1 (${slide.id}) must not have a data-cue`);
    return 0;
  }
  if (!slide.cue) fail(`slide ${i + 1} (${slide.id}) has no data-cue`);
  const cue = norm(slide.cue);
  const hits = [];
  for (const s of manifest.sections) if (norm(s.title) === cue) hits.push(s.start);
  for (const p of paragraphs) {
    const text = norm(p.text);
    const at = text.indexOf(cue);
    if (at < 0) continue;
    if (text.indexOf(cue, at + 1) >= 0) fail(`slide ${i + 1}: cue "${slide.cue}" appears twice in one paragraph`);
    const before = words(text.slice(0, at)).length;
    hits.push(p.start + (before / words(text).length) * (p.end - p.start));
  }
  if (hits.length !== 1) fail(`slide ${i + 1} (${slide.id}): cue "${slide.cue}" found ${hits.length} times in script.md`);
  return hits[0];
});
times.forEach((t, i) => {
  if (i && t <= times[i - 1]) fail(`slide ${i + 1} (${slides[i].id}) is cued before slide ${i}`);
});

console.log('Slide  Start  Length  Id');
let problems = 0;
times.forEach((t, i) => {
  const end = i + 1 < times.length ? times[i + 1] : manifest.duration;
  const len = end - t;
  const warn = len < 4 ? '  <- under 4 s' : len > 90 ? '  <- over 90 s' : '';
  if (warn) problems++;
  console.log(`${String(i + 1).padStart(5)}  ${fmt(t).padStart(5)}  ${len.toFixed(1).padStart(6)}  ${slides[i].id}${warn}`);
});
console.log(`${slides.length} slides, ${fmt(manifest.duration)} total${problems ? `, ${problems} timing warning(s)` : ''}`);
if (args.includes('--check')) {
  await browser.close();
  process.exit(0);
}

for (let i = 0; i < slides.length; i++) {
  await page.goto(`${deck}?slide=${i + 1}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((im) => im.decode().catch(() => {}))));
  await page.screenshot({ path: join(cache, 'slides', `${String(i + 1).padStart(3, '0')}.png`) });
}
await browser.close();
console.log(`rendered ${slides.length} slides to ${join(cache, 'slides')}`);
if (args.includes('--slides-only')) process.exit(0);

if (!existsSync(manifestPath)) fail('Run tools/video-audio/generate-audio.mjs first: the full build needs the narration and its timings.');
const audio = join(folder, `${name}.mp3`);

const list = times.map((t, i) => {
  const end = i + 1 < times.length ? times[i + 1] : manifest.duration + 0.5;
  return `file '${join(cache, 'slides', `${String(i + 1).padStart(3, '0')}.png`)}'\nduration ${(end - t).toFixed(3)}`;
});
list.push(`file '${join(cache, 'slides', `${String(slides.length).padStart(3, '0')}.png`)}'`);
writeFileSync(join(cache, 'slides.txt'), list.join('\n'));
writeFileSync(join(cache, 'captions.ass'), captions(manifest));

const out = join(folder, `${name}.mp4`);
execFileSync(FFMPEG, [
  '-y', '-loglevel', 'error',
  '-f', 'concat', '-safe', '0', '-i', join(cache, 'slides.txt'),
  '-i', audio,
  '-vf', `fps=30,format=yuv420p,ass=${join(cache, 'captions.ass')}`,
  '-c:v', 'libx264', '-preset', 'medium', '-tune', 'stillimage', '-crf', '22',
  '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart',
  out,
], { stdio: 'inherit' });
console.log(`wrote ${out}`);

// Caption lines of at most ~12 words, broken at sentence and clause ends.
function captions(m) {
  const events = [];
  for (const p of m.sections.flatMap((s) => s.paragraphs)) {
    const ws = words(p.text);
    const chunks = [];
    let cur = [];
    ws.forEach((w, k) => {
      cur.push(w);
      const end = /[.!?]$/.test(w) || (/[,;:]$/.test(w) && cur.length >= 6) || cur.length >= 12;
      if (end || k === ws.length - 1) {
        chunks.push(cur);
        cur = [];
      }
    });
    const per = (p.end - p.start) / ws.length;
    let t = p.start;
    for (const c of chunks) {
      const d = c.length * per;
      events.push(`Dialogue: 0,${ass(t)},${ass(t + d)},Caption,,0,0,0,,${c.join(' ').replace(/[{}\\]/g, '')}`);
      t += d;
    }
  }
  return `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,Inter,46,&H00FFFFFF,&H00FFFFFF,&H2A17171A,&H00000000,0,0,0,0,100,100,0,0,3,14,0,2,200,200,42,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events.join('\n')}
`;
}

function estimate(s) {
  let t = 0;
  const sections = s.sections.map((sec) => {
    const start = t;
    const paragraphs = [];
    for (const item of sec.items) {
      const d = item.type === 'pause' ? item.seconds : (words(item.text).length / WPM) * 60;
      if (item.type === 'speech') paragraphs.push({ text: item.text, start: t, end: t + d });
      t += d;
    }
    return { title: sec.title, start, end: t, paragraphs };
  });
  return { sections, duration: t };
}

function norm(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}$\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function ass(t) {
  const cs = Math.round(t * 100);
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
}

function fmt(seconds) {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
