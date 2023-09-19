import styles from './styles.module.scss';

export const TestLargeImage = () => {
  return (
    <div className={styles.testLargeImage}>
      <input type="checkbox" id="large-image-animation" defaultChecked={false} />
      <label htmlFor="large-image-animation">Enable animation</label>
      <div>
        <img src="https://files.catbox.moe/zjiokj.png" alt="very large image" />
      </div>
    </div>
  );
};
