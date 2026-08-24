import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const resource = join(
  root,
  'salesforce/force-app/main/default/staticresources/ReadyCurrentEmbedded'
);
const [html, bundle] = await Promise.all([
  readFile(join(resource, 'index.html'), 'utf8'),
  readFile(join(resource, 'app.js'), 'utf8')
]);

const failures = [];
if (!html.includes('id="readycurrent-embedded-root"')) {
  failures.push('index.html is missing the React mount element');
}
if (!html.includes('href="./app.css"') || !html.includes('src="./app.js"')) {
  failures.push('index.html does not reference the packaged CSS and JavaScript');
}
if (bundle.includes('process.env')) {
  failures.push('app.js contains unresolved Node process.env references');
}
if (!bundle.includes('readycurrent-embedded-root')) {
  failures.push('app.js does not target the packaged mount element');
}

if (failures.length) {
  console.error(`Embedded bundle check failed:\n${failures.map((line) => `- ${line}`).join('\n')}`);
  process.exit(1);
}

console.log('Embedded browser bundle check passed.');
