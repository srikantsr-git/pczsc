import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const photoDir = path.join(__dirname, 'public', 'committee');
const files = fs.readdirSync(photoDir);

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
  const nameTokens = norm.split(' ').filter(t => t.length >= 3);
  
  // 1. Token overlap match
  for (const [key, webPath] of photoMap.entries()) {
    const keyTokens = key.split(' ').filter(t => t.length >= 3);
    let matchCount = 0;
    for (const t of nameTokens) {
      if (keyTokens.includes(t)) matchCount++;
    }
    if (matchCount >= 2) {
      return webPath;
    }
    if (keyTokens.length === 1 && nameTokens.includes(keyTokens[0])) {
      return webPath;
    }
    if (nameTokens.length === 1 && keyTokens.includes(nameTokens[0])) {
      return webPath;
    }
  }

  // 2. Specific known surname/key overrides for PE directors list
  const lowerName = name.toLowerCase();
  if (lowerName.includes('chikte')) return '/committee/Dr Chikte .jpg';
  if (lowerName.includes('dhamale')) return '/committee/Prof.Dhamale .jpg';
  if (lowerName.includes('shendkar')) return '/committee/Dr.Shendkar.jpg';
  if (lowerName.includes('bengle')) return '/committee/Prof.Bengle.jpg';
  if (lowerName.includes('amrule')) return '/committee/ProfAmrule.jpg';
  if (lowerName.includes('shaikh aiyaz')) return '/committee/DrShaikh.jpg';
  if (lowerName.includes('more popat')) return '/committee/Dr.More .jpg';
  if (lowerName.includes('kadam abhijeet')) return '/committee/Dr.AbhijeetKadam.jpg';
  if (lowerName.includes('tribhuvan nitin')) return '/committee/mrtribhuvan.jpg';
  if (lowerName.includes('sharma alok')) return '/committee/Mr.Sharma .jpg';
  if (lowerName.includes('kondhare machhindra')) return '/committee/Dr.Kondhare.jpg';
  if (lowerName.includes('bibave')) return '/committee/Dr.Bibave .jpg';
  if (lowerName.includes('parse santosh')) return '/committee/mrparse.jpg';

  return null;
}

// 1. Fix defaultPEDirectors.ts
const pePath = path.join(__dirname, 'src', 'data', 'defaultPEDirectors.ts');
let peContent = fs.readFileSync(pePath, 'utf-8');

let updatedCount = 0;
peContent = peContent.replace(
  /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*photo:[\s\S]*?(?=,\s*mobile:)/g,
  (match, id, name) => {
    const matchedPhoto = findMatchingPhoto(name);
    if (matchedPhoto) {
      updatedCount++;
      console.log(`Updated ${id} ("${name}") -> ${matchedPhoto}`);
      return `id: '${id}',\n    name: '${name}',\n    photo: '${matchedPhoto}'`;
    } else {
      return `id: '${id}',\n    name: '${name}',\n    photo: defaultBlankAvatar`;
    }
  }
);

fs.writeFileSync(pePath, peContent, 'utf-8');
console.log(`Finished updating defaultPEDirectors.ts: ${updatedCount} matched.`);

// 2. Fix CMSContext.tsx initialCommitteeMembers
const cmsPath = path.join(__dirname, 'src', 'context', 'CMSContext.tsx');
let cmsContent = fs.readFileSync(cmsPath, 'utf-8');

const committeeMembers = [
  { id: 'cm-1', name: 'Dr. Sachin Sakhre', file: null },
  { id: 'cm-2', name: 'Dr. Gujar Tushar Anil', file: 'Gujar Tushar Anil.jpg' },
  { id: 'cm-3', name: 'Prof. Parse Abhijit Venkat', file: 'mrparse.jpg' },
  { id: 'cm-4', name: 'Dr. Sharma Anirudha Mahesh', file: 'Mr.Sharma .jpg' },
  { id: 'cm-5', name: 'Dr. Augustine Anjushree Anthony', file: 'Dr. Augustine Anjushree.jpg' },
  { id: 'cm-6', name: 'Dr. Bibave Umesh Arun', file: 'Dr.Bibave .jpg' },
  { id: 'cm-7', name: 'Dr. Shaikh Aiyaz Hussain Jiyaull Hussain', file: 'DrShaikh.jpg' },
  { id: 'cm-8', name: 'Prof. (Dr.) Amrule Mohan Namdeo', file: 'ProfAmrule.jpg' },
  { id: 'cm-9', name: 'Prof. (Dr.) Dhamale Shantaram Dattu', file: 'Prof.Dhamale .jpg' },
  { id: 'cm-10', name: 'Dr. More Shirish Vijay', file: 'Dr.More .jpg' },
  { id: 'cm-11', name: 'Dr. Shinde Sachin Sudhakar', file: 'sachinshinde.jpg' },
  { id: 'cm-12', name: 'Dr. Kadam Abhijeet Babanrao', file: 'Dr.AbhijeetKadam.jpg' },
  { id: 'cm-13', name: 'Prof. Tribhuvan Mithun Prakash', file: 'mrtribhuvan.jpg' },
  { id: 'cm-14', name: 'Dr. Phale Vikram Suresh', file: 'Dr. Phale Vikram .jpg' },
  { id: 'cm-15', name: 'Dr. Kondhare Manisha Manoj', file: 'Dr.Kondhare.jpg' }
];

for (const cm of committeeMembers) {
  const photoUrl = `/committee/${cm.file}`;
  const pattern = new RegExp(`(id:\\s*'${cm.id}'[\\s\\S]*?photo:\\s*)'[^']*'`, 'g');
  cmsContent = cmsContent.replace(pattern, `$1'${photoUrl}'`);
}

fs.writeFileSync(cmsPath, cmsContent, 'utf-8');
console.log('Finished updating CMSContext.tsx.');
