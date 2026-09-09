/// <reference types="vite/client" />

/**
 * Build-time configuration.
 *
 * The initial admin is seeded from a SALT AND HASH, never a password, so no
 * usable credential exists in the repository or in the built bundle. Generate
 * the pair with:
 *
 *     node scripts/make-admin-hash.mjs
 *
 * and put the output in .env.local (which is git-ignored). See .env.example.
 */
interface ImportMetaEnv {
  readonly VITE_INITIAL_ADMIN_USERNAME?: string;
  readonly VITE_INITIAL_ADMIN_NAME?: string;
  readonly VITE_INITIAL_ADMIN_SALT?: string;
  readonly VITE_INITIAL_ADMIN_HASH?: string;
  readonly VITE_INITIAL_ADMIN_ITERATIONS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
