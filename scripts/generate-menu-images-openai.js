/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in .env.local');
  process.exit(1);
}

const MENU_FILE = path.join(process.cwd(), 'src', 'app', 'menu', 'page.tsx');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'menu-ai');
const LOG_FILE = path.join(process.cwd(), 'menu-ai-openai-log.txt');

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getMenuNames() {
  const content = fs.readFileSync(MENU_FILE, 'utf8');
  const matches = [...content.matchAll(/name:\s*'([^']+)'/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

function buildPrompt(name) {
  return [
    `Ultra realistic food photography of ${name}.`,
    'Authentic Andhra South Indian cuisine.',
    'Plated cooked dish ready to eat on a restaurant table.',
    'Natural lighting, appetizing texture, high detail.',
    'No people, no animals, no text, no logo, no watermark.',
  ].join(' ');
}

async function generateOne(name) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: buildPrompt(name),
      size: '1024x1024',
      quality: 'high',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('No b64_json image data returned.');
  }

  return Buffer.from(b64, 'base64');
}

async function run() {
  const names = getMenuNames();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const force = process.env.FORCE_REGENERATE === 'true';
  const logs = [];
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const name of names) {
    const slug = slugify(name);
    const outPath = path.join(OUTPUT_DIR, `${slug}.png`);

    if (!force && fs.existsSync(outPath)) {
      skipped += 1;
      logs.push(`SKIP|${name}|${slug}.png|already-exists`);
      continue;
    }

    try {
      const imageBuffer = await generateOne(name);
      fs.writeFileSync(outPath, imageBuffer);
      ok += 1;
      logs.push(`OK|${name}|${slug}.png|${imageBuffer.length}`);
      console.log(`OK: ${name}`);
    } catch (error) {
      failed += 1;
      logs.push(`FAIL|${name}|${slug}.png|${error.message}`);
      console.error(`FAIL: ${name} -> ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  fs.writeFileSync(LOG_FILE, logs.join('\n') + '\n', 'utf8');
  console.log(`Done. OK=${ok}, SKIP=${skipped}, FAIL=${failed}`);
  console.log(`Log: ${LOG_FILE}`);
}

run().catch((error) => {
  console.error('Generation script failed:', error);
  process.exit(1);
});
