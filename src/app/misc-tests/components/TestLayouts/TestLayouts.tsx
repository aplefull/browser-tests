import styles from './layouts.module.scss';
import tableData from '@/assets/data/data.json';
import React, { Fragment } from 'react';
import classNames from 'classnames';
import CSSMasonry from '../../../css-tests/components/subcomponents/CSSMasonry/CSSMasonry';
import { TImageModule } from '@/types';

const images = import.meta.glob<TImageModule>('/src/assets/images/cats/*.*', { eager: true });

export default function TestLayouts() {
  const imagePaths = Object.values(images).map((image) => image.default);

  const headCaptions = [
    'Name',
    'Size',
    'Resolution',
    'Duration',
    'Fps',
    'Bitrate',
    'Extension',
    'Video codec',
    'Audio codec',
  ];

  const urls = [];
  for (let i = 1; i <= 100; i++) {
    const url = imagePaths[Math.floor(Math.random() * imagePaths.length)];
    urls.push(url);
  }

  return (
    <section className={styles.testLayouts}>
      <h1>Different Layouts</h1>
      <div className={styles.container}>
        <p>Pure css masonry</p>
        <CSSMasonry urls={urls} />
        <p>Large table</p>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                {headCaptions.map((caption, i) => {
                  return <th key={i}>{caption}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => {
                return (
                  <tr key={i}>
                    {Object.values(row).map((value, i) => {
                      const actualValue = value === null ? 'n/a' : value;

                      return <td key={i}>{actualValue}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p>Large grid</p>
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            {headCaptions.map((caption, i) => {
              return (
                <div key={i} className={styles.headerCell}>
                  {caption}
                </div>
              );
            })}
            {tableData.map((row, i) => {
              return (
                <Fragment key={i}>
                  {Object.values(row).map((value, j) => {
                    const actualValue = value === null ? 'n/a' : value;

                    return (
                      <div
                        key={j}
                        className={classNames(styles.bodyCell, {
                          [styles.odd]: i % 2 === 0,
                        })}
                      >
                        {actualValue}
                      </div>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
