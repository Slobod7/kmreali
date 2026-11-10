// Signs in to Google APIs with the service account key and returns a short-lived access token.
// Uses only what ships with Node, so no extra packages see the key.
// The key lives outside this folder: ~/.config/google/kmreali-key.json (or set GOOGLE_KEY_FILE).
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const keyFile = process.env.GOOGLE_KEY_FILE ?? join(homedir(), '.config/google/kmreali-key.json');

const base64url = (text) => Buffer.from(text).toString('base64url');

export async function getAccessToken(scopes) {
  let key;
  try {
    key = JSON.parse(readFileSync(keyFile, 'utf8'));
  } catch {
    throw new Error(`No service account key at ${keyFile}.`);
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({ iss: key.client_email, scope: scopes.join(' '), aud: key.token_uri, iat: now, exp: now + 3600 }),
  );
  const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(key.private_key, 'base64url');

  const res = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Google sign-in failed: ${body.error_description ?? body.error}`);
  return body.access_token;
}
