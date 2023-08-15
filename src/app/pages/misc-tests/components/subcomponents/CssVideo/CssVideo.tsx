import { useEffect, useState } from 'react';
import pako from 'pako';
import classNames from 'classnames';
import styles from './styles.module.scss';

export const CssVideo = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoCss = async () => {
      const res = await fetch('https://files.catbox.moe/559pye.css');
      const compressedCss = await res.arrayBuffer();
      const cssArrayBuffer = pako.inflate(compressedCss);
      const css = new TextDecoder('utf-8').decode(cssArrayBuffer);
      const style = document.createElement('style');
      style.innerHTML = css;
      document.head.appendChild(style);

      setLoading(false);
    };

    fetchVideoCss().catch(console.error);
  }, []);

  if (loading)
    return (
      <div className={styles.loading}>
        <span>Please wait, huge css file is being loaded and decompressed...</span>
      </div>
    );

  return (
    <div className={styles.container}>
      {Array.from({ length: 294 }).map((_, i) => (
        <div key={i} className={classNames(styles.component, `component-${i}`)} />
      ))}
    </div>
  );
};
