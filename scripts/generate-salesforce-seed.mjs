#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturePath = path.join(root, 'src/data/generated.json');
const resourcePath = path.join(root, 'salesforce/force-app/main/default/staticresources/ReadyCurrentFixtures.resource');
const scriptPath = path.join(root, 'salesforce/scripts/seed.apex');
const fixture = await readFile(fixturePath, 'utf8');
const script = "ReadyCurrentSeeder.seed();\n";
const mode = process.argv[2];

if (mode === '--write') {
  await writeFile(resourcePath, fixture);
  await writeFile(scriptPath, script);
  console.log(`wrote ${path.relative(root, resourcePath)} and ${path.relative(root, scriptPath)}`);
} else if (mode === '--check') {
  const currentResource = await readFile(resourcePath, 'utf8').catch(() => '');
  const currentScript = await readFile(scriptPath, 'utf8').catch(() => '');
  if (currentResource !== fixture || currentScript !== script) {
    console.error('Salesforce seed assets are stale; run npm run salesforce:seed:write and review the diff');
    process.exit(1);
  }
  console.log('Salesforce seed assets are current');
} else {
  console.error('usage: generate-salesforce-seed.mjs --write|--check');
  process.exit(2);
}
