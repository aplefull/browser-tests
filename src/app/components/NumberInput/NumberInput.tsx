import styles from './styles.module.scss';
import { ChangeEvent } from 'react';
import classNames from 'classnames';

type NumberInputProps = {
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: number;
  min?: number;
  max?: number;
  className?: string;
  inputClassName?: string;
};

export const NumberInput = ({
  placeholder,
  inputClassName,
  className,
  value,
  onChange,
  min,
  max,
}: NumberInputProps) => {
  return (
    <div className={classNames(styles.inputContainer, className)}>
      <input
        className={classNames(styles.input, inputClassName)}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        type="number"
      />
    </div>
  );
};
