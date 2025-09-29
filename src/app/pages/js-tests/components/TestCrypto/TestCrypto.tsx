import styles from './styles.module.scss';
import { Fragment } from 'react';
import { CryptoEncryptionDecryption } from '@/app/pages/js-tests/components/TestCrypto/subcomponents/CryptoEncryptionDecryption/CryptoEncryptionDecryption';
import { CryptoSigningVerification } from '@/app/pages/js-tests/components/TestCrypto/subcomponents/CryptoSigningVerification/CryptoSigningVerification';
import { CryptoHashing } from '@/app/pages/js-tests/components/TestCrypto/subcomponents/CryptoHashing/CryptoHashing';
import { CryptoWrapUnwrap } from '@/app/pages/js-tests/components/TestCrypto/subcomponents/CryptoWrapUnwrap/CryptoWrapUnwrap';
import { CryptoKeyBitsDerivation } from '@/app/pages/js-tests/components/TestCrypto/subcomponents/CryptoKeyBitsDerivation/CryptoKeyBitsDerivation';

export const encodeMessage = (message: string) => {
  const enc = new TextEncoder();
  return enc.encode(message);
};

export const decodeMessage = (message: ArrayBuffer) => {
  return new TextDecoder().decode(message);
};

export const toHexString = (arrayBuffer: ArrayBuffer) => {
  const hashArray = Array.from(new Uint8Array(arrayBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toLocaleUpperCase();
};

export type TSubtleCryptoResult = {
  text: string;
  type: 'success' | 'error' | 'waiting';
  duration?: number;
};

export type TCryptoTestComponentProps = {
  message: string;
};

export const SubtleCryptoResults = ({ results }: { results: TSubtleCryptoResult[] }) => {
  return (
    <div className={styles.subtleCryptoResults}>
      {results.map(({ text, type, duration }, index) => {
        return (
          <Fragment key={index}>
            <span>{text}</span>
            {type === 'error' && <span className={styles.error}>error</span>}
            {type === 'success' && (
              <span className={styles.success}>pass {duration !== undefined && `(${duration.toFixed(2)}ms)`}</span>
            )}
            {type === 'waiting' && <span className={styles.waiting}>waiting</span>}
          </Fragment>
        );
      })}
    </div>
  );
};

export const TestCrypto = () => {
  const hasCrypto = typeof window !== 'undefined' && 'crypto' in window;
  const subtleCrypto = hasCrypto ? window.crypto.subtle : null;
  const message = 'Everything works!';

  return (
    <div className={styles.crypto}>
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
        <div>
          <div>
            <h3>Encryption and Decryption</h3>
            <CryptoEncryptionDecryption message={message} />
            <h3>Signing and Verification</h3>
            <CryptoSigningVerification message={message} />
            <h3>Hashing</h3>
            <CryptoHashing message={message} />
            <h3>Keys and Bits Derivation</h3>
            <CryptoKeyBitsDerivation message={message} />
            <h3>Wrap and Unwrap</h3>
            <CryptoWrapUnwrap message={message} />
          </div>
        </div>
      )}
    </div>
  );
};
