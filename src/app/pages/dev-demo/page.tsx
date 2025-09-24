import { Header } from '@/app/components/Header/Header';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';
import styles from './styles.module.scss';

export const DevDemoPage = () => {
  const mockError = {
    message: 'Test error message',
    stack: `Error: Test error message
    at Object.throwError (/path/to/file.js:123:45)
    at handleClick (/path/to/component.tsx:67:89)
    at onClick (/path/to/button.tsx:12:34)
    at HTMLButtonElement.click (native)`,
  };

  return (
    <div className={styles.demoPage}>
      <div className={styles.section}>
        <h2>Header Component</h2>
        <div className={styles.demo}>
          <Header />
        </div>
      </div>

      <div className={styles.section}>
        <h2>ErrorMessage Component</h2>
        <div className={styles.demo}>
          <ErrorMessage message="This is a sample error message" />
        </div>
        <div className={styles.demo}>
          <ErrorMessage message="Another error with a longer message that shows how it handles text wrapping" />
        </div>
        <div className={styles.demo}>
          <ErrorMessage />
        </div>
      </div>

      <div className={styles.section}>
        <h2>Error Component</h2>
        <div className={styles.demo}>
          <div className={styles.errorContainer}>
            <div className={styles.errorDemo}>
              <h1>Ooops, something went so bad that entire page crashed...</h1>
              <h2>
                A thing happened: <span>Test error message</span>
              </h2>
              <pre>{mockError.stack}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
