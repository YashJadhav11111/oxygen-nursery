#!/usr/bin/env node
/**
 * Generates the seed credential for the first admin account.
 *
 *     node scripts/make-admin-hash.mjs
 *
 * It asks for a username and password, prints the block to paste into
 * .env.local, and never writes the password anywhere. The password is read
 * with echo off, so it does not appear on screen or in your shell history.
 *
 * The digest is PBKDF2-SHA256 with a random 16-byte salt, matching
 * src/services/auth/passwordHash.ts byte for byte — so a hash made here
 * verifies in the browser.
 *
 * WHY A HASH AND NOT THE PASSWORD. Vite inlines every VITE_* variable into the
 * built JavaScript. Putting the password there would ship it to every visitor
 * in readable form. A salted PBKDF2 digest at this cost cannot be read back
 * into a password, so the built bundle carries no usable credential.
 *
 * It is still client-side authentication. See the note at the top of
 * src/services/auth/localAuthProvider.ts about what that does and does not
 * protect.
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
import process from 'node:process';

const ITERATIONS = 210_000;
const KEY_BYTES = 32;

function ask(question, { silent = false } = {}) {
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  return new Promise((resolve) => {
    if (silent) {
      // Swallow the echoed characters so the password never reaches the screen.
      const onData = (char) => {
        if (['\n', '\r', ''].includes(char.toString())) process.stdin.removeListener('data', onData);
        else process.stdout.write('[2K[200D' + question + '*'.repeat(rl.line.length));
      };
      process.stdin.on('data', onData);
    }
    rl.question(question, (answer) => {
      rl.close();
      if (silent) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

const username = (process.env.ADMIN_USERNAME ?? await ask('Username: ')).trim();
const displayName = (process.env.ADMIN_NAME ?? await ask('Display name (optional): ')).trim();
const password = process.env.ADMIN_PASSWORD ?? await ask('Password: ', { silent: true });

if (!username || !password) {
  console.error('\nA username and a password are both required.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('\nUse at least 8 characters.');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(password, Buffer.from(salt, 'hex'), ITERATIONS, KEY_BYTES, 'sha256')
  .toString('hex');

console.log(`
Paste this into .env.local (create it beside package.json).
That file is git-ignored, so the credential stays on this machine.

VITE_INITIAL_ADMIN_USERNAME=${username}${displayName ? `\nVITE_INITIAL_ADMIN_NAME=${displayName}` : ''}
VITE_INITIAL_ADMIN_SALT=${salt}
VITE_INITIAL_ADMIN_HASH=${hash}
VITE_INITIAL_ADMIN_ITERATIONS=${ITERATIONS}

Restart the dev server afterwards — Vite reads .env files at startup.
`);
