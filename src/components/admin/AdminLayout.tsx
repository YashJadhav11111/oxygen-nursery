import { Suspense } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '@/components/ui/Icon';
import Logo from '@/components/layout/Logo';
import PageLoader from '@/components/ui/PageLoader';
import { useAuth } from '@/context/AuthContext';
import { isPrototypeImages } from '@/services/images/imageRegistry';

interface NavEntry {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
  ownerOnly?: boolean;
}

const NAV: NavEntry[] = [
  { to: '/admin', label: 'Overview', icon: 'grid', end: true },
  { to: '/admin/plants', label: 'Plant Management', icon: 'leaf' },
  { to: '/admin/plants/new', label: 'Add Plant', icon: 'sprout' },
  { to: '/admin/images', label: 'Image Management', icon: 'layers' },
  { to: '/admin/appointments', label: 'Appointments', icon: 'calendar' },
  { to: '/admin/admins', label: 'Admin Management', icon: 'shield', ownerOnly: true },
];

/**
 * The frame around every admin screen.
 *
 * It is built from the same tokens, type and colours as the public site rather
 * than a separate dashboard style — the nursery's own paper-and-forest palette,
 * Fraunces for headings. The point is that this feels like the back of the same
 * shop, not a different piece of software bolted on.
 *
 * None of the public site's scroll and depth motion runs here. That motion is
 * for a customer being walked through a story; someone editing forty plant
 * records wants the page to hold still.
 */
export function AdminLayout() {
  const { user, isOwner, signOut, isPrototype } = useAuth();
  const navigate = useNavigate();

  const onSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="admin">
      <aside className="admin__side">
        <div className="admin__brand">
          <Logo variant="mark" linkTo="/" />
          <div>
            <strong>Oxygen Nursery</strong>
            <span>Management</span>
          </div>
        </div>

        <nav className="admin__nav" aria-label="Admin sections">
          {NAV.filter((item) => !item.ownerOnly || isOwner).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin__nav-link ${isActive ? 'is-active' : ''}`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin__side-foot">
          <Link to="/" className="admin__nav-link admin__nav-link--quiet">
            <Icon name="home" size={18} /> View the website
          </Link>
          <div className="admin__account">
            <span className="admin__avatar" aria-hidden="true">
              {(user?.displayName ?? '?').slice(0, 1).toUpperCase()}
            </span>
            <div className="admin__account-text">
              <strong>{user?.displayName}</strong>
              <span>{user?.role === 'owner' ? 'Owner' : 'Admin'}</span>
            </div>
            <button type="button" className="admin__signout" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="admin__main">
        {(isPrototype || isPrototypeImages) && (
          <p className="admin__disclosure">
            <Icon name="alert" size={16} />
            <span>
              <strong>Prototype storage.</strong> Plant edits, uploaded images and admin
              accounts are saved in this browser only — they are not on the live website and
              nobody else can see them. Connect a backend to publish them; the screens
              themselves will not need to change.
            </span>
          </p>
        )}
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default AdminLayout;
