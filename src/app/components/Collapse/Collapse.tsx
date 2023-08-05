import styles from './style.module.scss';
import { ReactNode, TransitionEvent, useState } from 'react';
import classNames from 'classnames';
import { ChevronRight } from 'tabler-icons-react';

type TCollapseProps = {
  children: ReactNode;
  title?: string;
  unmountChildren?: boolean;
  showIcon?: boolean;
  head?: ReactNode;
  headClassName?: string;
  childrenClassName?: string;
  defaultOpen?: boolean;
};

export const Collapse = ({
  children,
  title,
  head,
  unmountChildren,
  showIcon = true,
  headClassName,
  childrenClassName,
  defaultOpen,
}: TCollapseProps) => {
  const [open, setOpen] = useState(defaultOpen || false);
  const [renderChildren, setRenderChildren] = useState(open || !unmountChildren);

  const toggle = () => {
    setOpen((open) => {
      if (!open) {
        setRenderChildren(true);
      }

      return !open;
    });
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'grid-template-rows' || open) return;
    setRenderChildren(!unmountChildren);
  };

  return (
    <div className={styles.collapse}>
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
        <div className={childrenClassName}>{renderChildren && children}</div>
      </div>
    </div>
  );
};
