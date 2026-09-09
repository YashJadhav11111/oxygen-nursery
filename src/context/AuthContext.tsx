import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AdminUser, Session } from '@/services/auth/authProvider';
import { auth, isPrototypeAuth } from '@/services/auth/authRegistry';

interface AuthState {
  /** True until the first session check finishes; guards must wait for it. */
  loading: boolean;
  user: AdminUser | null;
  isAdmin: boolean;
  isOwner: boolean;
  isPrototype: boolean;
  /** True when no admin account exists yet. */
  needsSetup: boolean;
  signIn(username: string, password: string): Promise<string | null>;
  signOut(): Promise<void>;
  refresh(): Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Holds the signed-in session for the whole app.
 *
 * Nothing here knows how a password is checked — it delegates to the
 * AuthProvider, which is swappable (see services/auth/authRegistry.ts). The
 * only reason this lives in React state at all is so guards and the header can
 * react to signing in and out.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  const refresh = useCallback(async () => {
    const [current, setup] = await Promise.all([auth.current(), auth.needsSetup()]);
    setSession(current);
    setNeedsSetup(setup);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // A sign-out in one tab should not leave another tab holding a live session.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.includes('auth:')) void refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const signIn = useCallback(async (username: string, password: string) => {
    const result = await auth.signIn(username, password);
    if (!result.ok || !result.data) return result.error ?? 'Could not sign in.';
    setSession(result.data);
    setNeedsSetup(false);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthState>(() => ({
    loading,
    user: session?.user ?? null,
    isAdmin: Boolean(session?.user),
    isOwner: session?.user.role === 'owner',
    isPrototype: isPrototypeAuth,
    needsSetup,
    signIn,
    signOut,
    refresh,
  }), [loading, session, needsSetup, signIn, signOut, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthProvider;
