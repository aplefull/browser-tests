import { useEffect, useState } from 'react';
import {
  decodeMessage,
  encodeMessage,
  SubtleCryptoResults,
  TCryptoTestComponentProps,
  TSubtleCryptoResult,
} from '@/app/pages/js-tests/components/TestCrypto/TestCrypto';
import { getErrorMessage } from '@/utils/utils';

const rsaOAEP = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const keyPair = await subtleCrypto.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-512',
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const encodedMessage = encodeMessage(message);
  const encryptedData = await subtleCrypto.encrypt(
    {
      name: 'RSA-OAEP',
    },
    keyPair.publicKey,
    encodedMessage,
  );

  const decryptedData = await subtleCrypto.decrypt(
    {
      name: 'RSA-OAEP',
    },
    keyPair.privateKey,
    encryptedData,
  );

  const decryptedMessage = decodeMessage(decryptedData);

  if (message !== decryptedMessage) {
    throw new Error(`Decrypted message is not equal to original message. Expected ${message}, got ${decryptedMessage}`);
  }

  return decryptedMessage;
};

const aesCTR = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key = await subtleCrypto.generateKey(
    {
      name: 'AES-CTR',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const encodedMessage = encodeMessage(message);
  const encryptedData = await subtleCrypto.encrypt(
    {
      name: 'AES-CTR',
      counter: new Uint8Array(16),
      length: 64,
    },
    key,
    encodedMessage,
  );

  const decryptedData = await subtleCrypto.decrypt(
    {
      name: 'AES-CTR',
      counter: new Uint8Array(16),
      length: 64,
    },
    key,
    encryptedData,
  );

  const decryptedMessage = decodeMessage(decryptedData);

  if (message !== decryptedMessage) {
    throw new Error(`Decrypted message is not equal to original message. Expected ${message}, got ${decryptedMessage}`);
  }

  return decryptedMessage;
};

const aesCBC = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key = await subtleCrypto.generateKey(
    {
      name: 'AES-CBC',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const encodedMessage = encodeMessage(message);
  const encryptedData = await subtleCrypto.encrypt(
    {
      name: 'AES-CBC',
      iv: new Uint8Array(16),
    },
    key,
    encodedMessage,
  );

  const decryptedData = await subtleCrypto.decrypt(
    {
      name: 'AES-CBC',
      iv: new Uint8Array(16),
    },
    key,
    encryptedData,
  );

  const decryptedMessage = decodeMessage(decryptedData);

  if (message !== decryptedMessage) {
    throw new Error(`Decrypted message is not equal to original message. Expected ${message}, got ${decryptedMessage}`);
  }

  return decryptedMessage;
};

const aesGCM = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key = await subtleCrypto.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const encodedMessage = encodeMessage(message);
  const encryptedData = await subtleCrypto.encrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(16),
    },
    key,
    encodedMessage,
  );

  const decryptedData = await subtleCrypto.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(16),
    },
    key,
    encryptedData,
  );

  const decryptedMessage = decodeMessage(decryptedData);

  if (message !== decryptedMessage) {
    throw new Error(`Decrypted message is not equal to original message. Expected ${message}, got ${decryptedMessage}`);
  }

  return decryptedMessage;
};

export const CryptoEncryptionDecryption = ({ message }: TCryptoTestComponentProps) => {
  const [results, setResults] = useState<TSubtleCryptoResult[]>([]);

  const updateResult = (text: string, type: 'success' | 'error') => {
    setResults((prevResults) => {
      return [...prevResults, { text, type }];
    });
  };

  const tests = [
    {
      name: 'RSA-OAEP',
      method: rsaOAEP,
    },
    {
      name: 'AES-CTR',
      method: aesCTR,
    },
    {
      name: 'AES-CBC',
      method: aesCBC,
    },
    {
      name: 'AES-GCM',
      method: aesGCM,
    },
  ];

  const test = async () => {
    for (const test of tests) {
      updateResult(`${test.name} - waiting...`, 'waiting' as any);
      try {
        await test.method(message);
        setResults((prevResults) => {
          const newResults = [...prevResults];
          const waitingIndex = newResults.findIndex((result) => result.text === `${test.name} - waiting...`);
          if (waitingIndex !== -1) {
            newResults[waitingIndex] = { text: test.name, type: 'success' };
          }
          return newResults;
        });
      } catch (error) {
        setResults((prevResults) => {
          const newResults = [...prevResults];
          const waitingIndex = newResults.findIndex((result) => result.text === `${test.name} - waiting...`);
          if (waitingIndex !== -1) {
            newResults[waitingIndex] = { text: getErrorMessage(error), type: 'error' };
          }
          return newResults;
        });
      }
    }
  };

  useEffect(() => {
    setResults([]);
    test();
  }, []);

  return <SubtleCryptoResults results={results} />;
};
