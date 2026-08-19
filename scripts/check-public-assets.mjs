import { access, readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceRoots = ['src', 'html', 'css'];
const readableExtensions = new Set(['.css', '.html', '.js', '.ts', '.tsx']);
const failures = [];

async function collectFiles(directory) {
  const entries = await readdir(join(root, directory), { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(path));
    else if (readableExtensions.has(extname(entry.name))) files.push(path);
  }

  return files;
}

const files = [
  'index.html',
  ...(await Promise.all(sourceRoots.map(collectFiles))).flat()
];

for (const sourceFile of files) {
  const contents = await readFile(join(root, sourceFile), 'utf8');
  const publicReference = /(["'])(\/(?:assets|media)\/[^"']+?)\1/g;

  for (const match of contents.matchAll(publicReference)) {
    const requestedPath = decodeURIComponent(match[2].split(/[?#]/, 1)[0]);
    const publicFile = join(root, 'public', requestedPath);

    try {
      await access(publicFile);
    } catch {
      failures.push(
        `${relative(root, join(root, sourceFile))}: missing public${requestedPath}`
      );
    }
  }
}

if (failures.length > 0) {
  process.stderr.write(`${[...new Set(failures)].sort().join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Public asset references verified across ${files.length} source files.\n`);
}
