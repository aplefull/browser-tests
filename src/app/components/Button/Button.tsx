import { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

type TButtonProps = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'light' | 'dark';
  textVariant?: 'normal' | 'large';
  url?: string;
  width?: string | number;
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

export const Button = ({ text, onClick, disabled, variant = 'light', url, width }: TButtonProps) => {
  const variantClass = variant === 'light' ? styles.light : styles.dark;
  const textVariantClass = variant === 'light' ? styles.normalText : styles.largeText;
  const disabledClass = disabled ? styles.disabled : '';

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
  };

  return (
    <ButtonWrapper url={url}>
      <button
        className={classNames(styles.button, variantClass, textVariantClass, disabledClass)}
        style={style}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </ButtonWrapper>
  );
};
