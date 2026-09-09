import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import Logo from '@/components/layout/Logo';
import Reveal from '@/components/ui/Reveal';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';

/**
 * The single door into the admin side.
 *
 * It is deliberately explicit that a customer does not need an account for
 * anything on this website: the two panels below say so, rather than leaving a
 * visitor wondering whether they are missing out by not signing up.
 */
export default function Login() {
  const { signIn, isAdmin, loading, needsSetup, isPrototype } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useSeo({
    title: 'Staff Login',
    description: 'Sign in to manage the Oxygen Nursery plant catalogue.',
  });

  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  useEffect(() => {
    if (!loading && isAdmin) navigate(from, { replace: true });
  }, [loading, isAdmin, from, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const message = await signIn(username, password);
    setBusy(false);
    if (message) {
      setError(message);
      setPassword('');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="login">
      <div className="container login__container">
        <Reveal>
          <div className="login__head">
            <Logo linkTo="/" />
            <h1>Sign in</h1>
            <p className="lede">
              Staff access to the plant catalogue and its photographs.
            </p>
          </div>
        </Reveal>

        <div className="login__grid">
          {/* ---------------- Visitors ---------------- */}
          <Reveal variant="drift-left" className="login__panel login__panel--visitor">
            <span className="eyebrow"><Icon name="leaf" size={15} /> Customers</span>
            <h2>No account needed</h2>
            <p>
              Everything on this website is open. Browse the catalogue, search and filter
              plants, read the care guides, message us on WhatsApp or book a consultation —
              all without signing in.
            </p>
            <div className="login__panel-actions">
              <Link to="/plants" className="btn btn--primary">
                Browse plants <Icon name="arrow-right" size={17} />
              </Link>
              <Link to="/book" className="btn btn--secondary">
                <Icon name="calendar" size={17} /> Book a consultation
              </Link>
            </div>
          </Reveal>

          {/* ---------------- Staff ---------------- */}
          <Reveal variant="drift-right" delay={110} className="login__panel login__panel--admin">
            <span className="eyebrow"><Icon name="shield" size={15} /> Oxygen Nursery staff</span>
            <h2>Admin login</h2>

            {needsSetup ? (
              <div className="notice notice--warn">
                <Icon name="alert" size={18} />
                <div>
                  <strong>No admin account exists yet.</strong>
                  <p>
                    Create the first one by running <code>node scripts/make-admin-hash.mjs</code>,
                    putting the result in <code>.env.local</code>, and restarting the server.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="field">
                  <label className="field__label" htmlFor="login-username">Username</label>
                  <input
                    id="login-username"
                    className="input"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    className="input"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p className="field__error" role="alert">
                    <Icon name="alert" size={14} /> {error}
                  </p>
                )}

                <button type="submit" className="btn btn--primary btn--lg login__submit" disabled={busy}>
                  {busy ? 'Checking…' : 'Sign in'}
                </button>
              </form>
            )}

            {isPrototype && (
              <p className="login__disclosure">
                <Icon name="alert" size={14} />
                <span>
                  Prototype sign-in. Accounts are held in this browser and checked in the
                  page, not on a server, so treat this as access control rather than
                  security until the backend is connected.
                </span>
              </p>
            )}
          </Reveal>
        </div>

        <p className="login__back">
          <Link to="/" className="link-arrow"><Icon name="chevron-left" size={16} /> Back to the website</Link>
        </p>
      </div>
    </div>
  );
}
