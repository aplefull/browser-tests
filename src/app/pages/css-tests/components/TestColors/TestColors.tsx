import styles from './styles.module.scss';
import { useState } from 'react';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';

export const TestColors = () => {
  const [R, setR] = useState(0.5);
  const [G, setG] = useState(0.5);
  const [B, setB] = useState(1);

  const colorSpaces = [
    'srgb',
    'display-p3',
    'a98-rgb',
    'rec2020',
    'prophoto-rgb',
    'xyz-d50',
    'xyz',
    'xyz-d65',
    'srgb-linear',
  ];

  const wideGamutColors = [
    {
      func: 'hwb',
      value: {
        a: '0.75turn',
        b: '47%',
        c: '-30%',
      },
    },
    {
      func: 'lab',
      value: {
        a: '63.22',
        b: '57.8',
        c: '-75.06',
      },
    },
    {
      func: 'lch',
      value: {
        a: '62',
        b: '89',
        c: '308deg',
      },
    },
    {
      func: 'oklab',
      value: {
        a: '70%',
        b: '0.12',
        c: '-0.19',
      },
    },
    {
      func: 'oklch',
      value: {
        a: '73%',
        b: '0.27',
        c: '295',
      },
    },
  ];

  return (
    <div className={styles.colors}>
      <div className={styles.color}>
        <h2>color() and different color-spaces</h2>
        <div className={styles.inputs}>
          <RangeInput min={0} max={1} step={0.05} value={R} label="R" labelPosition="left" onChange={setR} />
          <RangeInput min={0} max={1} step={0.05} value={G} label="G" labelPosition="left" onChange={setG} />
          <RangeInput min={0} max={1} step={0.05} value={B} label="B" labelPosition="left" onChange={setB} />
        </div>
        <div>
          {colorSpaces.map((colorSpace) => {
            const color = `color(${colorSpace} ${R} ${G} ${B}  / 0.95)`;

            return (
              <div key={colorSpace} className={styles.colorSquare} style={{ backgroundColor: color }}>
                <pre>{colorSpace}</pre>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.wideGamut}>
        <h2>Wide Gamut Colors</h2>
        <div>
          {wideGamutColors.map(({ func, value }) => {
            const color = `${func}(${value.a} ${value.b} ${value.c}  / 0.95)`;

            return (
              <div key={func} className={styles.colorSpaceBlock} style={{ backgroundColor: color }}>
                <pre>{func}</pre>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.relativeColors}>
        <h2>color-mix() and relative colors</h2>
        <div className={styles.relativeColorsContainer}>
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  );
};
