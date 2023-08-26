import { useEffect, useState } from 'react';
import { iteratorToArray } from '@/utils/utils';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import { Button } from '@/app/components/Button/Button';
import styles from './styles.module.scss';

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

    const keymap = keysArray.map((key) => {
      const value = keyboardLayoutMap.get(key) || '""';
      return [ key, value ];
    });

    const sortedKeymap = keymap.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }

      if (a[0] > b[0]) {
        return 1;
      }

      return 0;
    });

    setKeymap(Object.fromEntries(sortedKeymap));
  };

  const runTests = async () => {
    await getKeyboardLayoutMap();
  };

  return (
    <div className={styles.keyboard}>
      <h2>Keyboard</h2>
      <Button text="Run" onClick={runTests} />
      {keymap && Object.keys(keymap).length > 0 && <Json data={keymap} />}
    </div>
  );
};
