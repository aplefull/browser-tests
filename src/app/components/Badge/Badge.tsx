import { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

type TBadgeProps = {
  variant?: 'success' | 'danger' | 'warning' | 'neutral';
  children: ReactNode;
  className?: string;
};

export const Badge = ({ variant = 'neutral', children, className }: TBadgeProps) => {
  return <span className={classNames(styles.badge, styles[variant], className)}>{children}</span>;
};
