import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { getErrorMessage } from '@utils';
import { useState } from 'react';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';

export const TestEyeDropper = () => {
  const [result, setResult] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eyeDropper = new EyeDropper();

  const open = async () => {
    try {
      setCancelled(false);
      setResult(null);
      const result = await eyeDropper.open();
      setResult(result.sRGBHex);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'AbortError' &&
        'code' in error &&
        error.code === 20
      ) {
        setCancelled(true);
      } else {
        setError(getErrorMessage(error));
      }
    }
  };

  const getResults = () => {
    if (cancelled) return 'color selection cancelled';
    if (!result) return 'none';

    return result;
  };

  return (
    <div className={styles.container}>
      <Button text="Open Eye Dropper" onClick={open} />
      <div className={styles.results}>
        <span>Selected color:</span>
        {result && <div className={styles.preview} style={{ backgroundColor: result }} />}
        <span>{getResults()}</span>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};
