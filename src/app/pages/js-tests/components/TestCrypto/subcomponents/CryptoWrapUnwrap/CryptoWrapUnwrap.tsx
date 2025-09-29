import {
  decodeMessage,
  encodeMessage,
  SubtleCryptoResults,
  TCryptoTestComponentProps,
  TSubtleCryptoResult,
} from '@/app/pages/js-tests/components/TestCrypto/TestCrypto';
import { useEffect, useState } from 'react';
import { runCryptoTests } from '@/app/pages/js-tests/components/TestCrypto/utils.crypto';

const aesKW = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const aesKwKeyForWrapping = await subtleCrypto.generateKey(
    {
      name: 'AES-KW',
      length: 256,
    },
    true,
    ['wrapKey', 'unwrapKey'],
  );

  const keyToWrap = await subtleCrypto.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const wrappedRawKey = await subtleCrypto.wrapKey('raw', keyToWrap, aesKwKeyForWrapping, {
    name: 'AES-KW',
    length: 256,
  });

  const unwrappedRawKey = await subtleCrypto.unwrapKey(
    'raw',
    wrappedRawKey,
    aesKwKeyForWrapping,
    {
      name: 'AES-KW',
      length: 256,
    },
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
      iv: new Uint8Array(12),
    },
    unwrappedRawKey,
    encodedMessage,
  );

  const decryptedData = await subtleCrypto.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(12),
    },
    unwrappedRawKey,
    encryptedData,
  );

  const decryptedMessageString = decodeMessage(decryptedData);

  if (decryptedMessageString !== message) {
    throw new Error(`Got different message after encryption and decryption: ${decryptedMessageString}`);
  }
};

export const CryptoWrapUnwrap = ({ message }: TCryptoTestComponentProps) => {
  const [results, setResults] = useState<TSubtleCryptoResult[]>([]);

  const tests = [
    {
      name: 'AES-KW',
      method: aesKW,
    },
  ];

  const test = async () => {
    await runCryptoTests(tests, message, setResults);
  };

  useEffect(() => {
    setResults([]);
    test();
  }, []);

  return <SubtleCryptoResults results={results} />;
};
