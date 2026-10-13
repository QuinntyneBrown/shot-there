// Launches headless Chromium through Playwright. EDGE_PATH overrides the browser.
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

async function playwright() {
  try {
    return await import('playwright');
  } catch {
    const root = execSync('npm root -g').toString().trim();
    return createRequire(join(root, 'noop.js'))('playwright');
  }
}

export async function launch() {
  const { chromium } = await playwright();
  const executablePath = process.env.EDGE_PATH || undefined;
  return chromium.launch({ executablePath });
}
