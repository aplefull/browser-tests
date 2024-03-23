import { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

type TButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
  url?: string;
  width?: string | number;
  className?: string;
};

type TButtonWrapperProps = {
  url?: string;
  children: ReactNode;
};

const ButtonWrapper = ({ url, children }: TButtonWrapperProps) => {
  if (!url) {
    return <>{children}</>;
  }

  return (
    <a href={url} target="_blank" rel="noreferrer" className={styles.url}>
      {children}
    </a>
  );
};

export const Button = ({ text, onClick, disabled, variant = 'solid', url, width, className }: TButtonProps) => {
  const variantClass = styles[variant];

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
  };

  return (
    <ButtonWrapper url={url}>
      <button
        className={classNames(styles.button, className, variantClass, {
          [styles.disabled]: disabled,
        })}
        style={style}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </ButtonWrapper>
  );
};
