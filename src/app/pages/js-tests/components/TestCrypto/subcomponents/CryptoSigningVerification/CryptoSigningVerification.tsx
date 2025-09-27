import {
  encodeMessage,
  SubtleCryptoResults,
  TCryptoTestComponentProps,
  TSubtleCryptoResult,
} from '@/app/pages/js-tests/components/TestCrypto/TestCrypto';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/utils/utils';

const rsaSSA = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key = await subtleCrypto.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-512',
    },
    true,
    ['sign', 'verify'],
  );

  const encodedMessage = encodeMessage(message);

  const signature = await subtleCrypto.sign('RSASSA-PKCS1-v1_5', key.privateKey, encodedMessage);

  const isVerified = await subtleCrypto.verify('RSASSA-PKCS1-v1_5', key.publicKey, signature, encodedMessage);

  if (!isVerified) {
    throw new Error(`Signature is not verified`);
  }

  return isVerified;
};

const rsaPSS = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key = await subtleCrypto.generateKey(
    {
      name: 'RSA-PSS',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify'],
  );

  const encodedMessage = encodeMessage(message);

  const signature = await subtleCrypto.sign({ name: 'RSA-PSS', saltLength: 257 }, key.privateKey, encodedMessage);

  const isVerified = await subtleCrypto.verify(
    { name: 'RSA-PSS', saltLength: 257 },
    key.publicKey,
    signature,
    encodedMessage,
  );

  if (!isVerified) {
    throw new Error(`Signature is not verified`);
  }

  return isVerified;
};

const ecdsa = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key = await subtleCrypto.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign', 'verify'],
  );

  const encodedMessage = encodeMessage(message);

  const signature = await subtleCrypto.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-384',
    },
    key.privateKey,
    encodedMessage,
  );

  const isVerified = await subtleCrypto.verify(
    {
      name: 'ECDSA',
      hash: 'SHA-384',
    },
    key.publicKey,
    signature,
    encodedMessage,
  );

  if (!isVerified) {
    throw new Error(`Signature is not verified`);
  }

  return isVerified;
};

const hmac = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key = await subtleCrypto.generateKey(
    {
      name: 'HMAC',
      hash: 'SHA-512',
      length: 512,
    },
    true,
    ['sign', 'verify'],
  );

  const encodedMessage = encodeMessage(message);

  const signature = await subtleCrypto.sign(
    {
      name: 'HMAC',
    },
    key,

    encodedMessage,
  );

  const isVerified = await subtleCrypto.verify(
    {
      name: 'HMAC',
    },
    key,
    signature,
    encodedMessage,
  );

  if (!isVerified) {
    throw new Error(`Signature is not verified`);
  }

  return isVerified;
};

export const CryptoSigningVerification = ({ message }: TCryptoTestComponentProps) => {
  const [results, setResults] = useState<TSubtleCryptoResult[]>([]);

  const updateResult = (text: string, type: 'success' | 'error') => {
    setResults((prevResults) => {
      return [...prevResults, { text, type }];
    });
  };

  const tests = [
    {
      name: 'RSA-SSA',
      method: rsaSSA,
    },
    {
      name: 'RSA-PSS',
      method: rsaPSS,
    },
    {
      name: 'ECDSA',
      method: ecdsa,
    },
    {
      name: 'HMAC',
      method: hmac,
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
