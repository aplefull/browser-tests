import styles from './styles.module.scss';
import { ChangeEvent } from 'react';
import classNames from 'classnames';

type InputProps = {
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  className?: string;
  inputClassName?: string;
};

export const Input = ({ placeholder, inputClassName, className, value, onChange }: InputProps) => {
  return (
    <div className={classNames(styles.inputContainer, className)}>
      <input
        className={classNames(styles.input, inputClassName)}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        type="text"
      />
    </div>
  );
};
