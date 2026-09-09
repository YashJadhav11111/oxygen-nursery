import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/ui/Icon';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import type { AdminRole, AdminUser } from '@/services/auth/authProvider';
import { auth } from '@/services/auth/authRegistry';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';

const roleLabel: Record<AdminRole, string> = { owner: 'Owner', admin: 'Admin' };

/**
 * Who can get into these screens.
 *
 * Only an owner can open this page (the route is guarded with `ownerOnly`), and
 * a few things are refused outright rather than offered and then explained: an
 * owner cannot disable or remove themselves, and the owner account cannot be
 * deleted at all — otherwise the last way in could be closed by accident.
 */
export default function AdminsAdmin() {
  const { user, refresh } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<AdminRole>('admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<AdminUser | null>(null);

  useSeo({ title: 'Admin Management' });

  const load = useCallback(async () => {
    const result = await auth.listAdmins();
    setAdmins(result.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const reset = () => {
    setUsername(''); setDisplayName(''); setRole('admin');
    setPassword(''); setConfirmPassword(''); setError(null);
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) return setError('The two passwords do not match.');

    setBusy(true);
    const result = await auth.createAdmin({ username, password, displayName, role });
    setBusy(false);

    if (!result.ok) return setError(result.error ?? 'Could not create that account.');
    setFlash(`${result.data?.displayName ?? username} can now sign in.`);
    setShowForm(false);
    reset();
    await load();
    return undefined;
  };

  const onToggle = async (target: AdminUser) => {
    const result = await auth.setAdminEnabled(target.id, !target.enabled);
    if (!result.ok) setError(result.error ?? 'Could not change that account.');
    await load();
    await refresh();
  };

  const onRemove = async () => {
    if (!pendingRemove) return;
    const target = pendingRemove;
    setPendingRemove(null);
    const result = await auth.removeAdmin(target.id);
    setFlash(result.ok ? `${target.displayName} no longer has access.` : null);
    if (!result.ok) setError(result.error ?? 'Could not remove that account.');
    await load();
  };

  return (
    <>
      <header className="admin-head">
        <div>
          <span className="eyebrow">Access</span>
          <h1>Admin Management</h1>
          <p className="lede">Who can sign in and change the catalogue.</p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => { setShowForm((v) => !v); reset(); }}
        >
          <Icon name={showForm ? 'close' : 'shield'} size={18} />
          {showForm ? 'Cancel' : 'Add an admin'}
        </button>
      </header>

      {flash && (
        <p className="admin-flash" role="status">
          <Icon name="check-circle" size={16} /> {flash}
          <button type="button" onClick={() => setFlash(null)} aria-label="Dismiss">
            <Icon name="close" size={15} />
          </button>
        </p>
      )}

      {showForm && (
        <section className="admin-card">
          <h2>New admin</h2>
          <form onSubmit={onCreate} noValidate>
            <div className="admin-form__row">
              <div className="field">
                <label className="field__label" htmlFor="a-username">
                  Username <span className="field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="a-username" className="input" value={username} autoComplete="off"
                  autoCapitalize="none" spellCheck={false}
                  onChange={(e) => setUsername(e.target.value)} required
                />
                <p className="field__hint">At least 4 characters, no spaces.</p>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="a-name">Display name</label>
                <input
                  id="a-name" className="input" value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Shown in the sidebar"
                />
              </div>
            </div>

            <div className="admin-form__row">
              <div className="field">
                <label className="field__label" htmlFor="a-password">
                  Password <span className="field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="a-password" className="input" type="password" value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)} required
                />
                <p className="field__hint">At least 8 characters.</p>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="a-confirm">
                  Confirm password <span className="field__req" aria-hidden="true">*</span>
                </label>
                <input
                  id="a-confirm" className="input" type="password" value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)} required
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="a-role">Role</label>
              <select
                id="a-role" className="select" value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
              >
                <option value="admin">Admin — manage plants and images</option>
                <option value="owner">Owner — that, plus manage admins</option>
              </select>
            </div>

            {error && (
              <p className="field__error" role="alert"><Icon name="alert" size={15} /> {error}</p>
            )}

            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? 'Creating…' : 'Create account'}
            </button>
          </form>
        </section>
      )}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="admin-table admin-table--admins" role="table" aria-label="Admin accounts">
          <div className="admin-table__head" role="row">
            <span role="columnheader">Account</span>
            <span role="columnheader">Role</span>
            <span role="columnheader">Added</span>
            <span role="columnheader">Status</span>
            <span role="columnheader"><span className="sr-only">Actions</span></span>
          </div>

          {admins.map((a) => {
            const isSelf = a.id === user?.id;
            return (
              <div className="admin-table__row" role="row" key={a.id}>
                <div className="admin-row__plant" role="cell">
                  <span className="admin__avatar" aria-hidden="true">
                    {a.displayName.slice(0, 1).toUpperCase()}
                  </span>
                  <span>
                    <strong>{a.displayName}</strong>
                    <em>{a.username}{isSelf ? ' — you' : ''}</em>
                  </span>
                </div>

                <span role="cell">
                  <span className={`badge ${a.role === 'owner' ? 'badge--new' : 'badge--soft'}`}>
                    {roleLabel[a.role]}
                  </span>
                </span>

                <span role="cell" className="admin-row__muted">
                  {new Date(a.createdAt).toLocaleDateString('en-IN')}
                  {a.createdBy && <><br /><small>by {a.createdBy}</small></>}
                </span>

                <span role="cell">
                  <span className={`badge ${a.enabled ? 'badge--available' : 'badge--unavailable'}`}>
                    {a.enabled ? 'Active' : 'Disabled'}
                  </span>
                </span>

                <span role="cell" className="admin-row__actions">
                  {isSelf || a.role === 'owner' ? (
                    <span className="admin-row__muted">
                      {isSelf ? 'Your own account' : 'Owner account'}
                    </span>
                  ) : (
                    <>
                      <button
                        type="button" className="btn btn--secondary btn--sm"
                        onClick={() => void onToggle(a)}
                      >
                        {a.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button" className="btn btn--danger btn--sm"
                        onClick={() => setPendingRemove(a)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p className="admin-note admin-note--quiet">
        <Icon name="alert" size={15} />
        Passwords are stored as salted PBKDF2 digests, never as text — but the check happens
        in this page rather than on a server, so this controls who sees the admin screens
        rather than protecting the data behind them. That changes when the backend is
        connected; these screens will not have to.
      </p>

      <ConfirmDialog
        open={pendingRemove !== null}
        title={`Remove ${pendingRemove?.displayName ?? 'this account'}?`}
        body="They lose access immediately. To keep the record but block sign-in, disable the account instead."
        confirmLabel="Remove access"
        onConfirm={onRemove}
        onCancel={() => setPendingRemove(null)}
      />
    </>
  );
}
