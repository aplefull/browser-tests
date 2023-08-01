import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

export const CssVideo = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoCss = async () => {
      const res = await fetch('https://files.catbox.moe/yohjlq.css');
      const css = await res.text();
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
        <span>Please wait, huge css file is loading...</span>
      </div>
    );

  return (
    <div className={styles.container}>
      {Array.from({ length: 294 }).map((_, i) => (
        <div key={i} className={classNames(styles.component, styles[`component${i}`])} />
      ))}
    </div>
  );
};
