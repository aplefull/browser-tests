import styles from './styles.module.scss';
import { ChangeEvent } from 'react';
import classNames from 'classnames';
import { ChevronDown, ChevronUp } from 'tabler-icons-react';

type NumberInputProps = {
  placeholder?: string;
  onChange: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
  noButtons?: boolean;
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
  noButtons,
}: NumberInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;

    if (min && value < min) {
      return;
    }

    if (max && value > max) {
      return;
    }

    onChange(value);
  };

  const plus = () => {
    if (Number.isNaN(value)) {
      onChange(1);
      return;
    }

    onChange(value + 1);
  };

  const minus = () => {
    if (Number.isNaN(value)) {
      onChange(0);
      return;
    }

    onChange(value - 1);
  };

  return (
    <div className={classNames(styles.inputContainer, className)}>
      <input
        className={classNames(styles.input, inputClassName)}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        type="number"
      />
      {!noButtons && (
        <div className={styles.buttonsContainer}>
          <button className={styles.button} onClick={plus} disabled={!!(min && value <= min)}>
            <ChevronUp className={styles.icon} />
          </button>
          <button className={styles.button} onClick={minus} disabled={!!(max && value >= max)}>
            <ChevronDown className={styles.icon} />
          </button>
        </div>
      )}
    </div>
  );
};
