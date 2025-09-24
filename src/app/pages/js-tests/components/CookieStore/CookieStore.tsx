import styles from './styles.module.scss';
import { Fragment, useEffect, useState } from 'react';

export const CookieStore = () => {
  const [testResults, setTestResults] = useState<Record<string, [string, 'pass' | 'fail']>>({});

  const addResult = (name: string, result: string, status: 'pass' | 'fail') => {
    setTestResults((prev) => ({ ...prev, [name]: [result, status] }));
  };

  useEffect(() => {
    const main = async () => {
      const store = window.cookieStore;

      if (!store) {
        addResult('cookieStore', 'Does not exist in window', 'fail');
        return;
      } else {
        addResult('cookieStore', 'Exists in window', 'pass');
      }

      await store.set({
        name: 'cookie-store-test',
        value: 'test',
        domain: window.location.hostname,
        path: '/',
        expires: Date.now() + 1000 * 60 * 60 * 24,
        sameSite: 'lax',
      });

      const cookie = await store.get('cookie-store-test');

      if (cookie) {
        addResult('cookieStoreGet', 'Cookie set & retrieved', 'pass');
      } else {
        addResult('cookieStoreGet', 'Failed to set & retrieve cookie', 'fail');
        return;
      }

      if (cookie?.value === 'test' && cookie?.path === '/' && cookie?.sameSite === 'lax') {
        addResult('cookieStoreValue', 'Cookie value is correct', 'pass');
      } else {
        addResult('cookieStoreValue', 'Cookie value is incorrect', 'fail');
      }

      const allCookies = await store.getAll();

      if (allCookies.some((cookie) => cookie.name === 'cookie-store-test')) {
        addResult('cookieStoreGetAll', 'Cookie retrieved in getAll', 'pass');
      } else {
        addResult('cookieStoreGetAll', 'Failed to retrieve cookie in getAll', 'fail');
      }

      let deleteEventFired = false;
      store.addEventListener('change', (event) => {
        if ('deleted' in event && event.deleted.length > 0) {
          addResult('cookieStoreChangeEvent', 'Cookie deleted event works', 'pass');
          deleteEventFired = true;
        }
      });

      await store.delete('cookie-store-test');

      if (!deleteEventFired) {
        addResult('cookieStoreChangeEvent', 'Cookie deleted event did not fire', 'fail');
      }

      const allCookiesAfterDelete = await store.getAll();

      if (!allCookiesAfterDelete.some((cookie) => cookie.name === 'cookie-store-test')) {
        addResult('cookieStoreDelete', 'Cookie deleted', 'pass');
      } else {
        addResult('cookieStoreDelete', 'Failed to delete cookie', 'fail');
      }
    };

    main().catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      {Object.entries(testResults).map(([key, value]) => (
        <Fragment key={key}>
          <span>{key}</span>
          <span className={value[1] === 'fail' ? styles.fail : styles.pass}>{value[0]}</span>
        </Fragment>
      ))}
    </div>
  );
};
