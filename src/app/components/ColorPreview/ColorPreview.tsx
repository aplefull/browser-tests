import styles from './styles.module.scss';

interface ColorGroup {
  name: string;
  colors: string[];
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    name: 'Gray Scale',
    colors: [
      'gray-1',
      'gray-2',
      'gray-3',
      'gray-4',
      'gray-5',
      'gray-6',
      'gray-7',
      'gray-8',
      'gray-9',
      'gray-10',
      'gray-11',
      'gray-12',
    ],
  },
  {
    name: 'Gray Alpha',
    colors: [
      'gray-a1',
      'gray-a2',
      'gray-a3',
      'gray-a4',
      'gray-a5',
      'gray-a6',
      'gray-a7',
      'gray-a8',
      'gray-a9',
      'gray-a10',
      'gray-a11',
      'gray-a12',
    ],
  },
  {
    name: 'Accent',
    colors: [
      'accent-1',
      'accent-2',
      'accent-3',
      'accent-4',
      'accent-5',
      'accent-6',
      'accent-7',
      'accent-8',
      'accent-9',
      'accent-10',
      'accent-11',
      'accent-12',
    ],
  },
  {
    name: 'Accent Alpha',
    colors: [
      'accent-a1',
      'accent-a2',
      'accent-a3',
      'accent-a4',
      'accent-a5',
      'accent-a6',
      'accent-a7',
      'accent-a8',
      'accent-a9',
      'accent-a10',
      'accent-a11',
      'accent-a12',
    ],
  },
  {
    name: 'Red',
    colors: [
      'red-1',
      'red-2',
      'red-3',
      'red-4',
      'red-5',
      'red-6',
      'red-7',
      'red-8',
      'red-9',
      'red-10',
      'red-11',
      'red-12',
    ],
  },
  {
    name: 'Black Alpha',
    colors: [
      'black-a1',
      'black-a2',
      'black-a3',
      'black-a4',
      'black-a5',
      'black-a6',
      'black-a7',
      'black-a8',
      'black-a9',
      'black-a10',
      'black-a11',
      'black-a12',
    ],
  },
  {
    name: 'Semantic Colors',
    colors: [
      'color-background',
      'color-overlay',
      'color-panel-solid',
      'color-surface',
      'color-green',
      'color-green-dark-10',
      'color-red',
      'color-warning',
      'color-blue',
      'color-text-secondary',
      'color-text-muted',
      'color-transparent',
      'color-white',
      'color-gray',
      'color-black',
      'color-charcoal',
      'color-ink',
    ],
  },
  {
    name: 'White Transparent',
    colors: [
      'color-white-transparent-10',
      'color-white-transparent-20',
      'color-white-transparent-30',
      'color-white-transparent-40',
      'color-white-transparent-50',
    ],
  },
  {
    name: 'Ink Variants',
    colors: [
      'color-ink-light-3',
      'color-ink-light-10',
      'color-ink-light-20',
      'color-ink-light-30',
      'color-ink-light-40',
      'color-ink-light-50',
    ],
  },
  {
    name: 'Special HSL',
    colors: [
      'color-special-hsl-1',
      'color-special-hsl-2',
      'color-special-hsl-3',
      'color-special-hsl-4',
      'color-special-hsl-5',
      'color-special-hsl-6',
      'color-special-hsl-7',
      'color-special-hsl-8',
      'color-special-hsl-9',
      'color-special-hsl-10',
      'color-special-hsl-11',
    ],
  },
  {
    name: 'Special OKLCH',
    colors: [
      'color-special-oklch-1',
      'color-special-oklch-2',
      'color-special-oklch-3',
      'color-special-oklch-4',
      'color-special-oklch-5',
      'color-special-oklch-6',
      'color-special-oklch-7',
      'color-special-oklch-8',
      'color-special-oklch-9',
      'color-special-oklch-10',
      'color-special-oklch-11',
      'color-special-oklch-12',
    ],
  },
  {
    name: 'Pure Colors',
    colors: ['color-special-pure-red', 'color-special-pure-green', 'color-special-pure-blue'],
  },
  {
    name: 'Text Gradient',
    colors: [
      'color-special-text-gradient-1',
      'color-special-text-gradient-2',
      'color-special-text-gradient-3',
      'color-special-text-gradient-4',
      'color-special-text-gradient-5',
      'color-special-text-gradient-6',
      'color-special-text-gradient-7',
      'color-special-text-gradient-8',
      'color-special-text-gradient-9',
      'color-special-text-gradient-10',
    ],
  },
  {
    name: 'Text System',
    colors: ['text-primary', 'text-secondary', 'text-disabled'],
  },
  {
    name: 'Background System',
    colors: ['bg-canvas', 'bg-subtle', 'bg-ui', 'bg-hover', 'bg-active'],
  },
  {
    name: 'Border System',
    colors: ['border-subtle', 'border-ui', 'border-hover', 'border-strong'],
  },
  {
    name: 'Error System',
    colors: ['error-bg', 'error-border', 'error-text', 'error-solid'],
  },
  {
    name: 'Accent System',
    colors: ['accent-bg', 'accent-border', 'accent-text', 'accent-solid'],
  },
];

export const ColorPreview = () => {
  return (
    <div className={styles.colorPreview}>
      <h2>Color System Variables</h2>
      {COLOR_GROUPS.map((group) => (
        <div key={group.name} className={styles.colorGroup}>
          <h3>{group.name}</h3>
          <div className={styles.colorGrid}>
            {group.colors.map((color) => (
              <div key={color} className={styles.colorTile}>
                <div className={styles.colorSample} style={{ backgroundColor: `var(--${color})` }} />
                <div className={styles.colorInfo}>
                  <span className={styles.colorName}>--{color}</span>
                  <span className={styles.colorValue} data-color={color}></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
