import styles from './styles.module.scss';
import { Fragment, useEffect, useState } from 'react';

// TODO
export const CookieStore = () => {
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const addResult = (name: string, result: string) => {
    setTestResults((prev) => ({ ...prev, [name]: result }));
  };

  useEffect(() => {
    const main = async () => {
      const store = window.cookieStore;

      if (!store) return;

      addResult('cookieStore', 'Exists in window');

      await store.set({
        name: 'cookie-store-test',
        value: 'test',
        domain: window.location.hostname,
        path: '/',
        expires: Date.now() + 1000 * 60 * 60 * 24,
        sameSite: 'lax',
      });

      addResult('cookieStoreSet', 'Cookie set');

      const cookie = await store.get('cookie-store-test');

      if (cookie) {
        addResult('cookieStoreGet', 'Cookie retrieved');
      }

      if (
        cookie?.value === 'test' &&
        cookie?.domain === window.location.hostname &&
        cookie?.path === '/' &&
        cookie?.sameSite === 'lax'
      ) {
        addResult('cookieStoreValue', 'Cookie value is correct');
      }

      const allCookies = await store.getAll();

      if (allCookies.some((cookie) => cookie.name === 'cookie-store-test')) {
        addResult('cookieStoreGetAll', 'Cookie retrieved in getAll');
      }

      store.addEventListener('change', (event) => {
        if ('deleted' in event && event.deleted.length > 0) {
          addResult('cookieStoreChangeEvent', 'Cookie deleted event works');
        }
      });

      await store.delete('cookie-store-test');

      const allCookiesAfterDelete = await store.getAll();

      if (!allCookiesAfterDelete.some((cookie) => cookie.name === 'cookie-store-test')) {
        addResult('cookieStoreDelete', 'Cookie deleted');
      } else {
        addResult('cookieStoreDelete', 'Failed to delete cookie');
      }
    };

    main().catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      {Object.entries(testResults).map(([key, value]) => (
        <Fragment key={key}>
          <span>{key}</span>
          <span>{value}</span>
        </Fragment>
      ))}
    </div>
  );
};
