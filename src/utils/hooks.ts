import { useEffect, useRef } from 'react';

export const useDoubleKeyPress = (targetKey: string, onDoubleKeyPress: () => void) => {
  const delay = 300;
  const keDownTimeRef = useRef(0);

  useEffect(() => {
    const downHandler = ({ key }: { key: string }) => {
      if (key === targetKey) {
        const now = Date.now();
        const prev = keDownTimeRef.current;

        if (now - prev < delay) {
          onDoubleKeyPress();
        }

        keDownTimeRef.current = now;
      }
    };

    window.addEventListener('keydown', downHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, []);

  return null;
};
