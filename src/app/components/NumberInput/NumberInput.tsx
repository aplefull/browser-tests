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
  step?: number;
  noButtons?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
};

const stripFloatError = (value: number) => Number(value.toFixed(10));

export const NumberInput = ({
  placeholder,
  inputClassName,
  className,
  value,
  onChange,
  min,
  max,
  step,
  noButtons,
  disabled,
}: NumberInputProps) => {
  const increment = step ?? 1;

  const isBelowMin = (value: number) => min !== undefined && value < min;
  const isAboveMax = (value: number) => max !== undefined && value > max;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;

    if (isBelowMin(value) || isAboveMax(value)) {
      return;
    }

    onChange(value);
  };

  const clamp = (value: number) => {
    if (isBelowMin(value)) return min as number;
    if (isAboveMax(value)) return max as number;

    return value;
  };

  const plus = () => {
    if (Number.isNaN(value)) {
      onChange(clamp(increment));
      return;
    }

    onChange(clamp(stripFloatError(value + increment)));
  };

  const minus = () => {
    if (Number.isNaN(value)) {
      onChange(clamp(0));
      return;
    }

    onChange(clamp(stripFloatError(value - increment)));
  };

  return (
    <div className={classNames(styles.inputContainer, className, { [styles.disabled]: disabled })}>
      <input
        className={classNames(styles.input, inputClassName)}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        min={min}
        max={max}
        step={step ?? 'any'}
        disabled={disabled}
        type="number"
      />
      {!noButtons && (
        <div className={styles.buttonsContainer}>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            className={styles.button}
            onClick={plus}
            disabled={disabled || (max !== undefined && value >= max)}
          >
            <ChevronUp className={styles.icon} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Decrement"
            className={styles.button}
            onClick={minus}
            disabled={disabled || (min !== undefined && value <= min)}
          >
            <ChevronDown className={styles.icon} />
          </button>
        </div>
      )}
    </div>
  );
};
