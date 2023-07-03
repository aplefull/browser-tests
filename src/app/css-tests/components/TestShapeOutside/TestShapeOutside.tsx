import styles from './styles.module.scss';
import { lorem } from '@/utils/utils';
import { Fragment } from 'react';

export default function TestShapeOutside() {
  const text = lorem(4);

  const testCases = ['circle', 'ellipse', 'inset', 'polygon', 'url', 'margin-box', 'animation'];

  return (
    <section className={styles.shapeOutside}>
      <h1>Shape-outside</h1>
      {testCases.map((testCase) => {
        return (
          <Fragment key={testCase}>
            <h2>{`Shape: ${testCase.replace('-', ' ')}`}</h2>
            <div key={testCase}>
              <img className={styles[testCase]} src="/assets/images/black-cat.png" alt="black cat" />
              <p>{text}</p>
            </div>
          </Fragment>
        );
      })}
    </section>
  );
}
