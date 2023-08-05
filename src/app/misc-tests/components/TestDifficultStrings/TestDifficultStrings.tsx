import styles from './styles.module.scss';
import textFile from '@/assets/data/blns.txt?raw';
import { Fragment, useState } from 'react';
import { getDataFromBlns } from '@/utils/utils';
import { Section } from '@/app/components/Section/Section';

export const TestDifficultStrings = () => {
  const [showSvg, setShowSvg] = useState(false);

  const toggleSvg = () => {
    setShowSvg((showSvg) => !showSvg);
  };

  return (
    <Section className={styles.testDifficultStrings} title="Difficult strings" closedByDefault>
      <label>
        <input type="checkbox" onChange={toggleSvg} checked={showSvg} />
        Show SVG
      </label>
      <div className={styles.stringsContainer}>
        {getDataFromBlns(textFile).map(({ description, strings }) => {
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
    </Section>
  );
};
