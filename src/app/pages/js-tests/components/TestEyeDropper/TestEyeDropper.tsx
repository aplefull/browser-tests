import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { getErrorMessage } from '@utils';
import { useState } from 'react';

export const TestEyeDropper = () => {
  const [result, setResult] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const eyeDropper = new EyeDropper();

  const open = async () => {
    try {
      setCancelled(false);
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
        console.warn(getErrorMessage(error));
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
      <div>Selected color: {getResults()}</div>
      <div className={styles.preview} style={{ backgroundColor: result || '' }} />
    </div>
  );
};
