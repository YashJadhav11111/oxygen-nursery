import type { Result } from '@/types';
import storage from '../storage';
import {
  type AdminUser, type AuthProvider, type NewAdminInput, type Session, fail, ok,
} from './authProvider';
import { DEFAULT_ITERATIONS, type PasswordRecord, hashPassword, verifyPassword } from './passwordHash';

const USERS_KEY = 'auth:users';
const CREDS_KEY = 'auth:credentials';
const SESSION_KEY = 'auth:session';
const SESSION_HOURS = 8;

/** Stored separately from the user record so a user list can never leak a hash. */
type CredentialMap = Record<string, PasswordRecord>;

const newId = () =>
  `usr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const normalise = (username: string) => username.trim();

/**
 * ===========================================================================
 * PROTOTYPE AUTHENTICATION — BROWSER ONLY
 * ===========================================================================
 * Accounts and the signed-in session live in this browser's localStorage.
 * Passwords are stored as salted PBKDF2 digests, never as text.
 *
 * BE CLEAR ABOUT WHAT THIS IS. It is a working access-control model — roles,
 * sessions, guards, an audit trail of who created whom — running entirely on
 * the client. It keeps the wrong people out of the admin screens in normal
 * use. It is NOT a security boundary: anyone who can open developer tools on
 * their own machine can write their own session object.
 *
 * That is acceptable here because there is no server and nothing behind these
 * screens except this same browser's data. It stops being acceptable the
 * moment the admin screens write to a real database. At that point replace
 * this class (see authRegistry.ts) — the interface is the same, so nothing
 * above this file changes.
 *
 * The first admin is seeded from build-time environment variables holding a
 * SALT AND HASH, never a password. See .env.example and
 * scripts/make-admin-hash.mjs.
 * ===========================================================================
 */
export class LocalAuthProvider implements AuthProvider {
  readonly name = 'local-prototype';
  readonly isPrototype = true;

  private seeding: Promise<void> | null = null;

  /* --- storage helpers -------------------------------------------------- */
  private users(): AdminUser[] {
    return storage.get<AdminUser[]>(USERS_KEY, []);
  }

  private saveUsers(users: AdminUser[]): void {
    storage.set(USERS_KEY, users);
  }

  private creds(): CredentialMap {
    return storage.get<CredentialMap>(CREDS_KEY, {});
  }

  private saveCreds(creds: CredentialMap): void {
    storage.set(CREDS_KEY, creds);
  }

  /* --- first run -------------------------------------------------------- */
  /**
   * Creates the initial owner account from the environment, once.
   *
   * The environment carries `VITE_INITIAL_ADMIN_USERNAME` plus a salt and hash
   * — never a password — so no credential is recoverable from the source or
   * the built bundle. If the variables are absent, no account is created and
   * the login screen explains how to make one.
   */
  ready(): Promise<void> {
    this.seeding ??= (async () => {
      if (this.users().length > 0) return;

      const env = import.meta.env;
      const username = env.VITE_INITIAL_ADMIN_USERNAME as string | undefined;
      const salt = env.VITE_INITIAL_ADMIN_SALT as string | undefined;
      const hash = env.VITE_INITIAL_ADMIN_HASH as string | undefined;
      if (!username || !salt || !hash) return;

      const iterations = Number(env.VITE_INITIAL_ADMIN_ITERATIONS) || DEFAULT_ITERATIONS;
      const user: AdminUser = {
        id: newId(),
        username: normalise(username),
        displayName: (env.VITE_INITIAL_ADMIN_NAME as string | undefined) ?? normalise(username),
        role: 'owner',
        enabled: true,
        createdAt: new Date().toISOString(),
      };
      this.saveUsers([user]);
      this.saveCreds({ [user.id]: { salt, hash, iterations } });
    })();
    return this.seeding;
  }

  async needsSetup(): Promise<boolean> {
    await this.ready();
    return this.users().length === 0;
  }

  /* --- sign in / out ---------------------------------------------------- */
  async signIn(username: string, password: string): Promise<Result<Session>> {
    await this.ready();
    const users = this.users();
    const user = users.find(
      (u) => u.username.toLowerCase() === normalise(username).toLowerCase(),
    );
    const record = user ? this.creds()[user.id] : undefined;

    // Hash even when the username is unknown, so a wrong username and a wrong
    // password take the same amount of time and cannot be told apart.
    const probe: PasswordRecord = record ?? {
      salt: '00000000000000000000000000000000',
      hash: '',
      iterations: DEFAULT_ITERATIONS,
    };
    const matched = await verifyPassword(password, probe);

    if (!user || !record || !matched) {
      return fail<Session>('That username and password do not match.');
    }
    if (!user.enabled) {
      return fail<Session>('This account has been disabled. Ask an owner to re-enable it.');
    }

    const now = new Date();
    const expires = new Date(now.getTime() + SESSION_HOURS * 3600_000);
    const signedIn: AdminUser = { ...user, lastSignInAt: now.toISOString() };
    this.saveUsers(users.map((u) => (u.id === user.id ? signedIn : u)));

    const session: Session = {
      user: signedIn,
      issuedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };
    storage.set(SESSION_KEY, session);
    return ok(session);
  }

  async signOut(): Promise<void> {
    storage.remove(SESSION_KEY);
  }

  async current(): Promise<Session | null> {
    await this.ready();
    const session = storage.get<Session | null>(SESSION_KEY, null);
    if (!session) return null;

    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      storage.remove(SESSION_KEY);
      return null;
    }
    // The account may have been disabled or deleted since the session started.
    const user = this.users().find((u) => u.id === session.user.id);
    if (!user || !user.enabled) {
      storage.remove(SESSION_KEY);
      return null;
    }
    return { ...session, user };
  }

  /* --- admin management ------------------------------------------------- */
  async listAdmins(): Promise<Result<AdminUser[]>> {
    if (!(await this.current())) return fail<AdminUser[]>('Not signed in.');
    return ok([...this.users()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
  }

  async createAdmin(input: NewAdminInput): Promise<Result<AdminUser>> {
    const session = await this.current();
    if (!session) return fail<AdminUser>('Not signed in.');

    const username = normalise(input.username);
    if (username.length < 4) return fail<AdminUser>('Username must be at least 4 characters.');
    if (/\s/.test(username)) return fail<AdminUser>('Username cannot contain spaces.');
    if (input.password.length < 8) return fail<AdminUser>('Password must be at least 8 characters.');

    const users = this.users();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return fail<AdminUser>('That username is already taken.');
    }

    const user: AdminUser = {
      id: newId(),
      username,
      displayName: input.displayName?.trim() || username,
      role: input.role ?? 'admin',
      enabled: true,
      createdAt: new Date().toISOString(),
      createdBy: session.user.username,
    };
    this.saveUsers([...users, user]);
    this.saveCreds({ ...this.creds(), [user.id]: await hashPassword(input.password) });
    return ok(user);
  }

  async setAdminEnabled(id: string, enabled: boolean): Promise<Result<AdminUser>> {
    const session = await this.current();
    if (!session) return fail<AdminUser>('Not signed in.');
    if (session.user.id === id) return fail<AdminUser>('You cannot disable your own account.');

    const users = this.users();
    const user = users.find((u) => u.id === id);
    if (!user) return fail<AdminUser>('Account not found.');
    if (user.role === 'owner' && !enabled) {
      return fail<AdminUser>('The owner account cannot be disabled.');
    }

    const updated = { ...user, enabled };
    this.saveUsers(users.map((u) => (u.id === id ? updated : u)));
    return ok(updated);
  }

  async removeAdmin(id: string): Promise<Result<null>> {
    const session = await this.current();
    if (!session) return fail<null>('Not signed in.');
    if (session.user.id === id) return fail<null>('You cannot remove your own account.');

    const users = this.users();
    const user = users.find((u) => u.id === id);
    if (!user) return fail<null>('Account not found.');
    if (user.role === 'owner') return fail<null>('The owner account cannot be removed.');

    this.saveUsers(users.filter((u) => u.id !== id));
    const creds = this.creds();
    delete creds[id];
    this.saveCreds(creds);
    return ok(null);
  }

  async changePassword(id: string, newPassword: string): Promise<Result<null>> {
    const session = await this.current();
    if (!session) return fail<null>('Not signed in.');
    if (newPassword.length < 8) return fail<null>('Password must be at least 8 characters.');
    if (!this.users().some((u) => u.id === id)) return fail<null>('Account not found.');

    this.saveCreds({ ...this.creds(), [id]: await hashPassword(newPassword) });
    return ok(null);
  }
}

export default LocalAuthProvider;
