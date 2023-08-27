import styles from './styles.module.scss';
import classNames from 'classnames';

type TLoaderProps = {
  className?: string;
  size?: number;
  fillPage?: boolean;
  rotationDuration?: number;
  counterClockwise?: boolean;
};

export const Loader = ({
  className,
  size = 70,
  fillPage = false,
  rotationDuration = 1,
  counterClockwise = false,
}: TLoaderProps) => {
  const strokeWidth = size / 10;
  const center = size / 2;

  return (
    <div
      className={classNames(styles.loader, className, {
        [styles.fillPage]: fillPage,
      })}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path
          d={`M ${center} ${strokeWidth / 2} a ${center - strokeWidth / 2} ${center - strokeWidth / 2} 0 0 1 0 ${
            size - strokeWidth
          }`}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${center} ${center}`}
            to={`${counterClockwise ? '-' : ''}360 ${center} ${center}`}
            dur={`${rotationDuration}s`}
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};
