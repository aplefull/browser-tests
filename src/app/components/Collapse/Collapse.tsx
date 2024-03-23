import styles from './styles.module.scss';
import { ReactNode, TransitionEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { ChevronRight } from 'tabler-icons-react';
import { wait } from '@utils';

type TCollapseProps = {
  children: ReactNode;
  open: boolean;
  title?: string;
  unmountChildren?: boolean;
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
  unmountChildren = true,
  showIcon = true,
  headClassName,
  bodyClassName,
  className,
  open,
  onChange,
}: TCollapseProps) => {
  const [renderChildren, setRenderChildren] = useState(open || !unmountChildren);
  const [childrenHeight, setChildrenHeight] = useState<number | null>(null);
  const [finishedTransition, setFinishedTransition] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (onChange) {
      onChange(!open);
    }
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'height') {
      setFinishedTransition(true);
    }

    if (open) return;

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

  useEffect(() => {
    if (finishedTransition) {
      setFinishedTransition(false);
    }

    const updateHeight = async () => {
      if (bodyRef.current) {
        const maxDelay = 100;

        if (open) {
          // Measure height of children.
          // If it's 0, most likely it's not rendered yet, so we wait for it to render.
          let delay = 0;
          while (bodyRef.current.scrollHeight === 0 && delay < maxDelay) {
            await wait(10);
            delay += 10;
          }

          setChildrenHeight(bodyRef.current.scrollHeight);

          // If height is still 0, we set it to auto and finish transition, since transitionEnd event won't fire.
          if (bodyRef.current.scrollHeight === 0) {
            setFinishedTransition(true);
          }
        } else {
          bodyRef.current.style.height = `${bodyRef.current.scrollHeight}px`;
          setChildrenHeight(0);
        }
      }
    };

    updateHeight().catch(console.error);
  }, [open, renderChildren]);

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
        ref={bodyRef}
        style={{
          height: finishedTransition ? 'auto' : childrenHeight || 0,
        }}
        onTransitionEnd={handleTransitionEnd}
        className={classNames(styles.collapseBody, bodyClassName, {
          [styles.open]: open,
        })}
      >
        {renderChildren && children}
      </div>
    </div>
  );
};
