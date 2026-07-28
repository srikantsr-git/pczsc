/**
 * inject-photos.mjs
 * Reads committee photos from public/committee/, converts to base64 data URLs,
 * and updates CMSContext.tsx (committee members) + defaultPEDirectors.ts (PE directors).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photoDir = path.join(__dirname, 'public', 'committee');

function toDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/jpeg';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

// Build a map: filename (no ext, lowercase) => data URL
const photoMap = {};
const files = fs.readdirSync(photoDir);
for (const f of files) {
  const fullPath = path.join(photoDir, f);
  if (fs.statSync(fullPath).isFile()) {
    const key = path.basename(f, path.extname(f)).toLowerCase().trim();
    photoMap[key] = toDataUrl(fullPath);
    console.log(`Loaded: ${f} => key="${key}"`);
  }
}

// ---- COMMITTEE MEMBER MAPPINGS ----
// key = lookup key in photoMap, value = id in CMSContext
const committeeMappings = [
  { id: 'cm-1',  key: 'prin. dr. iqbal n. shaikh' },
  { id: 'cm-2',  key: 'drshaikh' },
  { id: 'cm-3',  key: 'profamrule' },
  { id: 'cm-4',  key: 'prof.bengle' },
  { id: 'cm-5',  key: 'mr.sharma' },
  { id: 'cm-6',  key: 'dr.bibave' },
  { id: 'cm-7',  key: 'dr chikte' },
  { id: 'cm-8',  key: 'prof.dhamale' },
  { id: 'cm-9',  key: 'dr.shendkar' },
  { id: 'cm-10', key: 'dr.more' },
  { id: 'cm-11', key: 'dr.kondhare' },
  { id: 'cm-12', key: 'mrparse' },
  { id: 'cm-13', key: 'dr.abhijeetkadam' },
  { id: 'cm-14', key: 'mrtribhuvan' },
];

// ---- PE DIRECTOR MAPPINGS ----
const peMappings = [
  { id: 'pe-1',  key: 'dr chikte' },
  { id: 'pe-2',  key: 'prof.dhamale' },
  { id: 'pe-4',  key: 'dr.shendkar' },
  { id: 'pe-5',  key: 'prof.bengle' },
  { id: 'pe-6',  key: 'profamrule' },
  { id: 'pe-7',  key: 'drshaikh' },
  { id: 'pe-8',  key: 'dr. shelke sudam' },
  { id: 'pe-9',  key: 'dr. pawar gurunath' },
  { id: 'pe-10', key: 'dr.more' },
  { id: 'pe-11', key: 'dr. phale vikram' },
  { id: 'pe-12', key: 'dr. augustine anjushree' },
  { id: 'pe-13', key: 'dr. pawar yogesh' },
  { id: 'pe-14', key: 'dube rishi rajendra' },
  { id: 'pe-15', key: 'girigosavi amit' },
  { id: 'pe-16', key: 'dr.abhijeetkadam' },
  { id: 'pe-17', key: 'dr. patil gauri' },
  { id: 'pe-18', key: 'dr. tambe rohit prakash' },
  { id: 'pe-19', key: 'patare mukundraj ashokrao' },
  { id: 'pe-21', key: 'mrtribhuvan' },
  { id: 'pe-22', key: 'banne namadev' },
  { id: 'pe-23', key: 'gujar tushar anil' },
  { id: 'pe-24', key: 'mr.sharma' },
  { id: 'pe-25', key: 'garg abhijeet rajendraprasad' },
  { id: 'pe-27', key: 'dr. morey deepali' },
  { id: 'pe-28', key: 'dr.kondhare' },
  { id: 'pe-29', key: 'sarode navanath' },
  { id: 'pe-30', key: 'shinde gautam raghunath' },
];

// Extra PE directors from desktop root
const desktopExtras = [
  { id: 'pe-extra-nimbalkar', key: 'dr. rajenimbalkar' },
  { id: 'pe-extra-deshpande', key: 'deshpande amruta nikhil' },
  { id: 'pe-extra-jadhav',    key: 'jadhav ekta ashok' },
  { id: 'pe-extra-patil',     key: 'patil nishigandha rameshwar' },
  { id: 'pe-extra-tikone',    key: 'tikone prasad' },
  { id: 'pe-extra-sachin',    key: 'sachinshinde' },
  { id: 'pe-extra-nikam',     key: 'nikam rahul sadashiv' },
];

function resolveKey(key) {
  // Try exact match first
  if (photoMap[key]) return photoMap[key];
  // Try with trailing space stripped
  const stripped = key.replace(/\s+$/, '');
  if (photoMap[stripped]) return photoMap[stripped];
  // Partial match
  const found = Object.keys(photoMap).find(k => k.includes(stripped) || stripped.includes(k));
  if (found) { console.log(`  Partial match: "${key}" => "${found}"`); return photoMap[found]; }
  console.warn(`  WARNING: No photo found for key="${key}"`);
  return null;
}

// Output summary
console.log('\n=== COMMITTEE MEMBER PHOTO MATCHES ===');
for (const m of committeeMappings) {
  const url = resolveKey(m.key);
  console.log(`${m.id}: ${url ? 'FOUND ✓' : 'MISSING ✗'} (key="${m.key}")`);
}

console.log('\n=== PE DIRECTOR PHOTO MATCHES ===');
for (const m of peMappings) {
  const url = resolveKey(m.key);
  console.log(`${m.id}: ${url ? 'FOUND ✓' : 'MISSING ✗'} (key="${m.key}")`);
}

// Write output JSON for use in patching
const output = {
  committee: {},
  pe: {}
};

for (const m of committeeMappings) {
  const url = resolveKey(m.key);
  if (url) output.committee[m.id] = url;
}
for (const m of [...peMappings, ...desktopExtras]) {
  const url = resolveKey(m.key);
  if (url) output.pe[m.id] = url;
}

fs.writeFileSync(
  path.join(__dirname, 'photo-data.json'),
  JSON.stringify({ committee: Object.fromEntries(Object.entries(output.committee).map(([k, v]) => [k, v.substring(0, 60) + '...'])),
                   pe: Object.fromEntries(Object.entries(output.pe).map(([k, v]) => [k, v.substring(0, 60) + '...'])) }),
  'utf-8'
);

console.log('\n=== RESULTS ===');
console.log(`Committee photos matched: ${Object.keys(output.committee).length}/${committeeMappings.length}`);
console.log(`PE director photos matched: ${Object.keys(output.pe).length}/${peMappings.length}`);

// --- Now patch the source files ---
// Patch CMSContext.tsx: replace photo URLs for committee members
let cmsContent = fs.readFileSync(path.join(__dirname, 'src', 'context', 'CMSContext.tsx'), 'utf-8');

for (const m of committeeMappings) {
  const url = resolveKey(m.key);
  if (!url) continue;
  // Match the photo line for this specific id block
  // Pattern: id: 'cm-X', ... photo: 'OLD_URL' within the same object
  // We'll use a regex that matches the photo field in the block with this id
  const idPattern = new RegExp(
    `(id:\\s*'${m.id}'[^}]*?photo:\\s*')[^'"]*(')`,
    's'
  );
  if (idPattern.test(cmsContent)) {
    cmsContent = cmsContent.replace(idPattern, `$1${url}$2`);
    console.log(`✓ Patched CMSContext: ${m.id}`);
  } else {
    console.warn(`✗ Could not find pattern for ${m.id} in CMSContext.tsx`);
  }
}

fs.writeFileSync(path.join(__dirname, 'src', 'context', 'CMSContext.tsx'), cmsContent, 'utf-8');
console.log('✓ CMSContext.tsx updated');

// Patch defaultPEDirectors.ts: replace photo URLs for PE directors
let peContent = fs.readFileSync(path.join(__dirname, 'src', 'data', 'defaultPEDirectors.ts'), 'utf-8');

for (const m of [...peMappings, ...desktopExtras]) {
  const url = resolveKey(m.key);
  if (!url) continue;
  const idPattern = new RegExp(
    `(id:\\s*'${m.id}'[^}]*?photo:\\s*')[^']*(')`,
    's'
  );
  if (idPattern.test(peContent)) {
    peContent = peContent.replace(idPattern, `$1${url}$2`);
    console.log(`✓ Patched PE director: ${m.id}`);
  } else {
    console.warn(`✗ Could not find pattern for ${m.id} in defaultPEDirectors.ts`);
  }
}

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'defaultPEDirectors.ts'), peContent, 'utf-8');
console.log('✓ defaultPEDirectors.ts updated');

console.log('\nDone! Please also clear localStorage key pczsc_committee_members and pczsc_pe_directors in browser devtools for the new photos to load.');
