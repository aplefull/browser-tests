import styles from './styles.module.scss';
import { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';

export type TInputProps = {
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  value: string;
  className?: string;
  inputClassName?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  pattern?: string;
  required?: boolean;
};

export const Input = forwardRef<HTMLInputElement, TInputProps>(
  (
    { placeholder, disabled, inputClassName, className, value, onChange, leftSlot, rightSlot, pattern, required },
    ref,
  ) => {
    return (
      <div
        className={classNames(styles.inputContainer, className, {
          [styles.disabled]: disabled,
        })}
      >
        {leftSlot && <>{leftSlot}</>}
        <input
          ref={ref}
          pattern={pattern}
          required={required}
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
