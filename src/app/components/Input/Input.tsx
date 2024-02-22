import styles from './styles.module.scss';
import { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

type InputProps = {
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  value: string;
  className?: string;
  inputClassName?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, disabled, inputClassName, className, value, onChange, leftSlot, rightSlot }, ref) => {
    return (
      <div className={classNames(styles.inputContainer, className)}>
        {leftSlot && <>{leftSlot}</>}
        <input
          ref={ref}
          disabled={disabled}
          className={classNames(styles.input, inputClassName)}
          placeholder={placeholder}
          onChange={(event) => {
            onChange && onChange(event.target.value);
          }}
          value={value}
          type="text"
        />
        {rightSlot && <>{rightSlot}</>}
      </div>
    );
  },
);
