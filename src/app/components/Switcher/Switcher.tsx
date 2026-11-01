import styles from './styles.module.scss';
import classNames from 'classnames';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { KeyboardEvent, ReactNode } from 'react';

type TSwitcherProps = {
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
  children?: ReactNode;
};

export const Switcher = ({ className, onPrev, onNext, children }: TSwitcherProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrev?.();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext?.();
    }
  };

  return (
    <div className={classNames(styles.switcher, className)} tabIndex={0} onKeyDown={handleKeyDown}>
      <button type="button" tabIndex={-1} aria-label="Previous" className={styles.button} onClick={onPrev}>
        <ChevronLeft size={16} />
      </button>
      {children && <div className={styles.children}>{children}</div>}
      <button type="button" tabIndex={-1} aria-label="Next" className={styles.button} onClick={onNext}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
