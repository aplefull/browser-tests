import styles from './styles.module.scss';
import flyingCat from '@assets/images/cats/flying-cat.png';
import spaceCat from '@assets/images/cats/space-cat.jpg';

export default function TestCssBlendModes() {
  const modes = [
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
  ];

  return (
    <section className={styles.cssBlendModes}>
      <h1>CSS blend modes</h1>
      <div>
        {modes.map((mode) => {
          return (
            <div key={mode}>
              <img src={flyingCat} alt="random image" />
              <img src={spaceCat} alt="random image" />
              <span>{mode}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
