import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { isIterable, isNode } from '@/utils/utils';

type TPopoverProps = {
  children: ReactNode;
  content: ReactNode;
  onClickOutside?: () => void;
  isOpen?: boolean;
  className?: string;
  popoverClassName?: string;
  zIndex?: number;
};

export const Popover = ({
  children,
  content,
  className,
  popoverClassName,
  isOpen,
  onClickOutside,
  zIndex,
}: TPopoverProps) => {
  const childrenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const childrenElement = childrenRef.current;

    if (!childrenElement) return;

    setPosition(childrenElement.getBoundingClientRect());
  }, [children]);

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!isOpen) return;

      setPosition(childrenRef.current?.getBoundingClientRect() || null);
    };

    const resizeObserver = new ResizeObserver(updatePosition);

    if (isOpen) {
      resizeObserver.observe(document.body);

      if (childrenRef.current) {
        resizeObserver.observe(childrenRef.current);
      }

      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);

      resizeObserver.disconnect();
    };
  }, [isOpen]);

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
    zIndex,
  };

  return (
    <>
      <div ref={childrenRef} className={className}>
        {children}
      </div>
      {isOpen &&
        createPortal(
          <div ref={contentRef} className={classNames(popoverClassName, styles.content)} style={popoverStyle}>
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
