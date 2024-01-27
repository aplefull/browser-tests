import styles from './styles.module.scss';
import classNames from 'classnames';
import React, { Fragment, useEffect, useRef, useState } from 'react';

type TTableData = Record<string, (string | number)[]>;
type TAcceptedData = TTableData | Record<string, string | number>[] | (string | number)[][];

/*  Examples:
 *   TTableData:
 *     {
 *       'Header 1': ['Row 1', 'Row 2', 'Row 3'],
 *       'Header 2': ['Row 1', 'Row 2', 'Row 3'],
 *     }
 *
 *   Record<string, string | number>[]:
 *     [
 *       {
 *         'Header 1': 'Row 1',
 *         'Header 2': 'Row 1',
 *       },
 *       {
 *         'Header 1': 'Row 2',
 *         'Header 2': 'Row 2',
 *       },
 *     ]
 *
 *  (string | number)[][]:
 *    [
 *      ['Header 1', 'Header 2'],
 *      ['Row 1', 'Row 1'],
 *      ['Row 2', 'Row 2'],
 *    ]
 * */

type TTableProps = {
  data?: TAcceptedData;
  head?: string[];
  body?: string[][];
  maxHeight?: number;
  className?: string;
};

const isTable2DArray = (data: TAcceptedData): data is (string | number)[][] => {
  return Array.isArray(data) && data.every((row) => Array.isArray(row));
};

const prepareData = (data: TAcceptedData): TTableData => {
  if (!Array.isArray(data)) {
    // TTableData
    return data;
  }

  if (isTable2DArray(data)) {
    // (string | number)[][]
    const headers = data[0];
    const preparedData: TTableData = {};

    headers.forEach((header, i) => {
      preparedData[header] = data.map((row) => row[i]);
    });

    return preparedData;
  }

  // Record<string, string | number>[]
  const headers = Object.keys(data[0]);
  const preparedData: TTableData = {};

  headers.forEach((header) => {
    preparedData[header] = data.map((row) => row[header]);
  });

  return preparedData;
};

const getRowsAndHeaders = (data: TTableData) => {
  const headers = Object.keys(data);
  const rows = data[headers[0]].map((_, i) => headers.map((header) => data[header][i]));

  return { headers, rows };
};

const mergeHeadersAndBody = (headers: string[], body: TAcceptedData) => {
  const { rows } = getRowsAndHeaders(prepareData(body));

  const rowLength = rows[0].length;
  const headerLength = headers.length;

  if (headerLength > rowLength) {
    const diff = headerLength - rowLength;
    const emptyRow = new Array(diff).fill(null);
    rows.forEach((row) => row.push(...emptyRow));
  }

  if (headerLength < rowLength) {
    const diff = rowLength - headerLength;

    for (let i = 0; i < diff; i++) {
      headers.push(`Empty header ${i + 1}`);
    }
  }

  const res: TTableData = {};

  headers.reverse().forEach((header, i) => {
    res[header] = rows.map((row) => row[i]);
  });

  return res;
};

export const Table = ({ data, head, body, maxHeight, className }: TTableProps) => {
  const [hasScroll, setHasScroll] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bodyRef.current) return;

    const { scrollHeight, clientHeight } = bodyRef.current;
    setHasScroll(scrollHeight > clientHeight);
  }, [data, head, body, maxHeight, className]);

  const notEnoughData = (!data && !head && !body) || (head && !body) || (!head && body);

  if (notEnoughData) return null;

  const preparedData = data ? prepareData(data) : prepareData(mergeHeadersAndBody(head!, body!));
  const { headers, rows } = getRowsAndHeaders(preparedData);

  const maxColWidth = 200;
  const gridColumns = `repeat(${headers.length}, fit-content(${maxColWidth}px))`;

  const gridStyles = {
    gridTemplateColumns: gridColumns,
  };

  const gridHeadStyles = {
    gridColumn: `1 / ${headers.length + 1}`,
  };

  const gridBodyStyles = {
    gridColumn: `1 / ${headers.length + 1}`,
    maxHeight,
  };

  return (
    <div className={classNames(styles.table, className)} style={gridStyles}>
      <div className={styles.head} style={gridHeadStyles}>
        {headers.map((caption, i) => {
          return (
            <div key={i} className={classNames(styles.header, styles.cell)}>
              {caption}
            </div>
          );
        })}
      </div>
      <div
        ref={bodyRef}
        className={classNames(styles.body, {
          [styles.scroll]: hasScroll,
        })}
        style={gridBodyStyles}
      >
        {rows.map((row, i) => {
          return (
            <Fragment key={i}>
              {row.map((value, j) => {
                return (
                  <span
                    key={j}
                    className={classNames(styles.bodyCell, styles.cell, {
                      [styles.firstRow]: i === 0,
                      [styles.lastRow]: i === rows.length - 1,
                      [styles.lastInRow]: j === row.length - 1,
                    })}
                  >
                    {value}
                  </span>
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
