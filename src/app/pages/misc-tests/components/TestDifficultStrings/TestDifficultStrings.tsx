import styles from './styles.module.scss';
import textFile from '@assets/data/blns.txt?raw';
import { Fragment, useState } from 'react';
import { getDataFromBlns } from '@/utils/utils';
import { Section } from '@/app/components/Section/Section';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';

export const TestDifficultStrings = () => {
  const [showSvg, setShowSvg] = useState(false);

  const toggleSvg = () => {
    setShowSvg((showSvg) => !showSvg);
  };

  return (
    <Section className={styles.testDifficultStrings} title="Difficult strings">
      <Checkbox checked={showSvg} onChange={toggleSvg} label="Show SVG alternatives" />
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
