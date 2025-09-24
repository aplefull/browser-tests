import styles from './styles.module.scss';
import { ChangeEvent } from 'react';
import classNames from 'classnames';

type TTextAreaProps = {
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  onChange?: (value: string) => void;
  value: string;
  className?: string;
};

export const TextArea = ({ placeholder, disabled, readonly, value, onChange, className }: TTextAreaProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange && onChange(event.target.value);
  };

  return (
    <textarea
      readOnly={readonly}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={classNames(styles.textArea, className)}
    />
  );
};
