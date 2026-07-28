/**
 * inject-photos-pe.mjs
 * Patches defaultPEDirectors.ts with real base64 photos.
 * Uses a simpler block-based replacement approach.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photoDir = path.join(__dirname, 'public', 'committee');

function toDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

// Build photo map
const photoMap = {};
const files = fs.readdirSync(photoDir);
for (const f of files) {
  const fullPath = path.join(photoDir, f);
  if (fs.statSync(fullPath).isFile()) {
    const key = path.basename(f, path.extname(f)).toLowerCase().trim().replace(/\s+/g, ' ');
    photoMap[key] = toDataUrl(fullPath);
  }
}

function resolveKey(key) {
  const k = key.toLowerCase().trim().replace(/\s+/g, ' ');
  if (photoMap[k]) return photoMap[k];
  // Try stripping trailing space variant
  const stripped = k.replace(/\s+$/, '');
  if (photoMap[stripped]) return photoMap[stripped];
  // Partial
  const found = Object.keys(photoMap).find(pk => pk.startsWith(stripped) || stripped.startsWith(pk));
  if (found) return photoMap[found];
  return null;
}

// PE director id -> photo key mappings
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

// Build id -> dataUrl lookup
const photoById = {};
for (const m of peMappings) {
  const url = resolveKey(m.key);
  if (url) {
    photoById[m.id] = url;
    console.log(`✓ ${m.id}: photo found for "${m.key}"`);
  } else {
    console.warn(`✗ ${m.id}: no photo for "${m.key}"`);
  }
}

// Read the file and patch each id block
let content = fs.readFileSync(path.join(__dirname, 'src', 'data', 'defaultPEDirectors.ts'), 'utf-8');

for (const [id, dataUrl] of Object.entries(photoById)) {
  // Find id field, then find the next photo field (which may be defaultBlankAvatar or old URL)
  // Strategy: split on id marker, replace photo in that chunk
  const idMarker = `id: '${id}'`;
  const idx = content.indexOf(idMarker);
  if (idx === -1) {
    console.warn(`✗ Could not find id='${id}' in file`);
    continue;
  }
  // Find the closing brace of this object
  let braceDepth = 0;
  let start = content.lastIndexOf('{', idx);
  let end = -1;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') braceDepth++;
    if (content[i] === '}') {
      braceDepth--;
      if (braceDepth === 0) { end = i + 1; break; }
    }
  }
  if (end === -1) {
    console.warn(`✗ Could not find closing brace for ${id}`);
    continue;
  }
  
  let block = content.slice(start, end);
  
  // Replace photo field in this block
  // photo: 'anything' OR photo: defaultBlankAvatar OR photo: `...`
  const photoPattern = /photo:\s*(?:'[^']*'|`[^`]*`|defaultBlankAvatar)/s;
  if (photoPattern.test(block)) {
    const escaped = dataUrl.replace(/\\/g, '\\\\');
    const newBlock = block.replace(photoPattern, `photo: '${escaped}'`);
    content = content.slice(0, start) + newBlock + content.slice(end);
    console.log(`✓ Patched ${id}`);
  } else {
    console.warn(`✗ Could not find photo field in block for ${id}`);
  }
}

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'defaultPEDirectors.ts'), content, 'utf-8');
console.log('\n✓ defaultPEDirectors.ts updated!');
console.log('IMPORTANT: Clear browser localStorage keys "pczsc_pe_directors" and "pczsc_committee_members" for photos to reload.');
