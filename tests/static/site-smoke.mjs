import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const htmlDirectory = join(root, 'html');
const htmlFiles = [
  'index.html',
  ...(await readdir(htmlDirectory)).map((file) => `html/${file}`)
];
const failures = [];

async function expectFile(relativePath) {
  try {
    await access(join(root, relativePath));
  } catch {
    failures.push(`${relativePath}: expected file is missing`);
  }
}

for (const relativePath of htmlFiles) {
  const contents = await readFile(join(root, relativePath), 'utf8');
  if (!contents.includes('id="app"')) {
    failures.push(`${relativePath}: missing the shared React mount`);
  }
  if (!contents.includes('/src/app/entrypoints/')) {
    failures.push(`${relativePath}: missing a page entrypoint`);
  }
}

const expectedModules = [
  'src/app/entrypoints/intro.tsx',
  'src/app/entrypoints/home.tsx',
  'src/app/entrypoints/contact.tsx',
  'src/app/layouts/SiteLayout.tsx',
  'src/shared/navigation/SidebarNavigation.tsx',
  'src/shared/navigation/MobileNavigation.tsx',
  'src/shared/footer',
  'src/shared/ui',
  'src/shared/hooks/useScrollReveal.ts',
  'src/shared/icons',
  'src/pages/intro/IntroPage.tsx',
  'src/pages/home/HomePage.tsx',
  'src/pages/home/sections/Hero/workspace-board.html',
  'src/pages/home/sections/Hero/workspace-board.css',
  'src/pages/home/sections/Hero/useHeroInteractions.ts',
  'src/pages/contact/ContactPage.tsx',
  'src/features/rough-note-drawing',
  'src/features/contact-journey',
  'src/features/notebook-footer',
  'src/features/workbook-carousel',
  'src/assets/brand',
  'src/assets/icons',
  'src/assets/illustrations',
  'src/assets/textures',
  'public/media/videos/v-p.mp4',
  'tests/integration',
  'tests/visual'
];

await Promise.all(expectedModules.map(expectFile));

const homepageEntry = await readFile(
  join(root, 'src/app/entrypoints/home.tsx'),
  'utf8'
);
if (!homepageEntry.includes('HomePage')) {
  failures.push('home entrypoint does not mount HomePage');
}
if (
  !homepageEntry.includes('renderPage(<HomePage />)') ||
  homepageEntry.includes("location.replace('/')")
) {
  failures.push('home entrypoint must mount the product hero without replaying the intro');
}

const homepage = await readFile(join(root, 'src/pages/home/HomePage.tsx'), 'utf8');
for (const feature of [
  'SiteLayout',
  'FooterPaper',
  'RoughNoteDrawing',
  'useWorkbookCarousel'
]) {
  if (!homepage.includes(feature)) {
    failures.push(`HomePage is missing ${feature}`);
  }
}

const heroSection = await readFile(
  join(root, 'src/pages/home/sections/Hero/index.ts'),
  'utf8'
);
const workspaceBoard = await readFile(
  join(root, 'src/pages/home/sections/Hero/workspace-board.html'),
  'utf8'
);
if (
  !heroSection.includes('workspace-board.html') ||
  !heroSection.includes('__WORKSPACE_BOARD__')
) {
  failures.push('Hero section is missing the component-built live workspace');
}
if (!homepage.includes('useHeroInteractions')) {
  failures.push('HomePage is missing the hero typing and bulb interactions');
}
const workspaceFlowNotes =
  workspaceBoard.match(/class="d1-flow-note\b/g) ?? [];
const requiredWorkflowDetails = [
  'Idea',
  'Dashboard',
  'Automation',
  'Launch',
  'd1-workspace-paperclip',
  'd1-workspace-pencil',
  'd1-workspace-coffee-ring',
  'd1-wireframe-sketch',
  'data-idea-bulb',
  'data-type-text'
];
if (
  workspaceFlowNotes.length !== 4 ||
  requiredWorkflowDetails.some((detail) => !workspaceBoard.includes(detail))
) {
  failures.push(
    'Hero workspace must retain the four-note idea-to-launch paper workflow'
  );
}

for (const stylesheet of [
  'home-page.global.css',
  'notebook-footer-placeholder.global.css'
]) {
  if (!homepage.includes(stylesheet)) {
    failures.push(`HomePage is missing ${stylesheet}`);
  }
}

const introPage = await readFile(
  join(root, 'src/pages/intro/IntroPage.tsx'),
  'utf8'
);
if (!introPage.includes('intro-page.global.css')) {
  failures.push('IntroPage must import its global animation stylesheet directly');
}

const siteLayout = await readFile(
  join(root, 'src/app/layouts/SiteLayout.tsx'),
  'utf8'
);
for (const stylesheet of [
  'navigation.global.css',
  'navigation-responsive.global.css'
]) {
  if (!siteLayout.includes(stylesheet)) {
    failures.push(`SiteLayout is missing ${stylesheet}`);
  }
}

const drawingFeature = await readFile(
  join(root, 'src/features/rough-note-drawing/RoughNoteDrawingFeature.tsx'),
  'utf8'
);
if (!drawingFeature.includes('drawing-cursors.global.css')) {
  failures.push('drawing feature is missing its tool-specific cursor stylesheet');
}

const serviceMarkup = await readFile(
  join(root, 'src/pages/home/sections/ServicesWorkbook/markup.html'),
  'utf8'
);
if (/Page 01\s*<span>/.test(serviceMarkup)) {
  failures.push('Services workbook page count still includes the removed emoji');
}

const contactPage = await readFile(join(root, 'html/contact.html'), 'utf8');
if (
  !contactPage.includes('rough-note-contact-endpoint') ||
  !contactPage.includes('entrypoints/contact.tsx')
) {
  failures.push('html/contact.html: missing contact page configuration');
}

const packageJson = JSON.parse(
  await readFile(join(root, 'package.json'), 'utf8')
);
if (!packageJson.scripts?.dev?.includes('--port 8000')) {
  failures.push('package.json: local Vite server must retain port 8000');
}

const viteConfig = await readFile(join(root, 'vite.config.ts'), 'utf8');
if (!/server:\s*\{[\s\S]*?hmr:\s*false/.test(viteConfig)) {
  failures.push(
    'vite.config.ts: React Refresh must remain disabled for local browser compatibility'
  );
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Static architecture check passed for ${htmlFiles.length} HTML documents.`
  );
}
