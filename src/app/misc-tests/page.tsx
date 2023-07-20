import styles from './page.module.scss';
import TestLargeImage from '@/app/misc-tests/components/TestLargeImage/TestLargeImage';
import TestLayouts from '@/app/misc-tests/components/TestLayouts/TestLayouts';
import TestDifficultStrings from '@/app/misc-tests/components/TestDifficultStrings/TestDifficultStrings';
import { TestEmojis } from '@/app/misc-tests/components/TestEmojis/TestEmojis';

export const MiscTestsPage = () => {
  return (
    <main className={styles.testsContainer}>
      <TestLargeImage />
      <TestLayouts />
      <TestDifficultStrings />
      <TestEmojis />
    </main>
  );
};
