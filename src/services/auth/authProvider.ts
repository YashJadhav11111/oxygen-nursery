import type { Result } from '@/types';

/**
 * ===========================================================================
 * THE SEAM BETWEEN THE UI AND AUTHENTICATION
 * ===========================================================================
 * Mirrors the DataProvider seam in services/dataProvider.ts.
 *
 *   UI  ->  useAuth()  ->  AuthProvider  ->  browser storage        (today)
 *   UI  ->  useAuth()  ->  AuthProvider  ->  your API / Firebase    (later)
 *
 * No page, form or route guard knows how a password is checked or where a
 * session lives. To move authentication to a server, write a second class
 * implementing this interface and change one line in authRegistry.ts.
 *
 * A server implementation would keep the same method names and simply not
 * return anything sensitive: `signIn` would POST the credentials and let the
 * server set an httpOnly cookie, `current()` would GET /me, and the admin
 * management calls would become ordinary authorised requests. The UI would not
 * change at all.
 * ===========================================================================
 */

export type AdminRole = 'owner' | 'admin';

/** A staff account. Never carries a password or a hash. */
export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  role: AdminRole;
  /** A disabled account keeps its history but cannot sign in. */
  enabled: boolean;
  createdAt: string;
  /** Username of whoever created it, for the audit column. */
  createdBy?: string;
  lastSignInAt?: string;
}

/** What the app knows about who is signed in. */
export interface Session {
  user: AdminUser;
  issuedAt: string;
  expiresAt: string;
}

export interface NewAdminInput {
  username: string;
  password: string;
  displayName?: string;
  role?: AdminRole;
}

export interface AuthProvider {
  readonly name: string;
  /**
   * True when accounts live only in this browser. The admin UI uses it to say
   * so out loud rather than implying the login is server-backed.
   */
  readonly isPrototype: boolean;

  /** Resolves once any first-run seeding has finished. */
  ready(): Promise<void>;

  /** True when no admin account exists at all, so the UI can explain why. */
  needsSetup(): Promise<boolean>;

  signIn(username: string, password: string): Promise<Result<Session>>;
  signOut(): Promise<void>;
  /** The current session, or null. Returns null for an expired session. */
  current(): Promise<Session | null>;

  /* --- Admin management (requires an active session) -------------------- */
  listAdmins(): Promise<Result<AdminUser[]>>;
  createAdmin(input: NewAdminInput): Promise<Result<AdminUser>>;
  setAdminEnabled(id: string, enabled: boolean): Promise<Result<AdminUser>>;
  removeAdmin(id: string): Promise<Result<null>>;
  changePassword(id: string, newPassword: string): Promise<Result<null>>;
}

export const ok = <T>(data: T): Result<T> => ({ ok: true, data });
export const fail = <T>(error: string): Result<T> => ({ ok: false, error });
