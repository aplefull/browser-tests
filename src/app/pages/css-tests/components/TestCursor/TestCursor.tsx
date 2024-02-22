import svgImage from '@assets/images/cursors/svg.svg';
import transparentImage from '@assets/images/cursors/png.png';
import iconImage from '@assets/images/cursors/ico.ico';
import cursorImage from '@assets/images/cursors/cur.cur';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { getImageSize } from '@utils';

const defaultCursors = [
  'default',
  'none',
  'context-menu',
  'help',
  'pointer',
  'progress',
  'wait',
  'cell',
  'crosshair',
  'text',
  'vertical-text',
  'alias',
  'copy',
  'move',
  'no-drop',
  'not-allowed',
  'grab',
  'grabbing',
  'all-scroll',
  'col-resize',
  'row-resize',
  'n-resize',
  'e-resize',
  's-resize',
  'w-resize',
  'ne-resize',
  'nw-resize',
  'se-resize',
  'sw-resize',
  'ew-resize',
  'ns-resize',
  'nesw-resize',
  'nwse-resize',
  'zoom-in',
  'zoom-out',
];

export const TestCursor = () => {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const assignUrls = async () => {
      const images = [svgImage, transparentImage, cursorImage, iconImage];
      const sizes = await Promise.all(images.map(getImageSize));

      const urls = images.map(
        (image, index) => `url(${image}) ${sizes[index].width / 2} ${sizes[index].height / 2}, pointer`,
      );

      setUrls(urls);
    };

    assignUrls().catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <span>Default:</span>
      <div className={styles.defaultCursors}>
        {defaultCursors.map((cursor) => (
          <div key={cursor} className={styles.cursor} style={{ cursor }} title={cursor} />
        ))}
      </div>
      <span>Custom:</span>
      <div className={styles.customCursors}>
        {urls.map((url, index) => (
          <div key={index} className={styles.cursor} style={{ cursor: url }} />
        ))}
      </div>
    </div>
  );
};
