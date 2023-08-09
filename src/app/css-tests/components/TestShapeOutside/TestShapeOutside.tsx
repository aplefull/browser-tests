import styles from './styles.module.scss';
import { lorem } from '@/utils/utils';
import { Fragment } from 'react';
import blackCat from '@assets/images/cats/black-cat.png';
import { Section } from '@/app/components/Section/Section';

export const TestShapeOutside = () => {
  const text = lorem(4);

  const testCases = ['circle', 'ellipse', 'inset', 'polygon', 'url', 'margin-box', 'animation'];

  return (
    <Section className={styles.shapeOutside} title="Shape-outside" closedByDefault>
      {testCases.map((testCase) => {
        return (
          <Fragment key={testCase}>
            <h2>{`Shape: ${testCase.replace('-', ' ')}`}</h2>
            <div key={testCase}>
              <img className={styles[testCase]} src={blackCat} alt="black cat" />
              <p>{text}</p>
            </div>
          </Fragment>
        );
      })}
    </Section>
  );
};
