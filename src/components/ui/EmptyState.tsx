import type { ReactNode } from 'react';
import Icon, { type IconName } from './Icon';

interface Props {
  icon?: IconName;
  title: string;
  message?: string;
  action?: ReactNode;
}

/** Used wherever a list can come back empty, so no blank space is ever shown. */
export function EmptyState({ icon = 'leaf', title, message, action }: Props) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon"><Icon name={icon} size={26} /></span>
      <h3>{title}</h3>
      {message && <p className="muted">{message}</p>}
      {action && <div className="row" style={{ justifyContent: 'center' }}>{action}</div>}
    </div>
  );
}

export default EmptyState;
