import { useState } from 'react';
import pako from 'pako';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { getErrorMessage } from '@/utils/utils';

const fetchVideoCss = async (controller: AbortController) => {
  try {
    const res = await fetch('https://files.catbox.moe/559pye.css', { signal: controller.signal });
    const compressedCss = await res.arrayBuffer();

    const cssArrayBuffer = pako.inflate(compressedCss);
    const css = new TextDecoder('utf-8').decode(cssArrayBuffer);

    const style = document.createElement('style');
    style.innerHTML = css;

    document.head.appendChild(style);
  } catch (error) {
    console.error(getErrorMessage(error));
  }
};

export const CssVideo = () => {
  const [showCssVideo, setShowCssVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [controller, setController] = useState(new AbortController());

  const handleButtonClick = async () => {
    if (!showCssVideo) {
      if (loaded) {
        setShowCssVideo(true);
        return;
      }

      setShowCssVideo(true);
      setLoading(true);

      await fetchVideoCss(controller);

      setLoading(false);
      setLoaded(true);
      return;
    }

    if (loaded) {
      setShowCssVideo(false);
      return;
    }

    controller.abort();
    setController(new AbortController());
    setLoading(false);
    setShowCssVideo(false);
    setLoaded(false);
  };

  return (
    <div>
      <div className={styles.cssVideoDescription}>
        <p className={styles.author}>
          Original author:{' '}
          <a target="_blank" rel="noreferrer" href="https://github.com/kevinjycui">
            https://github.com/kevinjycui
          </a>
        </p>

        {loading && (
          <div className={styles.loading}>
            <span>Please wait, huge css file is being loaded and decompressed...</span>
          </div>
        )}

        {!loading && (
          <p className={styles.warning}>
            <span>Warning</span>
            This is a very heavy and demanding css animation, which will most definitely crash your browser. That's why
            it's not shown by default. If you are feeling courageous, make sure there is nothing important happening in
            your browser before pressing the button below.
          </p>
        )}

        <Button
          text={!showCssVideo ? "Let's do it..." : loaded ? 'Remove that from here!' : 'I changed my mind!'}
          onClick={handleButtonClick}
        />
      </div>
      {showCssVideo && (
        <div className={styles.container}>
          {Array.from({ length: 294 }).map((_, i) => (
            <div key={i} className={classNames(styles.component, `component-${i}`)} />
          ))}
        </div>
      )}
    </div>
  );
};
