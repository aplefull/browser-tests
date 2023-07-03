import styles from './page.module.scss';

import TestLabelingLoops from '@/app/js-tests/components/TestLabelingLoops/TestLabelingLoops';
import TestTabInteractions from '@/app/js-tests/components/TestTabInteractions/TestTabInteractions';
import TestMasonry from '@/app/js-tests/components/TestMasonry/TestMasonry';

export const JSTestsPage = () => {
  return (
    <main className={styles.testsContainer}>
      <TestLabelingLoops />
      <TestTabInteractions />
      <TestMasonry />
    </main>
  );
};
