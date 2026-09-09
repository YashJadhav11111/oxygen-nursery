import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Appointment, Plant } from '@/types';
import Icon, { type IconName } from '@/components/ui/Icon';
import * as admin from '@/services/adminService';
import appointmentService from '@/services/appointmentService';
import { useAuth } from '@/context/AuthContext';
import { useSeo } from '@/hooks/useSeo';

interface Stat {
  label: string;
  value: string;
  hint: string;
  icon: IconName;
  to?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

/**
 * The landing screen: what is in the catalogue, what still needs a photograph,
 * and what has changed since the build.
 *
 * The one number worth putting first is how many plants are still without a
 * photograph, because that is the work this whole section exists to make
 * possible.
 */
export default function Overview() {
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [usage, setUsage] = useState({ count: 0, bytes: 0 });

  useSeo({ title: 'Admin Overview' });

  useEffect(() => {
    let active = true;
    void (async () => {
      const [list, apts, storage] = await Promise.all([
        admin.listPlants(),
        appointmentService.list(),
        admin.storageUsage(),
      ]);
      if (!active) return;
      setPlants(list);
      setAppointments(apts.data ?? []);
      setUsage(storage);
    })();
    return () => { active = false; };
  }, []);

  // A plant is "unphotographed" when its only image is the coming-soon placeholder.
  const missing = plants.filter((p) => p.images.every((img) => !img.src));
  const changes = admin.overlayStats();
  const pending = appointments.filter((a) => a.status === 'pending');

  const stats: Stat[] = [
    {
      label: 'Plants in the catalogue',
      value: String(plants.length),
      hint: `${plants.length - missing.length} with photographs`,
      icon: 'leaf',
      to: '/admin/plants',
    },
    {
      label: 'Waiting for a photograph',
      value: String(missing.length),
      hint: missing.length === 0 ? 'Every plant has one' : 'Shown as “coming soon” on the site',
      icon: 'layers',
      to: '/admin/images',
    },
    {
      label: 'Appointment requests',
      value: String(appointments.length),
      hint: `${pending.length} still to answer`,
      icon: 'calendar',
      to: '/admin/appointments',
    },
    {
      label: 'Uploaded images',
      value: String(usage.count),
      hint: usage.count === 0 ? 'None yet' : `${formatBytes(usage.bytes)} in this browser`,
      icon: 'sparkle',
      to: '/admin/images',
    },
  ];

  return (
    <>
      <header className="admin-head">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Good to see you, {user?.displayName?.split(' ')[0] ?? 'there'}</h1>
          <p className="lede">
            The catalogue, its photographs and who can change them.
          </p>
        </div>
        <Link to="/admin/plants/new" className="btn btn--primary">
          <Icon name="sprout" size={18} /> Add a plant
        </Link>
      </header>

      <div className="admin-stats">
        {stats.map((stat) => {
          const body = (
            <>
              <span className="admin-stat__icon"><Icon name={stat.icon} size={20} /></span>
              <strong className="admin-stat__value">{stat.value}</strong>
              <span className="admin-stat__label">{stat.label}</span>
              <span className="admin-stat__hint">{stat.hint}</span>
            </>
          );
          return stat.to
            ? <Link key={stat.label} to={stat.to} className="admin-stat admin-stat--link">{body}</Link>
            : <div key={stat.label} className="admin-stat">{body}</div>;
        })}
      </div>

      <div className="admin-cols">
        <section className="admin-card">
          <h2>Plants without a photograph</h2>
          {missing.length === 0 ? (
            <p className="muted">
              <Icon name="check-circle" size={16} /> Every plant in the catalogue has at
              least one photograph.
            </p>
          ) : (
            <>
              <p className="muted">
                These show a “photograph coming soon” panel on the website rather than a
                drawing, so nobody is shown artwork in place of the plant they would buy.
              </p>
              <ul className="admin-list">
                {missing.slice(0, 10).map((p) => (
                  <li key={p.slug}>
                    <span>{p.name}</span>
                    <Link to={`/admin/images?plant=${p.slug}`} className="link-arrow">
                      Add photographs <Icon name="arrow-right" size={15} />
                    </Link>
                  </li>
                ))}
              </ul>
              {missing.length > 10 && (
                <p className="muted">and {missing.length - 10} more.</p>
              )}
            </>
          )}
        </section>

        <section className="admin-card">
          <h2>Changes made here</h2>
          <p className="muted">
            Everything below is stored separately from the catalogue the site was built
            with, so it can all be undone.
          </p>
          <ul className="admin-list admin-list--plain">
            <li><span>Plants added</span><strong>{changes.added}</strong></li>
            <li><span>Plants edited</span><strong>{changes.edited}</strong></li>
            <li><span>Plants taken down</span><strong>{changes.removed}</strong></li>
          </ul>
          <Link to="/admin/plants" className="btn btn--secondary btn--sm">
            Manage plants <Icon name="arrow-right" size={16} />
          </Link>
        </section>
      </div>
    </>
  );
}
