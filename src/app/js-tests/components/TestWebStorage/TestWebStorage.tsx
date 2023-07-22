import { useState } from 'react';
import catImage from '@assets/images/cat-vibing.gif';
import styles from './styles.module.scss';

type IDBOpenSuccessEvent = Event & {
  target: IDBOpenDBRequest;
};

// TODO move
declare global {
  interface IDBVersionChangeEvent extends Event {
    target: IDBOpenDBRequest;
  }
}

const generateRandomString = (length: number) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetUpper = alphabet.toUpperCase();
  const numbers = '0123456789';

  const pool = alphabet + alphabetUpper + numbers;

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result += pool[randomIndex];
  }

  return result;
};

// TODO to utils
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getErrorMessage = (error: unknown, defaultError?: string) => {
  if (typeof error === 'string') {
    return error;
  }

  if (typeof error.message === 'string' && error.message) {
    return error.message;
  }

  return defaultError || 'Unknown error';
};

const testStorage = async (storage: Storage, data: { data: string }) => {
  storage.setItem('test', JSON.stringify(data));

  await wait(500);

  const storageData = storage.getItem('test');

  if (storageData && JSON.parse(storageData).data === data.data) {
    return 'Success';
  }

  storage.removeItem('test');

  return 'Failed';
};

const createDB = async (dbName: string, dbVersion: number, storeName: string) => {
  return new Promise<IDBDatabase | string>((resolve, reject) => {
    const openDBRequest = indexedDB.open(dbName, dbVersion);

    openDBRequest.onerror = () => {
      reject('Error opening indexedDB');
    };

    openDBRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(storeName)) {
        try {
          db.createObjectStore(storeName, { autoIncrement: true });
        } catch (error) {
          reject('Error creating object store');
        }
      }
    };

    openDBRequest.onsuccess = (event: IDBOpenSuccessEvent) => {
      resolve(event.target.result);
    };
  });
};

const deleteDB = async (dbName: string) => {
  return new Promise<string>((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onerror = () => {
      reject('Error deleting database');
    };

    deleteRequest.onsuccess = () => {
      resolve('Database deleted successfully');
    };
  });
};

const addData = async (store: IDBObjectStore, data: unknown, key: string) => {
  return new Promise<string>((resolve, reject) => {
    const addRequest = store.add(data, key);

    addRequest.onerror = () => {
      reject('Error adding data to indexedDB');
    };

    addRequest.onsuccess = () => {
      resolve('Successfully added data to indexedDB');
    };
  });
};

const getData = async (store: IDBObjectStore, key: string) => {
  return new Promise<string>((resolve, reject) => {
    const getRequest = store.get(key);

    getRequest.onerror = () => {
      reject('Error reading data from indexedDB');
    };

    getRequest.onsuccess = () => {
      resolve('Successfully read data from indexedDB');
    };
  });
};

const deleteData = async (store: IDBObjectStore, key: string) => {
  return new Promise<string>((resolve, reject) => {
    const deleteRequest = store.delete(key);

    deleteRequest.onerror = () => {
      reject('Error deleting data from indexedDB');
    };

    deleteRequest.onsuccess = () => {
      resolve('Successfully deleted data from indexedDB');
    };
  });
};

const testTransaction = async (db: IDBDatabase, store: string, data: unknown) => {
  return new Promise<
    | {
        addResult: string;
        getResult: string;
        deleteResult: string;
      }
    | string
  >(async (resolve, reject) => {
    try {
      const transaction = db.transaction([store], 'readwrite');
      const objectStore = transaction.objectStore(store);

      const addResult = await addData(objectStore, data, 'test');
      const getResult = await getData(objectStore, 'test');
      const deleteResult = await deleteData(objectStore, 'test');

      resolve({
        addResult,
        getResult,
        deleteResult,
      });
    } catch (error) {
      reject(getErrorMessage(error, 'Error testing transaction'));
    }
  });
};

export const TestWebStorage = () => {
  const [localStorageResult, setLocalStorageResult] = useState('');
  const [sessionStorageResult, setSessionStorageResult] = useState('');
  const [indexedDBResult, setIndexedDBResult] = useState<string[]>([]);

  const testLocalStorage = async () => {
    const localStorageData = {
      data: generateRandomString(5000),
    };

    const result = await testStorage(localStorage, localStorageData);

    setLocalStorageResult(result);
  };

  const testSessionStorage = async () => {
    const sessionStorageData = {
      data: generateRandomString(1000),
    };

    const result = await testStorage(sessionStorage, sessionStorageData);

    setSessionStorageResult(result);
  };

  const testIndexedDB = async () => {
    if (!window.indexedDB) {
      setIndexedDBResult((prev) => [...prev, 'There is no indexedDB in window']);
      return;
    }

    const dbName = 'testDB';
    const dbVersion = 1;
    const storeName = 'testStore';

    const existingDBNames = await window.indexedDB.databases();

    if (existingDBNames.find((db) => db.name === dbName)) {
      setIndexedDBResult((prev) => [...prev, 'There is already a database with the same name??']);

      try {
        const result = await deleteDB(dbName);
        setIndexedDBResult((prev) => [...prev, result]);
      } catch (error) {
        setIndexedDBResult((prev) => [...prev, 'Error deleting existing database']);
        return;
      }
    }

    try {
      const db = await createDB(dbName, dbVersion, storeName);

      if (typeof db === 'string') {
        setIndexedDBResult((prev) => [...prev, db]);
        return;
      }

      const imageData = await fetch(catImage);
      const imageArrayBuffer = await imageData.arrayBuffer();
      const blob = new Blob([imageArrayBuffer], { type: 'image/gif' });

      const regularDataResults = await testTransaction(db, storeName, { id: 1, name: 'John Doe', age: 30 });
      const fileDataResults = await testTransaction(db, storeName, blob);

      if (typeof regularDataResults === 'string') {
        setIndexedDBResult((prev) => [...prev, regularDataResults]);
      } else {
        setIndexedDBResult((prev) => [...prev, ...Object.values(regularDataResults)]);
      }

      if (typeof fileDataResults === 'string') {
        setIndexedDBResult((prev) => [...prev, fileDataResults]);
      } else {
        setIndexedDBResult((prev) => [...prev, ...Object.values(fileDataResults)]);
      }

      const deleteResult = await deleteDB(dbName);

      setIndexedDBResult((prev) => [...prev, deleteResult]);
    } catch (error) {
      setIndexedDBResult((prev) => [...prev, getErrorMessage(error, 'Something broke...')]);
    }
  };

  const runTests = async () => {
    try {
      setLocalStorageResult('');
      setSessionStorageResult('');
      setIndexedDBResult([]);

      await testLocalStorage();
      await testSessionStorage();
      await testIndexedDB();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className={styles.webStorage}>
      <h1>Different Web Storage APIs</h1>
      <button onClick={runTests}>Run</button>
      <div>
        <h2>Local storage</h2>
        <div>{localStorageResult}</div>
      </div>
      <div>
        <h2>Session storage</h2>
        <div>{sessionStorageResult}</div>
      </div>
      <div>
        <h2>IndexedDB</h2>
        <div>
          {indexedDBResult.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
      </div>
    </section>
  );
};
