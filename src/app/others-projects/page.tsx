import styles from './page.module.scss';

export const OthersProjectsPage = () => {
  return (
    <div className={styles.container}>
      <h1>
        This page contains other's people cool projects. Each section has a link to an original project.
        <br />
        Have fun c:
      </h1>
      <div>
        <iframe src="/projects/rgb-cube/dist/index.html" loading="lazy" className={styles.iframe} />
      </div>
      <div>
        <iframe src="/projects/cats-game/index.html" loading="lazy" className={styles.iframe} />
      </div>
    </div>
  );
};
