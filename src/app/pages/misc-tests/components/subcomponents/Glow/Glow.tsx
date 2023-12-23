import { map } from '@/utils/utils';
import styles from './styles.module.scss';

export const Glow = ({ brightness }: { brightness: number }) => {
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
