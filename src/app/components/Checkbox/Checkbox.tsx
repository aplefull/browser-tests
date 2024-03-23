import classNames from 'classnames';
import styles from './styles.module.scss';
import { Check } from 'tabler-icons-react';
import { TLabelPosition } from '@/types';
import { ReactNode } from 'react';

type TCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string | ReactNode;
  labelPosition?: Omit<TLabelPosition, 'top' | 'bottom'>;
  className?: string;
  disabled?: boolean;
};

export const Checkbox = ({ label = '', labelPosition, checked, disabled, onChange, className }: TCheckboxProps) => {
  return (
    <label
      className={classNames(styles.checkboxWrapper, className, {
        [styles.labelRight]: labelPosition === 'right' || !labelPosition,
        [styles.labelLeft]: labelPosition === 'left',
        [styles.disabled]: disabled,
      })}
    >
      <input disabled={disabled} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div
        className={classNames(styles.checkbox, {
          [styles.checked]: checked,
          [styles.disabled]: disabled,
        })}
      >
        <Check className={styles.checkMark} size={20} />
      </div>
      {label}
    </label>
  );
};
