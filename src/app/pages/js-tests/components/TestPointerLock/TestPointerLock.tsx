import styles from './styles.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';

export const TestPointerLock = () => {
  const [useRawInput, setUseRawInput] = useState(false);
  const [lockActive, setLockActive] = useState(false);
  const [pointerCoords, setPointerCoords] = useState({ x: 0, y: 0 });

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

  const toggleLock = () => {
    if (lockActive) {
      lockAreaRef.current?.removeEventListener('mousemove', handleMouseMove);
      document.exitPointerLock();
      return;
    }

    lockAreaRef.current?.addEventListener('mousemove', handleMouseMove);

    if (useRawInput) {
      lockAreaRef.current?.requestPointerLock({ unadjustedMovement: true });
    } else {
      lockAreaRef.current?.requestPointerLock();
    }

    initialCoordsRef.current = { x: pointerCoords.x, y: pointerCoords.y };

    setPointerCoords({ x: pointerCoords.x, y: pointerCoords.y });
  };

  useEffect(() => {
    if (pointerRef.current) {
      const size = pointerRef.current.clientWidth;

      setPointerCoords({
        x: size / 2 + initialCoordsRef.current.x,
        y: size / 2 + initialCoordsRef.current.y,
      });
    }

    const handleLockChange = () => {
      setLockActive(!!document.pointerLockElement);
    };

    const handleLockError = () => {
      setLockActive(false);
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('pointerlockerror', handleLockError);

    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
      document.removeEventListener('pointerlockerror', handleLockError);
    };
  }, []);

  return (
    <div className={styles.container}>
      <span>Click in the area to lock cursor:</span>
      <Checkbox checked={useRawInput} onChange={setUseRawInput} label="Use raw mouse input" />
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
