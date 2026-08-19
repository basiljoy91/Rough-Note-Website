import { access } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const target = process.argv[2];

if (target !== 'hostinger' && target !== 'sites') {
  throw new Error('Pass either "hostinger" or "sites" as the deployment target.');
}

async function exists(relativePath) {
  try {
    await access(join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

const sitesFiles = [
  'dist/server/index.js',
  'dist/.openai/hosting.json'
];

if (target === 'hostinger') {
  const leakedSitesFile = (
    await Promise.all(sitesFiles.map(async (file) => ((await exists(file)) ? file : null)))
  ).find(Boolean);

  if (leakedSitesFile) {
    throw new Error(
      `Hostinger output unexpectedly contains Sites-only file: ${leakedSitesFile}`
    );
  }
  const requiredServerFiles = [
    'dist-server/server/index.js',
    'dist-server/server/db/migrations/001_contact_journey.sql',
    'dist-server/server/db/migrations/002_newsletter.sql',
    'dist-server/server/db/migrations/003_scheduler.sql',
    'dist-server/server/db/migrations/004_security_operations.sql'
  ];
  const missingServerFile = (
    await Promise.all(
      requiredServerFiles.map(async (file) => ((await exists(file)) ? null : file))
    )
  ).find(Boolean);
  if (missingServerFile) {
    throw new Error(
      `Hostinger output is missing required backend file: ${missingServerFile}`
    );
  }
} else {
  const missingSitesFile = (
    await Promise.all(sitesFiles.map(async (file) => ((await exists(file)) ? null : file)))
  ).find(Boolean);

  if (missingSitesFile) {
    throw new Error(`Sites output is missing required file: ${missingSitesFile}`);
  }
}

if (!(await exists('dist/html/index.html'))) {
  throw new Error('Deployment output is missing the compiled homepage.');
}

process.stdout.write(`${target} deployment output verified.\n`);
