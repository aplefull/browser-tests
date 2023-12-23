import styles from './styles.module.scss';
import { ReactNode, TransitionEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ChevronRight } from 'tabler-icons-react';

type TCollapseProps = {
  children: ReactNode;
  open: boolean;
  title?: string;
  unmountChildren?: boolean;
  showIcon?: boolean;
  head?: ReactNode;
  headClassName?: string;
  childrenClassName?: string;
  className?: string;
  onChange?: (open: boolean) => void;
};

export const Collapse = ({
  children,
  title,
  head,
  unmountChildren,
  showIcon = true,
  headClassName,
  childrenClassName,
  className,
  open,
  onChange,
}: TCollapseProps) => {
  const [renderChildren, setRenderChildren] = useState(open || !unmountChildren);

  const toggle = () => {
    if (onChange) {
      onChange(!open);
    }
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'grid-template-rows' || open) return;
    setRenderChildren(!unmountChildren);
  };

  useEffect(() => {
    if (open) {
      setRenderChildren(true);
    }

    if (!open && !unmountChildren) {
      setRenderChildren(true);
    }
  }, [open]);

  return (
    <div className={classNames(styles.collapse, className)}>
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
      <div
        onTransitionEnd={handleTransitionEnd}
        className={classNames(styles.collapseBody, {
          [styles.open]: open,
        })}
      >
        <div>{renderChildren && children}</div>
      </div>
    </div>
  );
};
