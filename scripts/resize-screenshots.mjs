#!/usr/bin/env node
/**
 * Resize source screenshots into optimized WebP for project cards.
 *
 *   Usage: npm run resize-screenshots
 *
 * Drop new source images into ./screenshots/<filename>.PNG, add a row to
 * MAPPINGS below mapping the filename to a project slug from
 * src/content/projects.ts, then run this script.
 *
 * Source images are gitignored — only the optimized WebP in
 * public/projects/ is committed.
 */

import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SRC_DIR = path.join(ROOT, 'screenshots');
const OUT_DIR = path.join(ROOT, 'public', 'projects');
const BRAND_DIR = path.join(ROOT, 'public', 'brand');

/**
 * [sourceFilename, outputName]
 *
 * Output name conventions:
 *  - `<slug>` → primary cover (referenced as `cover` in projects.ts)
 *  - `<slug>-1`, `<slug>-2`, ... → additional shots for the modal `gallery`
 */
const MAPPINGS = [
  ['dogs-and-newsletter.PNG', 'dogs-and-llamas'],
  ['dogs-and-llamas.PNG',     'dogs-and-llamas-1'],
  ['dogs-and-llamas-reviews.PNG',  'dogs-and-llamas-2'],
  ['dogs-and-llamas-calendar.PNG', 'dogs-and-llamas-3'],

  ['cookbook_homescreen.PNG', 'llamas-cookbook'],
  ['cookbook_timer.PNG', 'llamas-cookbook-1'],

  ['bite-defense-desktop.PNG',   'bite-defense'],
  ['bite-defense-desktop-2.PNG', 'bite-defense-web-1'],
  ['bitedefense_layout.PNG', 'bite-defense-1'],
  ['bitedefense_tut.PNG',    'bite-defense-2'],

  ['sleepy-llamas.PNG',          'sleepy-llamas'],
  ['sleepy-llamas-landing.PNG',  'sleepy-llamas-1'],
  ['sleepy-llamas-packages.PNG', 'sleepy-llamas-2'],

  ['train-watcher.PNG', 'train-watcher'],
];

/**
 * Brand assets — square logos, smaller max dim, output to public/brand/.
 *
 * [sourceFilename, outputName]
 */
const BRAND_MAPPINGS = [
  ['Official_Llama_Logo.PNG', 'llama-logo'],
];

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1200;
const WEBP_QUALITY = 82;

const BRAND_MAX = 512;
const BRAND_QUALITY = 92;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(BRAND_DIR, { recursive: true });

  const results = [];
  for (const [filename, slug] of MAPPINGS) {
    const inPath = path.join(SRC_DIR, filename);
    const outPath = path.join(OUT_DIR, `${slug}.webp`);

    try {
      await fs.access(inPath);
    } catch {
      console.warn(`skip: ${filename} (not found)`);
      continue;
    }

    const inSize = (await fs.stat(inPath)).size;

    const meta = await sharp(inPath).metadata();
    await sharp(inPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath);

    const outSize = (await fs.stat(outPath)).size;
    const outMeta = await sharp(outPath).metadata();
    results.push({
      filename,
      slug,
      inSize,
      outSize,
      inDims: `${meta.width}×${meta.height}`,
      outDims: `${outMeta.width}×${outMeta.height}`,
    });
  }

  for (const [filename, slug] of BRAND_MAPPINGS) {
    const inPath = path.join(SRC_DIR, filename);
    const outPath = path.join(BRAND_DIR, `${slug}.webp`);

    try {
      await fs.access(inPath);
    } catch {
      console.warn(`skip brand: ${filename} (not found)`);
      continue;
    }

    const inSize = (await fs.stat(inPath)).size;
    const meta = await sharp(inPath).metadata();
    await sharp(inPath)
      .resize(BRAND_MAX, BRAND_MAX, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: BRAND_QUALITY })
      .toFile(outPath);

    const outSize = (await fs.stat(outPath)).size;
    const outMeta = await sharp(outPath).metadata();
    results.push({
      filename,
      slug: `brand/${slug}`,
      inSize,
      outSize,
      inDims: `${meta.width}×${meta.height}`,
      outDims: `${outMeta.width}×${outMeta.height}`,
    });
  }

  console.log('\nResults:\n');
  for (const r of results) {
    const inKb = (r.inSize / 1024).toFixed(0);
    const outKb = (r.outSize / 1024).toFixed(0);
    const ratio = ((r.outSize / r.inSize) * 100).toFixed(0);
    console.log(
      `  ${r.slug.padEnd(24)} ${r.inDims.padEnd(12)} → ${r.outDims.padEnd(12)}  ${inKb.padStart(5)}kb → ${outKb.padStart(5)}kb (${ratio}%)`,
    );
  }
  console.log();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
