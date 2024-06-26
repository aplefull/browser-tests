import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { decompressResponse, getErrorMessage } from '@/utils/utils';

const fetchVideoCss = async (controller: AbortController, onComplete: () => void) => {
  try {
    const response = await fetch('https://files.catbox.moe/p9ddvn.gz', {
      signal: controller.signal,
    });

    const decompressedResponse = await decompressResponse(response);
    const css = await decompressedResponse.text();

    const style = document.createElement('style');
    style.innerHTML = css;
    style.setAttribute('data-css-video', 'true');

    document.head.appendChild(style);

    onComplete();
  } catch (error) {
    if (
      error instanceof Error &&
      'name' in error &&
      'code' in error &&
      error.name === 'AbortError' &&
      error.code === 20
    ) {
      return;
    }

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

      await fetchVideoCss(controller, () => setLoaded(true));

      setLoading(false);
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
  };

  useEffect(() => {
    return () => {
      const styles = document.querySelectorAll('style[data-css-video]');

      styles.forEach((style) => {
        style.remove();
      });

      controller.abort();
    };
  }, []);

  return (
    <div>
      <div className={styles.cssVideoDescription}>
        <p className={styles.author}>
          <span>Original author: </span>
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
      {showCssVideo && loaded && (
        <div className={styles.container}>
          {Array.from({ length: 294 }).map((_, i) => (
            <div key={i} className={classNames(styles.component, styles[`component${i}`])} />
          ))}
        </div>
      )}
    </div>
  );
};
