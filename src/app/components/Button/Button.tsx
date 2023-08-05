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
  className?: string;
  noHoverStyle?: boolean;
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

export const Button = ({
  text,
  onClick,
  disabled,
  variant = 'light',
  url,
  width,
  className,
  noHoverStyle,
}: TButtonProps) => {
  const variantClass = variant === 'light' ? styles.light : styles.dark;
  const textVariantClass = variant === 'light' ? styles.normalText : styles.largeText;
  const disabledClass = disabled ? styles.disabled : '';

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
  };

  const customAttributes = {
    ...(noHoverStyle && { 'data-no-hover': true }),
  };

  return (
    <ButtonWrapper url={url}>
      <button
        {...customAttributes}
        className={classNames(styles.button, className, variantClass, textVariantClass, disabledClass)}
        style={style}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </ButtonWrapper>
  );
};
