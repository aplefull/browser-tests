import styles from './page.module.scss';
import TestLargeImage from '@/app/misc-tests/components/TestLargeImage/TestLargeImage';
import TestLayouts from '@/app/misc-tests/components/TestLayouts/TestLayouts';
import TestDifficultStrings from '@/app/misc-tests/components/TestDifficultStrings/TestDifficultStrings';

export const MiscTestsPage = () => {
  return (
    <main className={styles.testsContainer}>
      <TestLargeImage />
      <TestLayouts />
      <TestDifficultStrings />
    </main>
  );
};
