import { cp, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const source = join(root, 'server', 'db', 'migrations');
const destination = join(
  root,
  'dist-server',
  'server',
  'db',
  'migrations'
);

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });
