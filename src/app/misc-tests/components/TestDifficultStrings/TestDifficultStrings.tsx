import styles from './styles.module.scss';
import textFile from '@/assets/data/blns.txt?raw';
import { Fragment, useState } from 'react';

export default function TestDifficultStrings() {
  const [showSvg, setShowSvg] = useState(false);

  const data = textFile.split('\n');

  // TODO: refactor
  const groups: {
    description: string[];
    chars: string[];
  }[] = [];
  let description: string[] = [];
  let chars: string[] = [];
  for (let i = 0; i < data.length; i++) {
    while (i < data.length && data[i].startsWith('#')) {
      if (data[i].length === 0) {
        i++;
        continue;
      }

      description.push(data[i]);
      i++;
    }

    while (i < data.length && !data[i].startsWith('#')) {
      if (data[i].length === 0) {
        i++;
        continue;
      }

      chars.push(data[i]);
      i++;
    }

    groups.push({
      description,
      chars,
    });

    description = [];
    chars = [];
    i--;
  }

  const preparedGroups = groups.map((group) => {
    return {
      description: group.description
        .map((d) => d.replace('#', ''))
        .join(' ')
        .trim(),
      strings: group.chars,
    };
  });

  const toggleSvg = () => {
    setShowSvg((showSvg) => !showSvg);
  };

  return (
    <section className={styles.testDifficultStrings}>
      <h1>Difficult strings</h1>
      <input type="checkbox" onChange={toggleSvg} checked={showSvg} />
      <div className={styles.stringsContainer}>
        {preparedGroups.map(({ description, strings }) => {
          return (
            <div key={description} title={description}>
              {strings.map((string: string) => {
                return (
                  <Fragment key={string}>
                    <span>{string}</span>
                    {showSvg && (
                      <svg height={22}>
                        <text y="60%" dominantBaseline="middle">
                          {string}
                        </text>
                      </svg>
                    )}
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
