import styles from './styles.module.scss';
import classNames from 'classnames';
import { TDimensions } from '@/types';

export const FeTurbulenceSquigglyTestSvg = ({ width, height }: TDimensions) => {
  return (
    <div style={{ width, height }} className={classNames(styles.squigglyTextContainer, styles.squiggly)}>
      <div className={styles.editable} contentEditable suppressContentEditableWarning>
        Editable squiggly text using 💕SVG filters💕
        <p>Try to edit it!</p>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="squiggly-0">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="0" />
            <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="4" />
          </filter>

          <filter id="squiggly-1">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="1" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
          </filter>

          <filter id="squiggly-2">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          </filter>

          <filter id="squiggly-3">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="3" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
          </filter>

          <filter id="squiggly-4">
            <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="4" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
