import fs from 'fs';

const gen = fs.readFileSync('C:/Users/SACHIN/Downloads/Desktop/RoughNoteFive/rough-note-website/src/features/contact-journey/paper/CrumpledPaperGen.tsx', 'utf8');

const target = fs.readFileSync('C:/Users/SACHIN/Downloads/Desktop/RoughNoteFive/rough-note-website/src/features/contact-journey/paper/PaperObjects.tsx', 'utf8');

// Find the export function CrumpledPaper
const start = target.indexOf('export function CrumpledPaper');
let end = target.indexOf('export function TornFormPaper', start);

if (start !== -1 && end !== -1) {
  // we just replace the block between start and end (excluding end)
  // But wait, CrumpledPaperGen.tsx has imports at the top! We only want the function.
  const fnStart = gen.indexOf('export function CrumpledPaper');
  const generatedFn = gen.substring(fnStart);
  
  const newTarget = target.substring(0, start) + generatedFn + '\n' + target.substring(end);
  fs.writeFileSync('C:/Users/SACHIN/Downloads/Desktop/RoughNoteFive/rough-note-website/src/features/contact-journey/paper/PaperObjects.tsx', newTarget);
  console.log('Spliced successfully!');
} else {
  console.log('Could not find boundaries.');
}
