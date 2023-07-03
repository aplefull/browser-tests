import styles from './styles.module.scss';
import catImage from '@assets/images/space-cat.jpg';

export default function TestCssFilters() {
  const filters = [
    'blur',
    'brightness',
    'contrast',
    'drop-shadow',
    'grayscale',
    'hue-rotate',
    'invert',
    'opacity',
    'saturate',
    'sepia',
  ];

  return (
    <section className={styles.cssFilters}>
      <h1>CSS filters</h1>
      <div>
        {filters.map((filter, index) => (
          <div key={index}>
            <img src={catImage} alt="cat image" />
            <span>{filter}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
