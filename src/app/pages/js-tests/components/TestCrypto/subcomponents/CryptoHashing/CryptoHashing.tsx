import { useEffect, useState } from 'react';
import {
  encodeMessage,
  SubtleCryptoResults,
  TCryptoTestComponentProps,
  toHexString,
  TSubtleCryptoResult,
} from '@/app/pages/js-tests/components/TestCrypto/TestCrypto';
import { getErrorMessage } from '@/utils/utils';

const isValidSHAString = (str: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512') => {
  switch (algorithm) {
    case 'SHA-1':
      return /^[0-9A-Fa-f]{40}$/i.test(str);
    case 'SHA-256':
      return /^[0-9A-Fa-f]{64}$/i.test(str);
    case 'SHA-384':
      return /^[0-9A-Fa-f]{96}$/i.test(str);
    case 'SHA-512':
      return /^[0-9A-Fa-f]{128}$/i.test(str);
    default:
      return false;
  }
};

const hash = async (message: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512') => {
  const subtleCrypto = window.crypto.subtle;

  const encodedMessage = encodeMessage(message);

  return await subtleCrypto.digest(algorithm, encodedMessage);
};

const testHash = async (message: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512') => {
  const hashBuffer = await hash(message, algorithm);
  const confirmationHashBuffer = await hash(message, algorithm);

  const hashString = toHexString(hashBuffer);
  const confirmationHashString = toHexString(confirmationHashBuffer);

  if (hashString !== confirmationHashString) {
    throw new Error(`Got different hash with the same input?. ${hashString} and ${confirmationHashString}`);
  }

  if (!isValidSHAString(hashString, algorithm)) {
    throw new Error(`Got invalid hash. ${hashString}`);
  }

  return hashString;
};

const sha1 = async (message: string) => {
  return await testHash(message, 'SHA-1');
};

const sha256 = async (message: string) => {
  return await testHash(message, 'SHA-256');
};

const sha384 = async (message: string) => {
  return await testHash(message, 'SHA-384');
};

const sha512 = async (message: string) => {
  return await testHash(message, 'SHA-512');
};

export const CryptoHashing = ({ message }: TCryptoTestComponentProps) => {
  const [results, setResults] = useState<TSubtleCryptoResult[]>([]);

  const updateResult = (text: string, type: 'success' | 'error') => {
    setResults((prevResults) => {
      return [...prevResults, { text, type }];
    });
  };

  const tests = [
    {
      name: 'SHA-1',
      method: sha1,
    },
    {
      name: 'SHA-256',
      method: sha256,
    },
    {
      name: 'SHA-384',
      method: sha384,
    },
    {
      name: 'SHA-512',
      method: sha512,
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
