import styles from './styles.module.scss';
import { range } from '@/utils/utils';

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
              <img src="/assets/images/flying-cat.jpg" alt="random image" />
              <img src="/assets/images/space-cat.jpg" alt="random image" />
              <span>{mode}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
