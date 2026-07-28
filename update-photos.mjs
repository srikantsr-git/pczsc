import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photoDir = path.join(__dirname, 'public', 'committee');

// Read files in public/committee
const files = fs.readdirSync(photoDir);
console.log(`Found ${files.length} photos in public/committee/`);

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.|prin\.)\s*/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const photoMap = new Map();
for (const file of files) {
  const norm = normalizeName(file);
  const webPath = `/committee/${file}`;
  photoMap.set(norm, webPath);
}

function findMatchingPhoto(name) {
  const norm = normalizeName(name);
  if (photoMap.has(norm)) {
    return photoMap.get(norm);
  }
  // Try partial token match
  const nameTokens = norm.split(' ').filter(t => t.length > 2);
  for (const [key, webPath] of photoMap.entries()) {
    const keyTokens = key.split(' ').filter(t => t.length > 2);
    let matchCount = 0;
    for (const t of nameTokens) {
      if (keyTokens.includes(t)) matchCount++;
    }
    if (matchCount >= 2 && (matchCount >= nameTokens.length - 1)) {
      return webPath;
    }
    if (nameTokens.length === 1 && keyTokens.includes(nameTokens[0])) {
      return webPath;
    }
  }
  return null;
}

const pePath = path.join(__dirname, 'src', 'data', 'defaultPEDirectors.ts');
let peContent = fs.readFileSync(pePath, 'utf-8');

console.log('\n--- Patching defaultPEDirectors.ts (including existing base64) ---');

// Parse entries block by block or regex
let matchCount = 0;
peContent = peContent.replace(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*photo:\s*[\s\S]*?(?=,\s*mobile:)/g, (fullMatch, id, name) => {
  const foundPhoto = findMatchingPhoto(name);
  if (foundPhoto) {
    matchCount++;
    console.log(`Matched PE director ${id} ("${name}") -> ${foundPhoto}`);
    return `{\n    id: '${id}',\n    name: '${name}',\n    photo: '${foundPhoto}'`;
  }
  return fullMatch;
});

console.log(`Total PE directors matched: ${matchCount}`);
fs.writeFileSync(pePath, peContent, 'utf-8');
console.log('Done!');
