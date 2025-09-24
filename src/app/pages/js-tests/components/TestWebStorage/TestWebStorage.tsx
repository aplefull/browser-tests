import { useState } from 'react';
import catImage from '@assets/images/gifs/cat-vibing.gif';
import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { generateRandomString, getErrorMessage, wait } from '@/utils/utils';
import classNames from 'classnames';

type TIndexedDBResult = {
  text: string;
  type: 'success' | 'error';
};

const RESULT = {
  SUCCESS: 'Success',
  ERROR: 'Fail',
};

const testStorage = async (storage: Storage, data: { data: string }) => {
  storage.setItem('test', JSON.stringify(data));

  await wait(500);

  const storageData = storage.getItem('test');

  if (storageData && JSON.parse(storageData).data === data.data) {
    storage.removeItem('test');
    return RESULT.SUCCESS;
  }

  storage.removeItem('test');

  return RESULT.ERROR;
};

const createDB = async (dbName: string, dbVersion: number, storeName: string) => {
  return new Promise<IDBDatabase | TIndexedDBResult>((resolve) => {
    const openDBRequest = indexedDB.open(dbName, dbVersion);

    openDBRequest.onerror = () => {
      resolve({
        text: 'Error opening indexedDB',
        type: 'error',
      });
    };

    openDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(storeName)) {
        try {
          db.createObjectStore(storeName, { autoIncrement: true });
        } catch {
          resolve({
            text: 'Error creating object store',
            type: 'error',
          });
        }
      }
    };

    openDBRequest.onsuccess = (event: Event) => {
      if (!(event.target instanceof IDBOpenDBRequest)) {
        resolve({
          text: 'Error opening indexedDB',
          type: 'error',
        });
        return;
      }

      resolve(event.target.result);
    };
  });
};

const deleteDB = async (dbName: string) => {
  return new Promise<TIndexedDBResult>((resolve) => {
    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onerror = () => {
      resolve({
        text: 'Error deleting database',
        type: 'error',
      });
    };

    deleteRequest.onsuccess = () => {
      resolve({
        text: 'Database deleted successfully',
        type: 'success',
      });
    };

    deleteRequest.onblocked = () => {
      resolve({
        text: 'Database blocked from deletion',
        type: 'error',
      });
    };
  });
};

const addData = async (store: IDBObjectStore, data: unknown, key: string) => {
  return new Promise<TIndexedDBResult>((resolve) => {
    const addRequest = store.add(data, key);

    addRequest.onerror = () => {
      resolve({
        text: 'Error adding data to indexedDB',
        type: 'error',
      });
    };

    addRequest.onsuccess = () => {
      resolve({
        text: 'Successfully added data to indexedDB',
        type: 'success',
      });
    };
  });
};

const getData = async (store: IDBObjectStore, key: string) => {
  return new Promise<TIndexedDBResult>((resolve) => {
    const getRequest = store.get(key);

    getRequest.onerror = () => {
      resolve({
        text: 'Error reading data from indexedDB',
        type: 'error',
      });
    };

    getRequest.onsuccess = () => {
      resolve({
        text: 'Successfully read data from indexedDB',
        type: 'success',
      });
    };
  });
};

const deleteData = async (store: IDBObjectStore, key: string) => {
  return new Promise<TIndexedDBResult>((resolve) => {
    const deleteRequest = store.delete(key);

    deleteRequest.onerror = () => {
      resolve({
        text: 'Error deleting data from indexedDB',
        type: 'error',
      });
    };

    deleteRequest.onsuccess = () => {
      resolve({
        text: 'Successfully deleted data from indexedDB',
        type: 'success',
      });
    };
  });
};

const testTransaction = async (db: IDBDatabase, store: string, data: unknown) => {
  try {
    const transaction = db.transaction([store], 'readwrite');
    const objectStore = transaction.objectStore(store);

    const addResult = await addData(objectStore, data, 'test');
    const getResult = await getData(objectStore, 'test');
    const deleteResult = await deleteData(objectStore, 'test');

    return { addResult, getResult, deleteResult };
  } catch (error) {
    const text = getErrorMessage(error, 'Error testing transaction');
    return { text, type: 'error' };
  }
};

export const TestWebStorage = () => {
  const [localStorageResult, setLocalStorageResult] = useState('');
  const [sessionStorageResult, setSessionStorageResult] = useState('');
  const [indexedDBResult, setIndexedDBResult] = useState<TIndexedDBResult[]>([]);

  const testLocalStorage = async () => {
    setLocalStorageResult('');

    const localStorageData = {
      data: generateRandomString(5000),
    };

    const result = await testStorage(localStorage, localStorageData);

    setLocalStorageResult(result);
  };

  const testSessionStorage = async () => {
    setSessionStorageResult('');

    const sessionStorageData = {
      data: generateRandomString(1000),
    };

    const result = await testStorage(sessionStorage, sessionStorageData);

    setSessionStorageResult(result);
  };

  const testIndexedDB = async () => {
    setIndexedDBResult([]);

    const updateResult = (result: string | TIndexedDBResult | TIndexedDBResult[]) => {
      if (typeof result === 'string') {
        setIndexedDBResult((prev) => [
          ...prev,
          {
            text: result,
            type: 'success',
          },
        ]);
      } else {
        if (Array.isArray(result)) {
          setIndexedDBResult((prev) => [...prev, ...result]);
          return;
        }

        setIndexedDBResult((prev) => [...prev, result]);
      }
    };

    if (!window.indexedDB) {
      updateResult({
        text: 'There is no indexedDB in window',
        type: 'error',
      });
      return;
    }

    const dbName = 'testDB';
    const dbVersion = 1;
    const storeName = 'testStore';

    const existingDBNames = await window.indexedDB.databases();

    if (existingDBNames.find((db) => db.name === dbName)) {
      updateResult({
        text: 'There is already a database with the same name??',
        type: 'error',
      });

      try {
        const result = await deleteDB(dbName);
        setIndexedDBResult((prev) => [...prev, result]);
      } catch {
        updateResult({
          text: 'Error deleting existing database',
          type: 'error',
        });
        return;
      }
    }

    try {
      const db = await createDB(dbName, dbVersion, storeName);

      if (!(db instanceof IDBDatabase)) {
        setIndexedDBResult((prev) => [...prev, db]);
        return;
      }

      db.onversionchange = () => {
        db.close();
      };

      const imageData = await fetch(catImage);
      const imageArrayBuffer = await imageData.arrayBuffer();
      const blob = new Blob([imageArrayBuffer], { type: 'image/gif' });

      const regularDataResults = await testTransaction(db, storeName, { id: 1, name: 'John Doe', age: 30 });
      const fileDataResults = await testTransaction(db, storeName, blob);

      updateResult(Object.values(regularDataResults));
      updateResult(Object.values(fileDataResults));

      const deleteResult = await deleteDB(dbName);
      updateResult(deleteResult);
    } catch (error) {
      updateResult({
        text: getErrorMessage(error, 'Something broke...'),
        type: 'error',
      });
    }
  };

  return (
    <div className={styles.webStorage}>
      <div>
        <h2>Local storage</h2>
        <Button text="Run" width={70} onClick={testLocalStorage} />
        <div
          className={classNames({
            [styles.success]: localStorageResult === RESULT.SUCCESS,
            [styles.error]: localStorageResult === RESULT.ERROR,
          })}
        >
          {localStorageResult}
        </div>
      </div>
      <div>
        <h2>Session storage</h2>
        <Button text="Run" width={70} onClick={testSessionStorage} />
        <div
          className={classNames({
            [styles.success]: sessionStorageResult === RESULT.SUCCESS,
            [styles.error]: sessionStorageResult === RESULT.ERROR,
          })}
        >
          {sessionStorageResult}
        </div>
      </div>
      <div>
        <h2>IndexedDB</h2>
        <Button text="Run" width={70} onClick={testIndexedDB} />
        <div>
          {indexedDBResult.map((result, index) => (
            <div
              key={index}
              className={classNames({
                [styles.error]: result.type === 'error',
                [styles.success]: result.type === 'success',
              })}
            >
              {result.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
