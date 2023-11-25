import styles from './styles.module.scss';
import classNames from 'classnames';
import React, { Fragment } from 'react';

type TTableData = Record<string, (string | number)[]>;
type TAcceptedData = TTableData | Record<string, string | number>[] | (string | number)[][];

type TTableProps = {
  data?: TAcceptedData;
  head?: string[];
  body?: string[][];
  maxHeight?: number;
  className?: string;
};

const prepareData = (data: TAcceptedData): TTableData => {
  if (Array.isArray(data)) {
    // Record<string, string | number>[]
    if (data[0] instanceof Object && !(data[0] instanceof Array)) {
      const headers = Object.keys(data[0]);
      const preparedData: TTableData = {};

      headers.forEach((header) => {
        preparedData[header] = data.map((row) => row[header]);
      });

      return preparedData;
    } else {
      // string[][]
      const headers: string[][] = data[0];
      const preparedData: TTableData = {};

      headers.forEach((header, i) => {
        preparedData[header] = data.map((row) => row[i]);
      });

      return preparedData;
    }
  }

  return data;
};

const getRowsAndHeaders = (data: TTableData) => {
  const headers = Object.keys(data);
  const rows = data[headers[0]].map((_, i) => headers.map((header) => data[header][i]));

  return { headers, rows };
};

const mergeHeadersAndBody = (headers: string[], body: TAcceptedData): TAcceptedData => {
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

  const res = {};

  headers.reverse().forEach((header, i) => {
    res[header] = rows.map((row) => row[i]);
  });

  return res;
};

export const Table = ({ data, head, body, maxHeight, className }: TTableProps) => {
  if (!data && !(head && body)) return null;

  const preparedData = data ? prepareData(data) : prepareData(mergeHeadersAndBody(head!, body!));
  const { headers, rows } = getRowsAndHeaders(preparedData);

  const maxColWidth = 200;
  const gridColumns = `repeat(${headers.length}, fit-content(${maxColWidth}px))`;

  const gridStyles = {
    gridTemplateColumns: gridColumns,
  };

  return (
    <div className={classNames(styles.scrollContainer, className)} style={{ maxHeight }}>
      <div className={styles.table} style={gridStyles}>
        {headers.map((caption, i) => {
          return (
            <div key={i} className={classNames(styles.header, styles.cell)}>
              {caption}
            </div>
          );
        })}
        {rows.map((row, i) => {
          return (
            <Fragment key={i}>
              {row.map((value, j) => {
                return (
                  <span
                    key={j}
                    className={classNames(styles.body, styles.cell, {
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
