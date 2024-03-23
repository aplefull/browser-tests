import styles from './styles.module.scss';
import { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

type TContainerProps = {
  gap?: number;
  children?: ReactNode;
  className?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  mb?: number | string;
  mt?: number | string;
  ml?: number | string;
  mr?: number | string;
  my?: number | string;
  mx?: number | string;
};

const toCssSize = (value?: number | string) => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
};

export const Container = forwardRef<HTMLDivElement, TContainerProps>(
  (
    { children, className, gap = 5, wrap = 'nowrap', justify, align, direction = 'column', mb, mt, ml, mr, my, mx },
    ref,
  ) => {
    const margin = {
      marginBottom: my !== undefined ? toCssSize(my) : toCssSize(mb),
      marginTop: my !== undefined ? toCssSize(my) : toCssSize(mt),
      marginLeft: mx !== undefined ? toCssSize(mx) : toCssSize(ml),
      marginRight: mx !== undefined ? toCssSize(mx) : toCssSize(mr),
    };

    const containerStyles = {
      gap: gap,
      flexWrap: wrap,
      justifyContent: justify,
      alignItems: align,
      flexDirection: direction,
      ...margin,
    };

    return (
      <div ref={ref} style={containerStyles} className={classNames(styles.containerComponent, className)}>
        {children}
      </div>
    );
  },
);
