import styles from './styles.module.scss';
import catImage from '@assets/images/cats/space-cat.jpg';

export const TestCssFilters = () => {
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
    <div className={styles.cssFilters}>
      {filters.map((filter, index) => (
        <div key={index}>
          <img src={catImage} alt="cat image" />
          <span>{filter}</span>
        </div>
      ))}
    </div>
  );
};
