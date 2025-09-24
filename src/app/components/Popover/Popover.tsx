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
  keepInViewport?: boolean;
  viewportMargin?: number;
  anchorMargin?: number;
  anchor?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  target?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
};

export const Popover = ({
  children,
  content,
  className,
  popoverClassName,
  isOpen,
  onClickOutside,
  zIndex,
  keepInViewport = true,
  viewportMargin = 10,
  anchorMargin = 5,
  anchor = { horizontal: 'center', vertical: 'bottom' },
  target = { horizontal: 'center', vertical: 'top' },
}: TPopoverProps) => {
  const [childrenRect, setChildrenRect] = useState<DOMRect | null>(null);
  const [contentRect, setContentRect] = useState<DOMRect | null>(null);

  const childrenRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const childrenElement = childrenRef.current;

    if (!childrenElement) return;

    setChildrenRect(childrenElement.getBoundingClientRect());
  }, [children]);

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!isOpen) return;

      setChildrenRect(childrenRef.current?.getBoundingClientRect() || null);
    };

    const updateContentSize = (entries: ResizeObserverEntry[]) => {
      setContentRect(entries[0].contentRect);
    };

    const resizeObserver = new ResizeObserver(updatePosition);
    const contentResizeObserver = new ResizeObserver(updateContentSize);

    if (isOpen) {
      resizeObserver.observe(document.body);

      if (childrenRef.current) {
        resizeObserver.observe(childrenRef.current);
      }

      if (contentRef.current) {
        contentResizeObserver.observe(contentRef.current);
      }

      window.addEventListener('scroll', updatePosition);
    }

    if (!isOpen) {
      setContentRect(null);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);

      resizeObserver.disconnect();
      contentResizeObserver.disconnect();
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

  const getPopoverPosition = () => {
    if (!childrenRect || !contentRect) {
      return {
        x: 0,
        y: 0,
      };
    }

    // 1. Calculate position respecting anchor constraints
    // 2. Adjust position respecting target constraints
    // 3. Adjust position to keep in viewport

    const { innerWidth, innerHeight } = window;

    // Step 1:
    let x = 0;
    let y = 0;

    switch (anchor.horizontal) {
      case 'left':
        x = childrenRect.left - anchorMargin;
        break;
      case 'center':
        x = childrenRect.left + childrenRect.width / 2;
        break;
      case 'right':
        x = childrenRect.right + anchorMargin;
        break;
    }

    switch (anchor.vertical) {
      case 'top':
        y = childrenRect.top - anchorMargin;
        break;
      case 'center':
        y = childrenRect.top + childrenRect.height / 2;
        break;
      case 'bottom':
        y = childrenRect.bottom + anchorMargin;
        break;
    }

    // Step 2:
    switch (target.horizontal) {
      case 'left':
        break;
      case 'center':
        x -= contentRect.width / 2;
        break;
      case 'right':
        x -= contentRect.width;
        break;
    }

    switch (target.vertical) {
      case 'top':
        break;
      case 'center':
        y -= contentRect.height / 2;
        break;
      case 'bottom':
        y -= contentRect.height;
        break;
    }

    // Step 3:
    if (keepInViewport) {
      if (x < viewportMargin) {
        x = viewportMargin;
      }

      if (x + contentRect.width > innerWidth - viewportMargin) {
        x = innerWidth - contentRect.width - viewportMargin;
      }

      if (y < viewportMargin) {
        y = viewportMargin;
      }

      if (y + contentRect.height > innerHeight - viewportMargin) {
        y = innerHeight - contentRect.height - viewportMargin;
      }
    }

    return {
      x: x,
      y: y,
    };
  };

  const scrollY = window.scrollY;
  const popoverPosition = getPopoverPosition();

  const popoverStyle = {
    transform: `translate(${popoverPosition.x}px, ${popoverPosition.y + scrollY}px)`,
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
