import styles from '@/app/misc-tests/components/TestLayouts/layouts.module.scss';
import React, { useState } from 'react';

export const CSSMasonry = ({ urls }: { urls: string[] }) => {
  const [dialogSrc, setDialogSrc] = useState<string | null>(null);
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  const handleClick = (src: string) => () => {
    setDialogSrc(src);
    dialogRef.current?.showModal();
  };

  return (
    <div className={styles.masonryContainer}>
      <div className={styles.masonry}>
        {urls.map((url, i) => {
          return (
            <div key={i} className={styles.item} onClick={handleClick(url)}>
              <img src={url} alt="image" />
            </div>
          );
        })}
      </div>
      <dialog id="dialog" ref={dialogRef}>
        <form method="dialog">
          <menu>
            <button type="submit">Close</button>
          </menu>
        </form>
        <img src={dialogSrc || undefined} alt="image" />
      </dialog>
    </div>
  );
};
