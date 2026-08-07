const fs = require('fs');
const file = 'c:/Users/SACHIN/Downloads/Desktop/RoughNoteFive/rough-note-website/src/pages/services/sections/WhyRoughNote/WhyRoughNote.tsx';
let content = fs.readFileSync(file, 'utf8');

const titles = [
  'Business Before Design',
  'Strategy-Driven Thinking',
  'One Creative Partner',
  'Built Around Your Business',
  'Transparent Collaboration',
  'Quality Without Compromise',
  'Long-Term Partnership'
];

const attachments = [
  'masking-tape',
  'transparent-tape',
  'push-pin',
  'paper-clip',
  'masking-tape',
  'push-pin',
  'transparent-tape'
];

titles.forEach((title, i) => {
  const attachmentHTML = `<div className="wrn-attachment wrn-${attachments[i]}"></div>`;
  const underlineHTML = `<h3 className="wrn-card-title">
              <span className="wrn-title-inner">
                ${title}
                <svg className="wrn-card-underline" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 0 100 8" stroke="#e65100" fill="none" strokeWidth="3" strokeLinecap="round" /></svg>
              </span>
            </h3>`;
  
  // replace the title
  content = content.replace(`<h3 className="wrn-card-title">${title}</h3>`, underlineHTML);
  
  // inject attachment right after card-num
  const numTag = `<div className="wrn-card-num">0${i+1}</div>`;
  content = content.replace(numTag, numTag + '\n            ' + attachmentHTML);
});

// Update card 05 checklist
const card5Original = `<div className="wrn-card-split">
              <p className="wrn-card-body">You'll always know what we're building, why we're building it, and what comes next.</p>
              <div className="wrn-checklist">
                <div>✓ Weekly updates</div>
                <div>✓ Client reviews</div>
                <div>✓ Clear milestones</div>
              </div>
            </div>`;
const card5New = `<p className="wrn-card-body">You'll always know what we're building, why we're building it, and what comes next.</p>
            <div className="wrn-card-sticky white wrn-sticker-checklist">
              <div className="wrn-attachment wrn-paper-clip"></div>
              <div className="wrn-checklist">
                <div>✓ Weekly updates</div>
                <div>✓ Client reviews</div>
                <div>✓ Clear milestones</div>
              </div>
            </div>`;
content = content.replace(card5Original, card5New);

fs.writeFileSync(file, content);
console.log('TSX updated!');
