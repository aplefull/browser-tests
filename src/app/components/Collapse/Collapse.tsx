import styles from './styles.module.scss';
import { ReactNode, useEffect, useRef, useState } from 'react';
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
    if (onChange) {
      onChange(!open);
    }
  };

  useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === bodyElement && event.propertyName === 'height') {
        if (!open) {
          setShouldRenderChildren(false);
        }
      }
    };

    if (open) {
      setShouldRenderChildren(true);
    }

    bodyElement.addEventListener('transitionend', handleTransitionEnd);
    return () => bodyElement.removeEventListener('transitionend', handleTransitionEnd);
  }, [open]);

  return (
    <div className={classNames(styles.collapse, className, { [styles.open]: open })}>
      <div className={headClassName || styles.collapseHead} onClick={toggle}>
        {head && head}
        {!head && (
          <div className={styles.left}>
            {showIcon && (
              <div className={classNames(styles.iconContainer, { [styles.open]: open })}>
                <ChevronRight className={styles.icon} />
              </div>
            )}
            {title && <span>{title}</span>}
          </div>
        )}
      </div>
      <div ref={bodyRef} className={classNames(styles.collapseBody, bodyClassName)}>
        {shouldRenderChildren && children}
      </div>
    </div>
  );
};
