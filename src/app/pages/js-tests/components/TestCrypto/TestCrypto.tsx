import styles from './styles.module.scss';
import { getErrorMessage } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { Section } from '@/app/components/Section/Section';

function encodeMessage(message: string) {
  let enc = new TextEncoder();
  return enc.encode(message);
}

type TEncryptDecryptResult = {
  text: string;
  type: 'success' | 'error';
};

const TestEncryptionDecryption = () => {
  const [result, setResult] = useState<TEncryptDecryptResult[]>([]);

  const updateResult = (text: string, type: 'success' | 'error') => {
    setResult((prevResult) => [...prevResult, { text, type }]);
  };

  useEffect(() => {
    const test = async () => {
      try {
        const subtleCrypto = window.crypto.subtle;

        // RSA-OAEP

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

        const encodedMessage = encodeMessage('Everything works!');
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

        updateResult('RSA-OAEP passed', 'success');
      } catch (error) {
        updateResult(`RSA-OAEP error: ${getErrorMessage(error)}`, 'error');
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
