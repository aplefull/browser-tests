import { cloneElement, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { isNode } from '@/utils/utils';

type TPopoverProps = {
  children: ReactNode;
  content: ReactNode;
  onClickOutside?: () => void;
  isOpen?: boolean;
  className?: string;
};

// TODO move to type guards
const isIterable = <T,>(obj: unknown): obj is Iterable<T> => {
  return Symbol.iterator in Object(obj);
};

export const Popover = ({ children, content, className, isOpen, onClickOutside }: TPopoverProps) => {
  const childrenRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const childrenElement = childrenRef.current;

    if (!childrenElement) return;

    setPosition(childrenElement.getBoundingClientRect());
  }, [children]);

  useEffect(() => {
    const updatePosition = () => {
      setPosition(childrenRef.current?.getBoundingClientRect() || null);
    };

    const resizeObserver = new ResizeObserver(updatePosition);

    resizeObserver.observe(document.body);

    if (childrenRef.current?.parentElement) {
      resizeObserver.observe(childrenRef.current.parentElement);
    }

    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);

      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((isNode(event.target) && contentRef.current?.contains(event.target)) || !isOpen) return;
      if (isNode(event.target) && childrenRef.current?.contains(event.target)) return;
      if (!onClickOutside) return;

      onClickOutside();
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

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
          <div ref={contentRef} className={classNames(className, styles.content)} style={popoverStyle}>
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
