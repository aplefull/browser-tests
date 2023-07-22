import styles from './styles.module.scss';

export default function TestLargeImage() {
  return (
    <section className={styles.testLargeImage}>
      <h1>Very large image</h1>
      <div>
        <input type="checkbox" id="large-image-animation" defaultChecked={false} />
        <label htmlFor="large-image-animation">Enable animation</label>
        <div>
          <img src="https://files.catbox.moe/zjiokj.png" alt="very large image" />
        </div>
      </div>
    </section>
  );
}
