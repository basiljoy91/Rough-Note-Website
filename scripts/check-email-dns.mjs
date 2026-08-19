import { resolveCname, resolveTxt } from 'node:dns/promises';
import process from 'node:process';

const domain = process.env.EMAIL_DOMAIN?.trim().replace(/\.$/, '');
if (!domain) {
  throw new Error('Set EMAIL_DOMAIN to the domain used by MAIL_FROM.');
}

async function txtRecords(name) {
  try {
    return (await resolveTxt(name)).map((parts) => parts.join(''));
  } catch {
    return [];
  }
}

async function cnameRecords(name) {
  try {
    return (await resolveCname(name)).map((value) => value.replace(/\.$/, ''));
  } catch {
    return [];
  }
}

const failures = [];
const spf = (await txtRecords(domain)).filter((value) =>
  value.toLowerCase().startsWith('v=spf1')
);
if (spf.length !== 1) {
  failures.push(`expected exactly one SPF record, found ${spf.length}`);
} else if (!spf[0].includes('include:_spf.mail.hostinger.com')) {
  failures.push('SPF does not authorize _spf.mail.hostinger.com');
}

const expectedDkim = new Map([
  ['hostingermail-a._domainkey', 'hostingermail-a.dkim.mail.hostinger.com'],
  ['hostingermail-b._domainkey', 'hostingermail-b.dkim.mail.hostinger.com'],
  ['hostingermail-c._domainkey', 'hostingermail-c.dkim.mail.hostinger.com']
]);
for (const [selector, expected] of expectedDkim) {
  const values = await cnameRecords(`${selector}.${domain}`);
  if (!values.includes(expected)) {
    failures.push(`${selector} does not point to ${expected}`);
  }
}

const dmarc = (await txtRecords(`_dmarc.${domain}`)).filter((value) =>
  value.toUpperCase().startsWith('V=DMARC1;')
);
if (dmarc.length !== 1) {
  failures.push(`expected exactly one DMARC record, found ${dmarc.length}`);
} else if (!/;\s*p=(none|quarantine|reject)(?:;|$)/i.test(dmarc[0])) {
  failures.push('DMARC must declare p=none, p=quarantine, or p=reject');
}

if (failures.length) {
  process.stderr.write(`Email DNS check failed for ${domain}:\n`);
  for (const failure of failures) process.stderr.write(`- ${failure}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`SPF, DKIM, and DMARC are published for ${domain}.\n`);
}
