import { useRouteError } from 'react-router-dom';
import { getErrorMessage } from '@/utils/utils';
import styles from './styles.module.scss';

export const Error = () => {
  const error = useRouteError();

  const getStack = (error: unknown) => {
    if (typeof error === 'object' && !Array.isArray(error) && error !== null && 'stack' in error) {
      if (typeof error.stack === 'string') {
        return error.stack;
      }
    }

    return null;
  };

  return (
    <div className={styles.error}>
      <h1>Ooops, something went so bad that entire page crashed...</h1>
      <h2>
        A thing happened: <span>{getErrorMessage(error)}</span>
      </h2>
      <pre>{getStack(error)}</pre>
    </div>
  );
};
