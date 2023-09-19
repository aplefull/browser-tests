import styles from './styles.module.scss';

export const TestTextFillColor = () => {
  return (
    <div className={styles.textFillColor}>
      <h2>Plain color:</h2>
      <p className={styles.plainColor}>This text should be red.</p>
      <h2>Gradient:</h2>
      <p className={styles.gradient}>This text should be gradient.</p>
      <h2>Animated gradient:</h2>
      <p className={styles.animatedGradient}>This text should be gradient sliding from right to left.</p>
      <h2>Animated hue</h2>
      <p className={styles.animatedColor}>This text should slowly change its color.</p>
      <h2>Image fill:</h2>
      <p className={styles.imageFill}>This text should be filled with image.</p>
    </div>
  );
};
