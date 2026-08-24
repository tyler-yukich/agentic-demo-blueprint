import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const excluded = new Set(['.git', 'node_modules', 'dist', '.sf', '.sfdx']);
const textExtensions = new Set(['.md', '.json', '.jsonc', '.js', '.mjs', '.ts', '.tsx', '.css', '.html', '.xml', '.cls', '.trigger', '.apex', '.svg', '.yml', '.yaml', '.example', '.gitignore']);
const forbiddenFragments = [
  ['Road', 'post'], ['Road', 'home'], ['Road', 'ie'], ['Thunder', ' Bay'],
  ['Ridge', 'line'], ['ZO', 'LEO'], ['Adrian', ' Mercer'], ['Maya', ' Ellison']
].map((parts) => parts.join(''));
const secretPatterns = [
  /xox[baprs]-[A-Za-z0-9-]{20,}/g,
  /00D[A-Za-z0-9]{12,15}![A-Za-z0-9._-]{20,}/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /(?:client_secret|consumer_secret|password)\s*[:=]\s*['"][^'"$<{][^'"]{7,}['"]/gi
];
const identifierPatterns = [
  /\bC[A-Z0-9]{8,}\b/g,
  /\bT[A-Z0-9]{8,}\b/g,
  /\bE[A-Z0-9]{8,}\b/g,
  /\b(?:00D|005|001|003|00O|0PS)[A-Za-z0-9]{12,15}\b/g
];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (textExtensions.has(extname(entry.name)) || entry.name.startsWith('.env') || entry.name === '.gitignore') files.push(path);
  }
  return files;
}

const failures = [];
for (const file of await walk(root)) {
  const rel = relative(root, file);
  if (rel === 'scripts/public-safety.mjs') continue;
  const text = await readFile(file, 'utf8');
  for (const term of forbiddenFragments) if (text.toLowerCase().includes(term.toLowerCase())) failures.push(`${rel}: private-source term detected`);
  for (const pattern of [...secretPatterns, ...identifierPatterns]) if (pattern.test(text)) failures.push(`${rel}: secret or environment identifier pattern detected`);
  const emails = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
  for (const email of emails) if (!email.toLowerCase().endsWith('.example')) failures.push(`${rel}: non-reserved email address ${email}`);
}

if (failures.length) {
  console.error(`Public-safety check failed:\n${[...new Set(failures)].map((line) => `- ${line}`).join('\n')}`);
  process.exit(1);
}
console.log('Public-safety check passed.');
