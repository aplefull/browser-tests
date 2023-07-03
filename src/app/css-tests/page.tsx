import styles from './page.module.scss';
import {
  TestBlockStyleTag,
  TestColors,
  TestCssBlendModes,
  TestCssDropdown,
  TestCssFilters,
  TestCssGradients,
  TestCssGrid,
  TestHasSelector,
  TestMediaQueries,
  TestObjectViewBox,
  TestScrollBehaviours,
  TestSelection,
  TestShapeOutside,
  TestSupportsRule,
  TestTextFillColor,
  TestTextOverflow,
  TestWritingModes,
} from '@/app/css-tests/components';
import TestSvgs from '@/app/css-tests/components/TestSvgs/TestSvgs';
import TestCssFunctions from '@/app/css-tests/components/TestCssFunctions/TestCssFunctions';

export const CSSTestsPage = () => {
  return (
    <main className={styles.testsContainer}>
      <TestSupportsRule />
      <TestTextOverflow />
      <TestSelection />
      <TestCssFilters />
      <TestCssBlendModes />
      <TestBlockStyleTag />
      <TestCssGrid />
      <TestTextFillColor />
      <TestShapeOutside />
      <TestCssDropdown />
      <TestHasSelector />
      <TestWritingModes />
      <TestScrollBehaviours />
      <TestCssGradients />
      <TestObjectViewBox />
      <TestColors />
      <TestMediaQueries />
      <TestSvgs />
      <TestCssFunctions />
    </main>
  );
};
