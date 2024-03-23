import styles from './styles.module.scss';
import classNames from 'classnames';

type TErrorMessageProps = {
  message?: string | null;
  className?: string;
};

export const ErrorMessage = ({ message, className }: TErrorMessageProps) => {
  if (!message) return null;

  return <span className={classNames(styles.error, className)}>{message}</span>;
};
