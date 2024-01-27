import styles from './layouts.module.scss';
import tableData from '@data/videos-table-data.json';
import React, { Fragment, useMemo, useState } from 'react';
import classNames from 'classnames';
import { CSSMasonry } from '@/app/pages/misc-tests/components/subcomponents/CSSMasonry/CSSMasonry';
import { TImageModule } from '@/types';
import { JSMasonry } from '@/app/pages/misc-tests/components/subcomponents/JSMasonry/JSMasonry';
import { Select } from '@/app/components/Select/Select';

const images = import.meta.glob<TImageModule>('/src/assets/images/masonry_images/*.*', { eager: true });

const LargeTable = ({ headCaptions }: { headCaptions: string[] }) => {
  return (
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
  );
};

const LargeGrid = ({ headCaptions }: { headCaptions: string[] }) => {
  return (
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
  );
};

const LAYOUTS = {
  CSS_MASONRY: 'CSS masonry',
  JS_MASONRY: 'JS masonry',
  LARGE_TABLE: 'Large table',
  LARGE_GRID: 'Large grid',
};

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

const Layout = ({ name }: { name: string }) => {
  const getLayout = (name: string) => {
    switch (name) {
      case LAYOUTS.CSS_MASONRY:
        return <CSSMasonry urls={Object.values(images).map((image) => image.default)} />;
      case LAYOUTS.JS_MASONRY:
        return (
          <JSMasonry className={styles.jsMasonryContainer} urls={Object.values(images).map((image) => image.default)} />
        );
      case LAYOUTS.LARGE_TABLE:
        return <LargeTable headCaptions={headCaptions} />;
      case LAYOUTS.LARGE_GRID:
        return <LargeGrid headCaptions={headCaptions} />;
    }

    return null;
  };

  const getDesc = (layout: string) => {
    switch (layout) {
      case LAYOUTS.CSS_MASONRY:
        return 'Simple css masonry';
      case LAYOUTS.JS_MASONRY:
        return 'JS masonry';
      case LAYOUTS.LARGE_TABLE:
        return 'A lot of data displayed using <table>';
      case LAYOUTS.LARGE_GRID:
        return 'Same data displayed using divs and grid layout';
    }
  };

  return (
    <>
      <h2>{getDesc(name)}</h2>
      {getLayout(name)}
    </>
  );
};

export const TestLayouts = () => {
  const [layout, setLayout] = useState(LAYOUTS.CSS_MASONRY);

  const imagePaths = useMemo(() => {
    return Object.values(images).map((image) => image.default);
  }, [images]);

  const urls = [];
  for (let i = 1; i <= 100; i++) {
    const url = imagePaths[Math.floor(Math.random() * imagePaths.length)];
    urls.push(url);
  }

  return (
    <div className={styles.testLayouts}>
      <Select options={Object.values(LAYOUTS)} value={layout} onChange={setLayout} />
      <Layout name={layout} />
    </div>
  );
};
