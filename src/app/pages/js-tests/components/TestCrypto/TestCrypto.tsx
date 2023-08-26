import styles from './styles.module.scss';
import { getErrorMessage } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { Section } from '@/app/components/Section/Section';

const encodeMessage = (message: string) => {
  let enc = new TextEncoder();
  return enc.encode(message);
};

const decodeMessage = (message: ArrayBuffer) => {
  return new TextDecoder().decode(message);
};

const toHexString = (arrayBuffer: ArrayBuffer) => {
  const hashArray = Array.from(new Uint8Array(arrayBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toLocaleUpperCase();
};

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

type TEncryptDecryptResult = {
  text: string;
  type: 'success' | 'error';
};

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

  const decryptedMessage = new TextDecoder().decode(decryptedData);

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

  const decryptedMessage = new TextDecoder().decode(decryptedData);

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

  const decryptedMessage = new TextDecoder().decode(decryptedData);

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

  const decryptedMessage = new TextDecoder().decode(decryptedData);

  if (message !== decryptedMessage) {
    throw new Error(`Decrypted message is not equal to original message. Expected ${message}, got ${decryptedMessage}`);
  }

  return decryptedMessage;
};

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

  const keyString = toHexString(new Uint8Array(keyBits));

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

const aesKW = async (message: string) => {
  const subtleCrypto = window.crypto.subtle;

  const keyForWrapping = await subtleCrypto.generateKey(
    {
      name: 'AES-KW',
      length: 256,
    },
    true,
    ['wrapKey', 'unwrapKey'],
  );

  const formats = ['raw', 'jwk', 'spki', 'pkcs8'] as const;

  // make sure it can be exported as raw, jwk, spki, pkcs8
  const keyToWrap = await subtleCrypto.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const { publicKey: keyToWrapPublic } = await subtleCrypto.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const wrappedRawKey = await subtleCrypto.wrapKey('raw', keyToWrap, keyForWrapping, {
    name: 'AES-KW',
    length: 256,
  });

  const jwkToWrap = await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-384',
    },
    true,
    ['sign', 'verify'],
  );

  const wrappedJwkKey = await subtleCrypto.wrapKey('jwk', jwkToWrap.privateKey, keyForWrapping, {
    name: 'AES-KW',
    length: 256,
  });

  /*  const wrappedSpkiKey = await subtleCrypto.wrapKey('spki', keyToWrapPublic, keyForWrapping, {
    name: 'AES-KW',
    length: 256,
  });

  const wrappedPkcs8Key = await subtleCrypto.wrapKey('pkcs8', keyToWrapPublic, keyForWrapping, {
    name: 'AES-KW',
    length: 256,
  });*/

  /*const unwrappedKeys = await Promise.all(
    formats.map(async (format, index) => {
      return await subtleCrypto.unwrapKey(
        format,
        wrappedKeys[index],
        keyForWrapping,
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
    }),
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedMessage = encodeMessage(message);

  for (const unwrappedKey of unwrappedKeys) {
    const encryptedMessage = await subtleCrypto.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      unwrappedKey,
      encodedMessage,
    );

    const decryptedMessage = await subtleCrypto.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      unwrappedKey,
      encryptedMessage,
    );

    const decryptedMessageString = decodeMessage(decryptedMessage);

    if (decryptedMessageString !== message) {
      throw new Error(`Got different message after encryption and decryption: ${decryptedMessageString}`);
    }
  }*/
};

const TestEncryptionDecryption = () => {
  const [result, setResult] = useState<TEncryptDecryptResult[]>([]);

  const updateResult = (text: string, type: 'success' | 'error') => {
    setResult((prevResult) => [...prevResult, { text, type }]);
  };

  useEffect(() => {
    const test = async () => {
      try {
        const message = 'Everything works!';

        // Encryption and Decryption

        await rsaOAEP(message);
        updateResult('RSA-OAEP passed', 'success');

        await aesCTR(message);
        updateResult('AES-CTR passed', 'success');

        await aesCBC(message);
        updateResult('AES-CBC passed', 'success');

        await aesGCM(message);
        updateResult('AES-GCM passed', 'success');

        // Signing and Verification

        await rsaSSA(message);
        updateResult('RSA-SSA passed', 'success');

        await rsaPSS(message);
        updateResult('RSA-PSS passed', 'success');

        await ecdsa(message);
        updateResult('ECDSA passed', 'success');

        await hmac(message);
        updateResult('HMAC passed', 'success');

        // Hashing

        await sha1(message);
        updateResult('SHA-1 passed', 'success');

        await sha256(message);
        updateResult('SHA-256 passed', 'success');

        await sha384(message);
        updateResult('SHA-384 passed', 'success');

        await sha512(message);
        updateResult('SHA-512 passed', 'success');

        // Key and Bits Derivation

        await ecdh(message);
        updateResult('ECDH passed', 'success');

        await hkdf(message);
        updateResult('HKDF passed', 'success');

        await pbkdf2(message);
        updateResult('PBKDF2 passed', 'success');

        // Wrap and Unwrap

        await aesKW(message);
        updateResult('AES-KW passed', 'success');
      } catch (error) {
        updateResult(`Error: ${getErrorMessage(error)}`, 'error');
      }
    };

    test();
  }, []);

  return (
    <div>
      <h3>Encryption and Decryption</h3>
      {result.map((item, index) => {
        return (
          <div key={index}>
            <span>{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export const TestCrypto = () => {
  const hasCrypto = typeof window !== 'undefined' && 'crypto' in window;
  const subtleCrypto = hasCrypto ? window.crypto.subtle : null;

  return (
    <Section className={styles.crypto} title="Crypto API">
      <h2>Crypto</h2>
      {!hasCrypto && <p>Your browser does not support the Crypto API.</p>}
      {hasCrypto && (
        <div className={styles.cryptoResults}>
          <span>Random uuid: {crypto.randomUUID()}</span>
          <span>Random number: {crypto.getRandomValues(new Uint32Array(1))[0]}</span>
        </div>
      )}
      <h2>SubtleCrypto</h2>
      {!subtleCrypto && <p>Your browser does not support the SubtleCrypto API.</p>}
      {subtleCrypto && (
        <div className={styles.cryptoResults}>
          <TestEncryptionDecryption />
        </div>
      )}
    </Section>
  );
};
