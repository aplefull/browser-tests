import styles from './style.module.scss';
import { ReactNode, TransitionEvent, useState } from 'react';
import classNames from 'classnames';
import { ChevronRight } from 'tabler-icons-react';

type TCollapseProps = {
  children: ReactNode;
  title: string;
  unmountChildren?: boolean;
  showIcon?: boolean;
};

export const Collapse = ({ children, title, unmountChildren, showIcon = true }: TCollapseProps) => {
  const [open, setOpen] = useState(false);
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
      <div className={styles.collapseHead} onClick={toggle}>
        {showIcon && (
          <div className={classNames(styles.iconContainer, { [styles.open]: open })}>
            <ChevronRight className={styles.icon} />
          </div>
        )}
        <span>{title}</span>
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
