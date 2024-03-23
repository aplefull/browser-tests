import styles from './styles.module.scss';
import { useRef, useState } from 'react';
import { Button } from '@/app/components/Button/Button';
import { getErrorMessage } from '@utils';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';

type TIdleState = {
  screenState: string;
  userState: string;
};

export const TestIdleDetection = () => {
  const [detectorActive, setDetectorActive] = useState(false);
  const [idleState, setIdleState] = useState<TIdleState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const startIdleDetection = async () => {
    try {
      setError(null);

      if ((await IdleDetector.requestPermission()) !== 'granted') {
        setError('Idle detection permission is not granted.');
        return;
      }

      const idleDetector = new IdleDetector();

      setIdleState({
        screenState: idleDetector.screenState,
        userState: idleDetector.userState,
      });

      idleDetector.addEventListener('change', (event) => {
        const target = event.currentTarget;

        if (target === null) {
          setError('Idle change event target is null');
          return;
        }

        if ('screenState' in target && 'userState' in target) {
          const eventScreenState = target.screenState;
          const eventUserState = target.userState;

          if (idleDetector.screenState !== eventScreenState || idleDetector.userState !== eventUserState) {
            setError('Idle state from event does not match current state of the detector.');
          }
        }

        setIdleState({
          screenState: idleDetector.screenState,
          userState: idleDetector.userState,
        });
      });

      const controller = new AbortController();
      controllerRef.current = controller;

      controller.signal.addEventListener('abort', () => {
        setIdleState(null);
        setDetectorActive(false);
        controllerRef.current = null;
      });

      await idleDetector.start({
        threshold: 60 * 1000,
        signal: controller.signal,
      });

      setIdleState({
        screenState: idleDetector.screenState,
        userState: idleDetector.userState,
      });

      setDetectorActive(true);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const stopIdleDetection = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();

      controllerRef.current = null;
      setIdleState(null);
    } else {
      setError('Idle detector controller is not initialized.');
    }

    setDetectorActive(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button text="Start detector" disabled={detectorActive} onClick={startIdleDetection} />
        <Button text="Stop detector" disabled={!detectorActive} onClick={stopIdleDetection} />
      </div>
      <div className={styles.results}>
        <span>Screen state: {idleState?.screenState || 'not tracking'}</span>
        <span>User state: {idleState?.userState || 'not tracking'}</span>
        <ErrorMessage message={error} />
      </div>
    </div>
  );
};
