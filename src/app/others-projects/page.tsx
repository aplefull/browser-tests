import styles from './page.module.scss';

type TIframeEntry = {
  src: string;
  title: string;
  url?: string;
};

export const OthersProjectsPage = () => {
  const otherUrls = [
    'https://www.ohne-makler.net/',
    'https://www.shadertoy.com/',
    'https://www.joshwcomeau.com/shadow-palette/',
    'https://editor.audio/',
    'https://icones.js.org/',
    'https://css-generators.com/custom-corners/',
    'https://katex.org/',
    'https://yqnn.github.io/svg-path-editor/',
    'https://www.yourworldoftext.com/',
  ];

  const iframes: TIframeEntry[] = [
    { src: '/projects/rgb-cube/dist/index.html', title: 'RGB Cube', url: 'https://codepen.io/roborich/pen/wRMKaK' },
    {
      src: '/projects/cats-game/index.html',
      title: 'Game',
    },
  ];

  return (
    <div className={styles.container}>
      <h1>
        This page contains other's people cool projects.
        <br />
        Have fun c:
      </h1>
      <div className={styles.iframesContainer}>
        {iframes.map(({ title, src, url }) => {
          return (
            <div key={src}>
              <h2>{title}</h2>
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              )}
              <iframe src={src} loading="lazy" className={styles.iframe} />
            </div>
          );
        })}
      </div>
      <h2>Other interesting pages to see</h2>
      <div className={styles.links}>
        {otherUrls.map((url) => (
          <a key={url} target="_blank" rel="noopener noreferrer" href={url}>
            {url}
          </a>
        ))}
      </div>
    </div>
  );
};
