import styles from './styles.module.scss';
import classNames from 'classnames';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface TableColumn {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, ReactNode>[];
  maxHeight?: number;
  className?: string;
  striped?: boolean;
  compact?: boolean;
}

export const Table = ({ columns, data, maxHeight = 300, className, striped = true, compact = false }: TableProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const calculateScrollbarWidth = () => {
      if (!bodyRef.current) return;

      const { offsetWidth, clientWidth } = bodyRef.current;
      const width = offsetWidth - clientWidth;
      setScrollbarWidth(width);
    };

    calculateScrollbarWidth();

    const resizeObserver = new ResizeObserver(calculateScrollbarWidth);
    if (bodyRef.current) {
      resizeObserver.observe(bodyRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [data]);

  if (!columns.length || !data.length) {
    return (
      <div className={classNames(styles.table, styles.empty, className)}>
        <div className={styles.emptyMessage}>No data to display</div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.tableContainer, className)}>
      <div className={styles.table}>
        <div className={styles.header} style={{ paddingRight: `${scrollbarWidth}px` }}>
          {columns.map((column, index) => (
            <div
              key={column.key}
              className={classNames(styles.headerCell, {
                [styles.first]: index === 0,
                [styles.last]: index === columns.length - 1,
              })}
              style={{
                width: column.width || 'auto',
                textAlign: column.align || 'left',
              }}
            >
              {column.header}
            </div>
          ))}
        </div>

        <div ref={bodyRef} className={styles.body} style={{ maxHeight: `${maxHeight}px` }}>
          {data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={classNames(styles.row, {
                [styles.striped]: striped && rowIndex % 2 === 1,
                [styles.compact]: compact,
              })}
            >
              {columns.map((column, colIndex) => (
                <div
                  key={`${rowIndex}-${column.key}`}
                  className={classNames(styles.cell, {
                    [styles.first]: colIndex === 0,
                    [styles.last]: colIndex === columns.length - 1,
                  })}
                  style={{
                    width: column.width || 'auto',
                    textAlign: column.align || 'left',
                  }}
                >
                  {row[column.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
