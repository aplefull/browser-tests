import { useEffect, useState } from 'react';
import { iteratorToArray } from '@/utils/utils';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import { Button } from '@/app/components/Button/Button';

export const NavigatorKeyboard = () => {
  const [keymap, setKeymap] = useState<Record<string, string> | null>({});

  const getKeyboardLayoutMap = async () => {
    if (!navigator.keyboard || !navigator.keyboard.getLayoutMap) {
      setKeymap(null);
      return;
    }

    const keyboardLayoutMap = await navigator.keyboard.getLayoutMap();
    const keys = keyboardLayoutMap.keys();
    const keysArray = iteratorToArray(keys);

    const keymap = keysArray.reduce(
      (acc, key) => {
        acc[key] = keyboardLayoutMap.get(key) || '""';
        return acc;
      },
      {} as Record<string, string>,
    );

    setKeymap(keymap);
  };

  const testKeyboardLock = async () => {
    if (!navigator.keyboard || !navigator.keyboard.lock || !navigator.keyboard.unlock) {
      return;
    }

    await navigator.keyboard.lock();

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });

    await navigator.keyboard.unlock();
  };

  const runTests = async () => {
    await getKeyboardLayoutMap();
    await testKeyboardLock();
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      console.log('keydown', e);
    });
  }, []);

  return (
    <div>
      <h2>Keyboard</h2>
      <Button text="Run" onClick={runTests} />
      {keymap && <Json data={keymap} />}
    </div>
  );
};
