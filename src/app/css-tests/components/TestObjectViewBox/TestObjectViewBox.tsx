import styles from './styles.module.scss';
import flyingCat from '@assets/images/cats/flying-cat.png';

export default function TestObjectViewBox() {
  return (
    <section className={styles.objectViewBox}>
      <h1>Object view box</h1>
      <p>Hover over images</p>
      <div>
        <div className={styles.inset}>
          <img src={flyingCat} alt="cat" />
        </div>
        <div className={styles.zoomOut}>
          <img src={flyingCat} alt="cat" />
        </div>
      </div>
    </section>
  );
}
