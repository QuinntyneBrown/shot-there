// Parses a video script.md into sections and spoken paragraphs.
// Shared by the audio generator and the video builder.
import { readFileSync } from 'node:fs';

const SPEAKER = /^\*\*([^*]+):\*\*\s+/;
const PAUSE = /^\[pause (\d+(?:\.\d+)?)s\]$/;

export function parseScript(path) {
  const lines = readFileSync(path, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const errors = [];
  const title = lines[0]?.match(/^# (\d{2}) · (.+)$/);
  if (!title) errors.push('line 1: expected "# NN · Title"');

  const sections = [{ title: '', items: [] }];
  let buffer = [];
  const flush = (lineNo) => {
    if (!buffer.length) return;
    const raw = buffer.join(' ').trim();
    buffer = [];
    const speaker = raw.match(SPEAKER);
    const text = speaker ? raw.slice(speaker[0].length) : raw;
    checkText(text, lineNo, errors);
    sections.at(-1).items.push({ type: 'speech', speaker: speaker ? speaker[1] : null, text: clean(text) });
  };

  lines.slice(1).forEach((line, i) => {
    const lineNo = i + 2;
    const trimmed = line.trim();
    if (!trimmed) return flush(lineNo);
    if (trimmed.startsWith('```')) errors.push(`line ${lineNo}: fenced code blocks are not allowed`);
    if (trimmed.startsWith('|')) errors.push(`line ${lineNo}: tables are not allowed`);
    if (trimmed.startsWith('# ')) errors.push(`line ${lineNo}: only one "# " title is allowed`);
    if (trimmed.startsWith('## ')) {
      flush(lineNo);
      sections.push({ title: trimmed.slice(3).trim(), items: [] });
      return;
    }
    const pause = trimmed.match(PAUSE);
    if (pause) {
      flush(lineNo);
      sections.at(-1).items.push({ type: 'pause', seconds: Number(pause[1]) });
      return;
    }
    if (trimmed.startsWith('- ')) {
      flush(lineNo);
      buffer.push(trimmed.slice(2));
      flush(lineNo);
      return;
    }
    buffer.push(trimmed);
  });
  flush(lines.length);

  const used = sections.filter((s, i) => i > 0 || s.items.length);
  for (const s of used) if (!s.items.length) errors.push(`section "${s.title}" has no narration`);
  return {
    number: title?.[1] ?? '00',
    title: title?.[2] ?? '',
    sections: used,
    errors,
  };
}

function checkText(text, lineNo, errors) {
  if (/\[[^\]]+\]\([^)]+\)/.test(text)) errors.push(`line ${lineNo}: links are not allowed`);
  if (/<[a-z/][^>]*>/i.test(text)) errors.push(`line ${lineNo}: HTML is not allowed`);
}

// Display text: markdown emphasis removed, inline code kept as plain text.
export function clean(text) {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\s+/g, ' ').trim();
}

export function words(text) {
  return text.split(/\s+/).filter(Boolean);
}

// Spoken text: pronunciation lexicon applied as whole-word replacements.
export function spoken(text, lexicon) {
  let out = text;
  for (const [from, to] of Object.entries(lexicon)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, 'g'), to);
  }
  return out;
}
