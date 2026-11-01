import styles from './styles.module.scss';

interface ColorGroup {
  name: string;
  colors: string[];
}

const scale = (prefix: string) => Array.from({ length: 12 }, (_, index) => `${prefix}${index + 1}`);

const COLOR_GROUPS: ColorGroup[] = [
  { name: 'Gray', colors: scale('gray-') },
  { name: 'Gray Alpha', colors: scale('gray-a') },
  { name: 'Accent', colors: scale('accent-') },
  { name: 'Accent Alpha', colors: scale('accent-a') },
  { name: 'Red', colors: scale('red-') },
  { name: 'Green', colors: scale('green-') },
  { name: 'Amber', colors: scale('amber-') },
  { name: 'Blue', colors: scale('blue-') },
  { name: 'Black Alpha', colors: scale('black-a') },
  { name: 'Text', colors: ['text-primary', 'text-secondary', 'text-muted', 'text-disabled'] },
  {
    name: 'Background',
    colors: ['bg-canvas', 'bg-surface', 'bg-subtle', 'bg-ui', 'bg-hover', 'bg-active', 'bg-overlay'],
  },
  { name: 'Border', colors: ['border-subtle', 'border-ui', 'border-hover', 'border-strong', 'focus-ring'] },
  {
    name: 'Accent System',
    colors: ['accent-bg', 'accent-border', 'accent-text', 'accent-solid', 'accent-solid-hover'],
  },
  { name: 'Success', colors: ['success-bg', 'success-border', 'success-text', 'success-solid'] },
  { name: 'Danger', colors: ['danger-bg', 'danger-border', 'danger-text', 'danger-solid'] },
  { name: 'Warning', colors: ['warning-bg', 'warning-border', 'warning-text', 'warning-solid'] },
  { name: 'Info', colors: ['info-bg', 'info-border', 'info-text', 'info-solid'] },
  {
    name: 'Legacy',
    colors: [
      'color-white',
      'color-green',
      'color-red',
      'color-warning',
      'color-blue',
      'color-surface',
      'color-white-transparent-10',
      'color-white-transparent-30',
      'color-white-transparent-50',
    ],
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
