import styles from './styles.module.scss';
import flyingCat from '@assets/images/cats/flying-cat.png';
import spaceCat from '@assets/images/cats/space-cat.jpg';
import { Section } from '@/app/components/Section/Section';

export const TestCssBlendModes = () => {
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
    <Section className={styles.cssBlendModes} title="CSS blend modes">
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
    </Section>
  );
};
