import styles from './styles.module.scss';

export const TestWritingModes = () => {
  return (
    <div className={styles.writingModes}>
      <div className={styles.rectangleContainer}>
        <span>Lorem ipsum dolor sit amet.</span>
        <span>Lorem ipsum dolor sit amet.</span>
        <span>Lorem ipsum dolor sit amet.</span>
        <span>Lorem ipsum dolor sit amet.</span>
      </div>
      <div className={styles.direction}>
        <span>Normal text.</span>
        <span>日本語のテキスト。</span>
        <span>👍🏻👍🏼👍🏽👍🏾👍🏿</span>
        <span>The ‮quick brown fox‬ jumped. (Bi-directional)</span>
      </div>
    </div>
  );
};
