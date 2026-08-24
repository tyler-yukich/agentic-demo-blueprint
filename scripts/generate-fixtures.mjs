#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'src/data/generated.json');
const firstNames = ['Avery', 'Jordan', 'Mina', 'Theo', 'Priya', 'Elliot', 'Noor', 'Caleb', 'Sofia', 'Mateo', 'Iris', 'Jonah'];
const lastNames = ['Chen', 'Patel', 'Morrison', 'Laurent', 'Okafor', 'Silva', 'Bennett', 'Ibrahim', 'Park', 'Romero'];
const businessNouns = ['Fieldworks', 'Mechanical', 'Forestry', 'Foods', 'Logistics', 'Surveying', 'Builders', 'Mobility', 'Outfitters', 'Services'];
const businessPlaces = ['Cedar', 'Harbour', 'Summit', 'Granite', 'Maple', 'Pine', 'River', 'North', 'Bright', 'Lake'];
const cities = [
  ['Kingston', 'Ontario'], ['Moncton', 'New Brunswick'], ['Kelowna', 'British Columbia'],
  ['Sherbrooke', 'Quebec'], ['Saskatoon', 'Saskatchewan'], ['Halifax', 'Nova Scotia'],
  ['Sudbury', 'Ontario'], ['Red Deer', 'Alberta'], ['Whitehorse', 'Yukon'], ['Winnipeg', 'Manitoba']
];
const products = ['CurrentPack 2', 'CurrentPack Pro', 'HomeSwitch Mini', 'FieldGrid 8', 'FieldGrid 16'];
const plans = ['Monitor Essentials', 'Monitor Plus', 'Fleet Resilience', 'Inactive'];

function mulberry32(seed) {
  return () => {
    let value = seed += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20260824);
const pick = (values) => values[Math.floor(random() * values.length)];
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const accounts = Array.from({ length: 100 }, (_, index) => {
  const segment = index % 2 === 0 ? 'Business' : 'Household';
  const contactName = `${pick(firstNames)} ${pick(lastNames)}`;
  const [city, region] = pick(cities);
  const name = segment === 'Business'
    ? `${pick(businessPlaces)} ${pick(businessNouns)}`
    : `${contactName} Household`;
  const atRisk = index < 36;
  const eligible = index < 21;
  return {
    id: `RC-${String(index + 1).padStart(3, '0')}`,
    name,
    segment,
    city,
    region,
    contactName,
    email: `${slug(contactName)}@${slug(name)}.example`,
    installedProduct: pick(products),
    monitoringPlan: atRisk ? (index % 3 === 0 ? 'Inactive' : pick(plans)) : pick(plans.slice(0, 3)),
    lastPlanActiveDaysAgo: atRisk ? 370 + Math.floor(random() * 500) : 15 + Math.floor(random() * 280),
    outageExposure: atRisk ? 'Elevated' : index < 68 ? 'Moderate' : 'Low',
    resilienceCreditEligible: eligible,
    annualValue: segment === 'Business' ? 4800 + Math.floor(random() * 28000) : 360 + Math.floor(random() * 1700)
  };
});

const payload = `${JSON.stringify({ seedVersion: 1, accounts }, null, 2)}\n`;
const mode = process.argv[2];
if (mode === '--write') {
  await writeFile(outputPath, payload);
  console.log(`wrote ${path.relative(root, outputPath)}`);
} else if (mode === '--check') {
  const current = await readFile(outputPath, 'utf8').catch(() => '');
  if (current !== payload) {
    console.error('generated fixtures are stale; run npm run fixtures:write and review the diff');
    process.exit(1);
  }
  console.log('generated fixtures are current');
} else {
  console.error('usage: generate-fixtures.mjs --write|--check');
  process.exit(2);
}
