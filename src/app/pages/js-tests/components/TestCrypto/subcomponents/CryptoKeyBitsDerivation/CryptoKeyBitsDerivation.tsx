import {
  decodeMessage,
  encodeMessage,
  SubtleCryptoResults,
  TCryptoTestComponentProps,
  toHexString,
  TSubtleCryptoResult,
} from '@/app/pages/js-tests/components/TestCrypto/TestCrypto';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/utils/utils';

const ecdh = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const key1 = await subtleCrypto.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-384',
    },
    false,
    ['deriveKey', 'deriveBits'],
  );

  const key2 = await subtleCrypto.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-384',
    },
    false,
    ['deriveKey', 'deriveBits'],
  );

  const secretKey1 = await subtleCrypto.deriveKey(
    {
      name: 'ECDH',
      public: key2.publicKey,
    },
    key1.privateKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );

  const secretKey2 = await subtleCrypto.deriveKey(
    {
      name: 'ECDH',
      public: key1.publicKey,
    },
    key2.privateKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );

  const encodedMessage = encodeMessage(message);

  const encryptedMessage = await subtleCrypto.encrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(12),
    },
    secretKey1,
    encodedMessage,
  );

  const decryptedMessage = await subtleCrypto.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(12),
    },
    secretKey2,
    encryptedMessage,
  );

  const decryptedMessageString = decodeMessage(decryptedMessage);

  if (decryptedMessageString !== message) {
    throw new Error(`Got different message after encryption and decryption. ${decryptedMessageString} and ${message}`);
  }

  const sharedSecret = await subtleCrypto.deriveBits(
    {
      name: 'ECDH',
      public: key2.publicKey,
    },
    key1.privateKey,
    256,
  );

  const sharedSecretString = toHexString(sharedSecret);

  if (sharedSecretString.length !== 64) {
    throw new Error(`Got invalid string length from deriving bits. ${sharedSecretString}`);
  }
};

const hkdf = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await subtleCrypto.importKey('raw', encodeMessage(message), { name: 'HKDF' }, false, [
    'deriveBits',
    'deriveKey',
  ]);

  const derivedKey = await subtleCrypto.deriveKey(
    {
      name: 'HKDF',
      salt,
      info: new Uint8Array(16),
      hash: 'SHA-512',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const encodedMessage = encodeMessage(message);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedMessage = await subtleCrypto.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    derivedKey,
    encodedMessage,
  );

  const decryptedMessage = await subtleCrypto.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    derivedKey,
    encryptedMessage,
  );

  const decryptedMessageString = decodeMessage(decryptedMessage);

  if (decryptedMessageString !== message) {
    throw new Error(`Got different message after encryption and decryption: ${decryptedMessageString}`);
  }

  const keyBits = await subtleCrypto.deriveBits(
    {
      name: 'HKDF',
      salt,
      info: new Uint8Array(16),
      hash: 'SHA-256',
    },
    keyMaterial,
    256,
  );

  const keyString = toHexString(keyBits);

  if (keyString.length !== 64) {
    throw new Error(`Got invalid string length from deriving bits: ${keyString}`);
  }
};

const pbkdf2 = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const salt = new Uint8Array(16);

  const keyMaterial = await subtleCrypto.importKey(
    'raw',
    encodeMessage(message),
    {
      name: 'PBKDF2',
    },
    false,
    ['deriveBits', 'deriveKey'],
  );

  const key = await subtleCrypto.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1000000,
      hash: 'SHA-512',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const encodedMessage = encodeMessage(message);

  const encryptedMessage = await subtleCrypto.encrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(12),
    },
    key,
    encodedMessage,
  );

  const decryptedMessage = await subtleCrypto.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(12),
    },
    key,
    encryptedMessage,
  );

  const decryptedMessageString = decodeMessage(decryptedMessage);

  if (decryptedMessageString !== message) {
    throw new Error(`Got different message after encryption and decryption. ${decryptedMessageString} and ${message}`);
  }

  const keyBits = await subtleCrypto.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-1',
    },
    keyMaterial,
    256,
  );

  const keyString = toHexString(keyBits);

  if (keyString.length !== 64) {
    throw new Error(`Got invalid string length from deriving bits. ${keyString}`);
  }
};

export const CryptoKeyBitsDerivation = ({ message }: TCryptoTestComponentProps) => {
  const [results, setResults] = useState<TSubtleCryptoResult[]>([]);

  const updateResult = (text: string, type: 'success' | 'error') => {
    setResults((prevResults) => {
      return [...prevResults, { text, type }];
    });
  };

  const tests = [
    {
      name: 'ECDH',
      method: ecdh,
    },
    {
      name: 'HKDF',
      method: hkdf,
    },
    {
      name: 'PBKDF2',
      method: pbkdf2,
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
