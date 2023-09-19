import styles from './styles.module.scss';
import flyingCat from '@assets/images/cats/flying-cat.png';

export const TestObjectViewBox = () => {
  return (
    <div className={styles.objectViewBox}>
      <p>Hover over images</p>
      <div>
        <div className={styles.inset}>
          <img src={flyingCat} alt="cat" />
        </div>
        <div className={styles.zoomOut}>
          <img src={flyingCat} alt="cat" />
        </div>
      </div>
    </div>
  );
};
