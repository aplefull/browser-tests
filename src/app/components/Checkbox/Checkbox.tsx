import classNames from 'classnames';
import styles from './styles.module.scss';
import { Check } from 'tabler-icons-react';

type TCheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export const Checkbox = ({ label = '', checked, onChange, className }: TCheckboxProps) => {
  return (
    <label className={classNames(styles.checkboxWrapper, className)}>
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
