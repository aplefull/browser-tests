import styles from './page.module.scss';

import TestInputs from '@/app/html-tests/components/TestInputs/TestInputs';
import TestOldTags from '@/app/html-tests/components/TestOldTags/TestOldTags';
import TestSvgFavicon from '@/app/html-tests/components/TestSvgFavicon/TestSvgFavicon';
import TestSupportedImageFormats from '@/app/html-tests/components/TestSupportedImageFormats/TestSupportedImageFormats';
import TestSupportedVideoFormats from '@/app/html-tests/components/TestSupportedVideoFormats/TestSupportedVideoFormats';

export const HTMLTestsPage = () => {
  return (
    <main className={styles.testsContainer}>
      <TestInputs />
      <TestOldTags />
      <TestSvgFavicon />
      <TestSupportedImageFormats />
      <TestSupportedVideoFormats />
    </main>
  );
};
