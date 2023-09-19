import { cloneElement, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';

type TPopoverProps = {
  children: ReactNode;
  content: ReactNode;
  isOpen?: boolean;
  className?: string;
};

// TODO move to type guards
const isIterable = <T,>(obj: unknown): obj is Iterable<T> => {
  return Symbol.iterator in Object(obj);
};

export const Popover = ({ children, content, className, isOpen }: TPopoverProps) => {
  const childrenRef = useRef<HTMLElement>(null);

  const [position, setPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const childrenElement = childrenRef.current;

    if (!childrenElement) return;

    setPosition(childrenElement.getBoundingClientRect());
  }, [children]);

  if (children === null || children === undefined || typeof children === 'boolean') return;

  if (typeof children === 'string' || typeof children === 'number') {
    return;
  }

  if (isIterable(children)) {
    return;
  }

  const scrollY = window.scrollY;
  const popoverStyle = {
    transform: `translate(${position?.left || 0}px, ${(position?.bottom || 0) + scrollY}px)`,
  };

  return (
    <>
      {cloneElement(children, {
        ref: childrenRef,
      })}
      {isOpen &&
        createPortal(
          <div className={classNames(className, styles.content)} style={popoverStyle}>
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
