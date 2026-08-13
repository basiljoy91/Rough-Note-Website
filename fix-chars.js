const fs = require('fs');
const file = 'c:/Users/SACHIN/Downloads/Desktop/RoughNoteFive/rough-note-website/src/pages/work/OurWorkPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\?"/g, '—');
content = content.replace(/o"/g, '✓');
content = content.replace(/\+"/g, '↓');
content = content.replace(/\+'/g, '→');
content = content.replace(/View More Projects &nbsp; /g, 'View More Projects &nbsp;→');
content = content.replace(/Open Case Study &nbsp; /g, 'Open Case Study &nbsp;→');
content = content.replace(/Projects &nbsp; <\/span>/g, 'Projects &nbsp;→</span>');
content = content.replace(/Drop Your Rough Note &nbsp; /g, 'Drop Your Rough Note &nbsp;→');
content = content.replace(/Let's talk\. &nbsp; <\/span>/g, 'Let\'s talk. &nbsp;→</span>');
content = content.replace(/<button className="ow-ea-page-btn" aria-label="Previous page"><\/button>/g, '<button className="ow-ea-page-btn" aria-label="Previous page">← </button>');
content = content.replace(/<button className="ow-ea-page-btn" aria-label="Next page"> <\/button>/g, '<button className="ow-ea-page-btn" aria-label="Next page">→</button>');
content = content.replace(/SalesTrack Pr/g, 'SalesTrack Pro",');
content = content.replace(/ow-proj-inf/g, 'ow-proj-info"');
content = content.replace(/ow-erp-log/g, 'ow-erp-logo"');
content = content.replace(/ow-ea-inf/g, 'ow-ea-info"');
content = content.replace(/ \? '' : ''/g, ' ? \'✓\' : \'\'');

fs.writeFileSync(file, content, 'utf8');