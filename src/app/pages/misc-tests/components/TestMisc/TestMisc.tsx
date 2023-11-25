import styles from './styles.module.scss';
import { MikuArt } from '@/app/pages/misc-tests/components/subcomponents/MikuArt/MikuArt';
import { map } from '@/utils/utils';
import classNames from 'classnames';

// TODO this file needs to be refactored
const Glow = ({ brightness }: { brightness: number }) => {
  const getRGBComponents = (color: string) => {
    const args = color.slice(4, -1).split(',');
    const [r, g, b] = args;

    return {
      r: parseInt(r),
      g: parseInt(g),
      b: parseInt(b),
    };
  };

  const getRGBString = (r: number, g: number, b: number) => {
    return `rgb(${r}, ${g}, ${b})`;
  };

  const setBrightness = (color: string, percent: number) => {
    const { r, g, b } = getRGBComponents(color);

    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;

    const newR = Math.round((t - r) * p) + r;
    const newG = Math.round((t - g) * p) + g;
    const newB = Math.round((t - b) * p) + b;

    return getRGBString(newR, newG, newB);
  };

  const getRadius = (start: number, i: number) => {
    return start * 2 ** i;
  };

  const glowComponents = [
    { color: 'rgb(255, 222, 255)', radius: 0 },
    { color: 'rgb(255, 222, 255)', radius: 1 },
    { color: 'rgb(255, 222, 255)', radius: 2 },
    { color: 'rgb(168, 61, 240)', radius: 3 },
    { color: 'rgb(168, 61, 240)', radius: 4 },
    { color: 'rgb(168, 61, 240)', radius: 5 },
  ];

  const shadowRadius = map(brightness, 0, 100, 0, 3.5);
  const opacity = map(brightness, 0, 100, 0, 1);

  const glow = glowComponents
    .map(({ color, radius }) => {
      const rgb = setBrightness(color, 0);
      const r = getRadius(shadowRadius, radius);

      return `drop-shadow(${rgb} 0px 0px ${r}px)`;
    })
    .join(' ');

  return (
    <div
      className={styles.glowDiv}
      style={{
        backgroundColor: `rgba(255, 222, 255, ${opacity})`,
        filter: `${glow}`,
      }}
    />
  );
};

export const TestMisc = () => {
  // TODO remove
  const divs = (n: number) => {
    return n === 0 ? null : <div>{divs(n - 1)}</div>;
  };

  const divsSelector = (n: number) => {
    return n === 1 ? 'div' : `div > ${divsSelector(n - 1)}`;
  };

  return (
    <div className={styles.misc}>
      <h2>Glow effect</h2>
      <div className={styles.glow}>
        <Glow brightness={50} />
      </div>
      <h2>CSS art</h2>
      <MikuArt />
      <h2>Scrolls</h2>
      <div className={styles.counterAnimation} />
      {/*      <div className={styles.nestedDivs}>
        <style>{`${divsSelector(1000)} { background-color: green; };`}</style>
        {divs(1000)}
      </div>*/}
    </div>
  );
};
