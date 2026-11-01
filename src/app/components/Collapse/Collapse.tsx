import styles from './styles.module.scss';
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ChevronRight } from 'tabler-icons-react';

type TCollapseProps = {
  children: ReactNode;
  open: boolean;
  title?: string;
  showIcon?: boolean;
  head?: ReactNode;
  headClassName?: string;
  bodyClassName?: string;
  className?: string;
  onChange?: (open: boolean) => void;
};

export const Collapse = ({
  children,
  title,
  head,
  showIcon = true,
  headClassName,
  bodyClassName,
  className,
  open,
  onChange,
}: TCollapseProps) => {
  const [shouldRenderChildren, setShouldRenderChildren] = useState(open);
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    onChange?.(!open);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  };

  useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) return;

    if (open) {
      setShouldRenderChildren(true);
      return;
    }

    if (!parseFloat(getComputedStyle(bodyElement).transitionDuration)) {
      setShouldRenderChildren(false);
      return;
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === bodyElement && event.propertyName === 'grid-template-rows') {
        setShouldRenderChildren(false);
      }
    };

    bodyElement.addEventListener('transitionend', handleTransitionEnd);
    return () => bodyElement.removeEventListener('transitionend', handleTransitionEnd);
  }, [open]);

  return (
    <div className={classNames(styles.collapse, className, { [styles.open]: open })}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        className={headClassName || styles.collapseHead}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        {head && head}
        {!head && (
          <div className={styles.left}>
            {showIcon && (
              <div className={classNames(styles.iconContainer, { [styles.open]: open })}>
                <ChevronRight className={styles.icon} size={16} />
              </div>
            )}
            {title && <span>{title}</span>}
          </div>
        )}
      </div>
      <div ref={bodyRef} className={styles.collapseBody}>
        <div className={styles.collapseInner}>
          <div className={bodyClassName}>{shouldRenderChildren && children}</div>
        </div>
      </div>
    </div>
  );
};
