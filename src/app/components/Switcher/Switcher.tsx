import styles from './styles.module.scss';
import classNames from 'classnames';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { ReactNode, useEffect, useRef } from 'react';

type TSwitcherProps = {
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
  children?: ReactNode;
};

export const Switcher = ({ className, onPrev, onNext, children }: TSwitcherProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (document.activeElement !== ref.current) return;

      if (e.key === 'ArrowLeft') {
        onPrev?.();
      } else if (e.key === 'ArrowRight') {
        onNext?.();
      }
    };

    ref.current?.addEventListener('keydown', handleKeyPress);

    return () => {
      ref.current?.removeEventListener('keydown', handleKeyPress);
    };
  }, [onPrev, onNext]);

  return (
    <div ref={ref} className={classNames(styles.switcher, className)} tabIndex={0}>
      <div className={styles.button} onClick={onPrev}>
        <ChevronLeft size={20} />
      </div>
      {children && <div className={styles.children}>{children}</div>}
      <div className={styles.button} onClick={onNext}>
        <ChevronRight size={20} />
      </div>
    </div>
  );
};
