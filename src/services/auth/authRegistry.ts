import type { AuthProvider } from './authProvider';
import LocalAuthProvider from './localAuthProvider';

/**
 * ===========================================================================
 * THE ONE LINE TO CHANGE WHEN REAL AUTHENTICATION ARRIVES
 * ===========================================================================
 * Today:   export const auth = new LocalAuthProvider();
 * Later:   export const auth = new ApiAuthProvider(import.meta.env.VITE_API_URL);
 *
 * Nothing above this file — no page, no form, no route guard — needs to change.
 * ===========================================================================
 */
export const auth: AuthProvider = new LocalAuthProvider();

/** True while sign-in happens in the browser rather than on a server. */
export const isPrototypeAuth = auth.isPrototype;
