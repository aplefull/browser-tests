import styles from './styles.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';

export const TestPointerLock = () => {
  const [useRawInput, setUseRawInput] = useState(false);
  const [lockActive, setLockActive] = useState(false);
  const [pointerCoords, setPointerCoords] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const lockAreaRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const initialCoordsRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setPointerCoords((prevCoords) => {
      const lockAreBB = lockAreaRef.current?.getBoundingClientRect();
      const pointerRadius = (pointerRef.current?.clientWidth || 0) / 2;

      if (!lockAreBB) {
        return prevCoords;
      }

      const lockAreaWidth = lockAreBB.width;
      const lockAreaHeight = lockAreBB.height;

      const x = prevCoords.x + event.movementX;
      const y = prevCoords.y + event.movementY;

      return {
        x: Math.min(Math.max(x, pointerRadius), lockAreaWidth - pointerRadius),
        y: Math.min(Math.max(y, pointerRadius), lockAreaHeight - pointerRadius),
      };
    });
  }, []);

  const toggleLock = async () => {
    setError(null);

    if (lockActive) {
      lockAreaRef.current?.removeEventListener('mousemove', handleMouseMove);
      document.exitPointerLock();
      return;
    }

    try {
      lockAreaRef.current?.addEventListener('mousemove', handleMouseMove);

      if (useRawInput) {
        await lockAreaRef.current?.requestPointerLock({ unadjustedMovement: true });
      } else {
        await lockAreaRef.current?.requestPointerLock();
      }

      initialCoordsRef.current = { x: pointerCoords.x, y: pointerCoords.y };
      setPointerCoords({ x: pointerCoords.x, y: pointerCoords.y });
    } catch (err) {
      setError(`Failed to lock pointer: ${err instanceof Error ? err.message : 'Unknown error'}`);
      lockAreaRef.current?.removeEventListener('mousemove', handleMouseMove);
    }
  };

  useEffect(() => {
    if (!('requestPointerLock' in Element.prototype) || !('exitPointerLock' in Document.prototype)) {
      setIsSupported(false);
      return;
    }

    if (pointerRef.current) {
      const size = pointerRef.current.clientWidth;

      setPointerCoords({
        x: size / 2 + initialCoordsRef.current.x,
        y: size / 2 + initialCoordsRef.current.y,
      });
    }

    const handleLockChange = () => {
      setLockActive(!!document.pointerLockElement);
      if (!document.pointerLockElement) {
        setError(null);
      }
    };

    const handleLockError = () => {
      setLockActive(false);
      setError('Pointer lock was denied or failed. This may be due to browser security restrictions.');
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('pointerlockerror', handleLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
      document.removeEventListener('pointerlockerror', handleLockError);
    };
  }, []);

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Pointer Lock API is not supported in this browser</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <span>Click in the area to lock cursor:</span>
      <Checkbox checked={useRawInput} onChange={setUseRawInput} label="Use raw mouse input" />
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.lockArea} ref={lockAreaRef} onClick={toggleLock}>
        <div
          ref={pointerRef}
          className={classNames(styles.pointer, {
            [styles.hidden]: !lockActive,
          })}
          style={{ left: pointerCoords.x, top: pointerCoords.y }}
        />
      </div>
    </div>
  );
};
