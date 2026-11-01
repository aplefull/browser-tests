import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { createPortal } from 'react-dom';
import { isNode } from '@/utils/utils';

type TContextMenuProps = {
  children: ReactNode;
  content: ReactNode;
};

const VIEWPORT_MARGIN = 8;

export const ContextMenu = ({ children, content }: TContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  };

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!isOpen || !menu) return;

    const { width, height } = menu.getBoundingClientRect();
    const maxX = window.innerWidth - width - VIEWPORT_MARGIN;
    const maxY = window.innerHeight - height - VIEWPORT_MARGIN;
    const x = position.x > maxX ? Math.max(VIEWPORT_MARGIN, position.x - width) : position.x;
    const y = position.y > maxY ? Math.max(VIEWPORT_MARGIN, position.y - height) : position.y;

    menu.style.transform = `translate(${x}px, ${y}px)`;
    menu.style.visibility = 'visible';
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);

    const handleContextMenu = (event: MouseEvent) => {
      if (isNode(event.target) && triggerRef.current?.contains(event.target)) return;
      close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('click', close);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);
    window.addEventListener('blur', close);

    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
      window.removeEventListener('blur', close);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={triggerRef} onContextMenu={handleContextMenu}>
        {children}
      </div>
      {isOpen &&
        createPortal(
          <div ref={menuRef} className={styles.menu} role="menu">
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
