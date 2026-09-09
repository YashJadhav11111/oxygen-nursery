/**
 * ===========================================================================
 * PASSWORD HASHING
 * ===========================================================================
 * PBKDF2-SHA256 over the Web Crypto API. No dependencies, works in every
 * browser this site targets, and produces the same digest as Node's
 * `crypto.pbkdf2` — which is how scripts/make-admin-hash.mjs can generate a
 * seed hash outside the browser.
 *
 * WHAT THIS DOES AND DOES NOT BUY YOU
 * -----------------------------------
 * Hashing means a stored credential is not a readable password: it protects
 * an admin who reuses that password elsewhere, and it means nothing in the
 * repository or the built bundle can be read back as a login.
 *
 * It does NOT make browser-side authentication secure. Everything here runs on
 * the customer's own machine, so a determined visitor can read the code, watch
 * the comparison, and edit the stored session. Anything that must actually be
 * protected has to be checked on a server. See services/auth/authProvider.ts
 * for how that swap is meant to happen.
 * ===========================================================================
 */

/** Cost factor. Raise it over time; stored hashes record the value they used. */
export const DEFAULT_ITERATIONS = 210_000;
const KEY_BITS = 256;

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

// Backed by a plain ArrayBuffer on purpose: Web Crypto will not accept a view
// onto a SharedArrayBuffer, which is what a bare `new Uint8Array(...)` widens to.
const fromHex = (hex: string): Uint8Array<ArrayBuffer> => {
  const pairs = hex.match(/.{1,2}/g) ?? [];
  const bytes = new Uint8Array(new ArrayBuffer(pairs.length));
  pairs.forEach((pair, i) => { bytes[i] = parseInt(pair, 16); });
  return bytes;
};

const subtle = (): SubtleCrypto => {
  const c = globalThis.crypto?.subtle;
  if (!c) {
    // Web Crypto is unavailable on insecure origins other than localhost.
    throw new Error('Secure context required: open the site over HTTPS or on localhost.');
  }
  return c;
};

export interface PasswordRecord {
  /** Hex-encoded random salt, unique per account. */
  salt: string;
  /** Hex-encoded PBKDF2 digest. */
  hash: string;
  iterations: number;
}

/** Fresh 16-byte salt. */
export function newSalt(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return toHex(bytes);
}

async function derive(password: string, salt: string, iterations: number): Promise<string> {
  const key = await subtle().importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await subtle().deriveBits(
    { name: 'PBKDF2', salt: fromHex(salt), iterations, hash: 'SHA-256' },
    key,
    KEY_BITS,
  );
  return toHex(new Uint8Array(bits));
}

/** Hashes a new password, generating its own salt. */
export async function hashPassword(
  password: string,
  iterations = DEFAULT_ITERATIONS,
): Promise<PasswordRecord> {
  const salt = newSalt();
  return { salt, hash: await derive(password, salt, iterations), iterations };
}

/**
 * Checks a password against a stored record.
 *
 * The comparison walks the whole digest rather than stopping at the first
 * mismatched character, so how long it takes says nothing about how much of
 * the hash was right.
 */
export async function verifyPassword(password: string, record: PasswordRecord): Promise<boolean> {
  const candidate = await derive(password, record.salt, record.iterations);
  if (candidate.length !== record.hash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) {
    diff |= candidate.charCodeAt(i) ^ record.hash.charCodeAt(i);
  }
  return diff === 0;
}
