import { Navigate, useLocation } from 'react-router-dom';
import PageLoader from '@/components/ui/PageLoader';
import { useAuth } from '@/context/AuthContext';

/**
 * Wraps every admin route.
 *
 * Waiting for `loading` matters: the session is read asynchronously, and
 * redirecting before that finishes would bounce a signed-in admin back to the
 * login page on every refresh.
 *
 * `ownerOnly` gates the screens that can change who else has access.
 *
 * This is a UI guard, not a security boundary. It decides what the app renders,
 * and on a client-only build that is all any guard can do — the real check has
 * to live on the server that holds the data. See
 * services/auth/localAuthProvider.ts.
 */
export function RequireAdmin({
  children,
  ownerOnly = false,
}: {
  children: React.ReactNode;
  ownerOnly?: boolean;
}) {
  const { loading, isAdmin, isOwner } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAdmin) {
    // Remember where they were headed so sign-in can finish the journey.
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (ownerOnly && !isOwner) return <Navigate to="/admin" replace />;

  return <>{children}</>;
}

export default RequireAdmin;
