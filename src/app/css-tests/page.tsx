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
  TestSvgs,
  TestCssFunctions,
} from '@/app/css-tests/components';

export const CSSTestsPage = () => {
  return (
    <>
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
    </>
  );
};
