import React, { ReactNode, useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { createPortal } from 'react-dom';

type TContextMenuProps = {
  children: ReactNode;
  content: ReactNode;
};

export const ContextMenu = ({ children, content }: TContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    if (isOpen) {
      const handleDocumentClick = () => {
        setIsOpen(false);
      };

      document.addEventListener('click', handleDocumentClick);

      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }
  }, [isOpen]);

  const style = {
    top: position.y + window.scrollY,
    left: position.x,
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>{children}</div>
      {isOpen &&
        createPortal(
          <div className={styles.menu} style={style}>
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
