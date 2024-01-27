import styles from './styles.module.scss';
import classNames from 'classnames';

type TCodeProps = {
  children: string | string[];
  className?: string;
  title?: string;
};

export const Code = ({ children, className, title }: TCodeProps) => {
  return (
    <pre title={title} className={classNames(styles.code, className)}>
      {children}
    </pre>
  );
};
