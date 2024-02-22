import { RefObject, useEffect, useRef } from 'react';
import { isNode } from '@utils';

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

export const useClickOutside = (
  onClickOutside: () => void,
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
) => {
  useEffect(() => {
    const arr = Array.isArray(refs) ? refs : [refs];

    const handleClickOutside = (event: MouseEvent) => {
      if (arr.every((ref) => ref.current && isNode(event.target) && !ref.current.contains(event.target))) {
        onClickOutside();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
};
