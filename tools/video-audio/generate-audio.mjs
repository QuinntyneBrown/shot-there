#!/usr/bin/env node
// Synthesizes a video's script.md to NN-topic.mp3 with free edge-tts and writes
// a timing manifest to docs/videos/.cache/<folder>/manifest.json.
//
//   node tools/video-audio/generate-audio.mjs docs/videos/NN-topic --dry-run
//   node tools/video-audio/generate-audio.mjs docs/videos/NN-topic
//   node tools/video-audio/generate-audio.mjs --say "ShotThere" --out .cache/test.mp3
//
// Env: PYTHON (default python3), EDGE_VOICE, EDGE_VOICE_2, FFMPEG_PATH.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseScript, spoken, words } from './script.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const PYTHON = process.env.PYTHON || 'python3';
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const FFPROBE = process.env.FFMPEG_PATH ? join(dirname(process.env.FFMPEG_PATH), 'ffprobe') : 'ffprobe';
const VOICE = process.env.EDGE_VOICE || 'en-US-AndrewMultilingualNeural';
const VOICE_2 = process.env.EDGE_VOICE_2 || 'en-US-AvaMultilingualNeural';
const WPM = 150;
const GAP_PARAGRAPH = 0.45;
const GAP_SECTION = 0.9;
const lexicon = JSON.parse(readFileSync(join(here, 'pronunciations.json'), 'utf8'));

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

if (option('--say')) {
  const out = resolve(option('--out') || '.cache/say.mp3');
  mkdirSync(dirname(out), { recursive: true });
  tts(spoken(option('--say'), lexicon), VOICE, out);
  console.log(`wrote ${out}`);
  process.exit(0);
}

const folder = resolve(args.find((a) => !a.startsWith('--')) || '');
const script = parseScript(join(folder, 'script.md'));
if (script.errors.length) {
  console.error(script.errors.join('\n'));
  process.exit(1);
}

let total = 0;
for (const s of script.sections) {
  const count = s.items.reduce((n, item) => n + (item.type === 'speech' ? words(item.text).length : 0), 0);
  const pauses = s.items.reduce((n, item) => n + (item.type === 'pause' ? item.seconds : 0), 0);
  const seconds = (count / WPM) * 60 + pauses;
  total += count;
  console.log(`${(s.title || '(intro)').padEnd(40)} ${String(count).padStart(5)} words  ~${fmt(seconds)}`);
  if (seconds > 9 * 60) console.warn(`  warning: section "${s.title}" is over 9 minutes`);
}
console.log(`${'Total'.padEnd(40)} ${String(total).padStart(5)} words  ~${fmt((total / WPM) * 60)}`);
if (flag('--dry-run')) process.exit(0);

const name = basename(folder);
const cache = join(folder, '..', '.cache', name);
mkdirSync(join(cache, 'audio'), { recursive: true });

const clips = [];
const manifest = { title: script.title, sections: [] };
let t = 0;
script.sections.forEach((section, si) => {
  if (si > 0) t += pushSilence(GAP_SECTION);
  const entry = { title: section.title, start: t, paragraphs: [] };
  section.items.forEach((item, pi) => {
    if (pi > 0) t += pushSilence(GAP_PARAGRAPH);
    if (item.type === 'pause') {
      t += pushSilence(item.seconds);
      return;
    }
    const voice = item.speaker ? VOICE_2 : VOICE;
    const say = spoken(item.text, lexicon);
    const key = createHash('sha1').update(`${voice}\n${say}`).digest('hex').slice(0, 16);
    const mp3 = join(cache, 'audio', `${key}.mp3`);
    const wav = join(cache, 'audio', `${key}.wav`);
    if (!existsSync(wav)) {
      tts(say, voice, mp3);
      run(FFMPEG, ['-y', '-loglevel', 'error', '-i', mp3, '-ar', '24000', '-ac', '1', wav]);
    }
    const d = duration(wav);
    clips.push(wav);
    entry.paragraphs.push({ text: item.text, speaker: item.speaker, start: t, end: t + d });
    t += d;
  });
  entry.end = t;
  manifest.sections.push(entry);
});
manifest.duration = t;

const list = join(cache, 'concat.txt');
writeFileSync(list, clips.map((c) => `file '${c}'`).join('\n'));
const out = join(folder, `${name}.mp3`);
run(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'libmp3lame', '-b:a', '128k', out]);
writeFileSync(join(cache, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`wrote ${out} (${fmt(duration(out))})`);

function pushSilence(seconds) {
  const wav = join(cache, 'audio', `silence-${seconds}.wav`);
  if (!existsSync(wav)) {
    run(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', String(seconds), wav]);
  }
  clips.push(wav);
  return duration(wav);
}

function tts(text, voice, out) {
  run(PYTHON, ['-m', 'edge_tts', '--voice', voice, '--text', text, '--write-media', out]);
}

function duration(file) {
  return Number(execFileSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
}

function run(cmd, argv) {
  execFileSync(cmd, argv, { stdio: ['ignore', 'ignore', 'inherit'] });
}

function fmt(seconds) {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
