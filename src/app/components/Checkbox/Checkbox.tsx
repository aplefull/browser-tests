import classNames from 'classnames';
import styles from './styles.module.scss';
import { Check } from 'tabler-icons-react';
import { TLabelPosition } from '@/types';

type TCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: Omit<TLabelPosition, 'top' | 'bottom'>;
  className?: string;
};

export const Checkbox = ({ label = '', labelPosition, checked, onChange, className }: TCheckboxProps) => {
  return (
    <label
      className={classNames(styles.checkboxWrapper, className, {
        [styles.labelRight]: labelPosition === 'right' || !labelPosition,
        [styles.labelLeft]: labelPosition === 'left',
      })}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div
        className={classNames(styles.checkbox, {
          [styles.checked]: checked,
        })}
      >
        <Check className={styles.checkMark} size={20} />
      </div>
      {label}
    </label>
  );
};
