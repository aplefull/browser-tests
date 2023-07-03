import styles from './styles.module.scss';
import { useState } from 'react';

export default function TestColors() {
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
    <section>
      <h1>Colors</h1>
      <div className={styles.colors}>
        <div className={styles.color}>
          <h2>color() and different color-spaces</h2>
          <label>
            R
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={R}
              onChange={(e) => {
                setR(Number(e.target.value));
              }}
            />
          </label>
          <label>
            G
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={G}
              onChange={(e) => {
                setG(Number(e.target.value));
              }}
            />
          </label>
          <label>
            B
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={B}
              onChange={(e) => {
                setB(Number(e.target.value));
              }}
            />
          </label>
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
    </section>
  );
}
