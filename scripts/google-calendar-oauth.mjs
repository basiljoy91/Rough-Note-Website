import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import process from 'node:process';
import { setTimeout } from 'node:timers';
import { URL, URLSearchParams } from 'node:url';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const port = 53682;
const redirectUri = `http://127.0.0.1:${port}/oauth/callback`;

if (!clientId || !clientSecret) {
  throw new Error(
    'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET locally before running calendar:authorize.'
  );
}

const state = randomBytes(24).toString('base64url');
const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authorizationUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/calendar',
  access_type: 'offline',
  include_granted_scopes: 'true',
  prompt: 'consent',
  state
}).toString();

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', redirectUri);
  if (requestUrl.pathname !== '/oauth/callback') {
    response.writeHead(404).end('Not found');
    return;
  }
  if (requestUrl.searchParams.get('state') !== state) {
    response.writeHead(400).end('OAuth state did not match. Close this tab.');
    return;
  }
  const code = requestUrl.searchParams.get('code');
  if (!code) {
    response.writeHead(400).end('Google returned no authorization code.');
    return;
  }
  try {
    const tokenResponse = await globalThis.fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });
    const result = await tokenResponse.json();
    if (!tokenResponse.ok || !result.refresh_token) {
      throw new Error(
        `Google did not return a refresh token: ${JSON.stringify(result)}`
      );
    }
    process.stdout.write(
      `\nAuthorization complete. Add this only to Hostinger secrets:\n\nGOOGLE_REFRESH_TOKEN=${result.refresh_token}\n\nDo not commit it.\n`
    );
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(
      '<h1>Rough Note Calendar authorized</h1><p>The refresh token is in your terminal. You may close this tab.</p>'
    );
  } catch (error) {
    response.writeHead(500).end('Token exchange failed. Check the terminal.');
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  } finally {
    setTimeout(() => server.close(), 250);
  }
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(
    `Add this exact redirect URI to the Google OAuth client:\n${redirectUri}\n\nThen open this URL:\n${authorizationUrl.toString()}\n`
  );
});

setTimeout(() => {
  process.stderr.write('Authorization timed out after five minutes.\n');
  server.close();
}, 5 * 60_000).unref();
