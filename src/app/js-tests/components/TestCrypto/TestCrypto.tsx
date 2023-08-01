import styles from './styles.module.scss';

export const TestCrypto = () => {
  const hasCrypto = typeof window !== 'undefined' && 'crypto' in window;
  const subtleCrypto = hasCrypto ? window.crypto.subtle : null;

  return (
    <section className={styles.crypto}>
      <h1>Crypto API</h1>
      {!hasCrypto && <p>Your browser does not support the Crypto API.</p>}
      {hasCrypto && (
        <div>
          <span>Random uuid: {crypto.randomUUID()}</span>
          <span>Random number: {crypto.getRandomValues(new Uint32Array(1))[0]}</span>
        </div>
      )}
      {!subtleCrypto && <p>Your browser does not support the SubtleCrypto API.</p>}
      {subtleCrypto && <div></div>}
    </section>
  );
};
