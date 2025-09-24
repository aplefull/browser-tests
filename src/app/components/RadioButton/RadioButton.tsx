import styles from './styles.module.scss';
import classNames from 'classnames';

type TRadioButtonProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export const RadioButton = ({ checked, disabled, onChange, className }: TRadioButtonProps) => {
  return (
    <label className={classNames(styles.container, className)}>
      <input disabled={disabled} type="radio" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
      <div
        className={classNames(styles.radio, {
          [styles.disabled]: disabled,
          [styles.checked]: checked,
        })}
      >
        <div className={styles.radioInner}></div>
      </div>
    </label>
  );
};
