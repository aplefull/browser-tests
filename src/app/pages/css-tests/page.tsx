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
  TestTextFillColor,
  TestTextOverflow,
  TestWritingModes,
  TestSvgs,
  TestCssFunctions,
  TestContainRule,
} from '@/app/pages/css-tests/components';

export const CSSTestsPage = () => {
  return (
    <>
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
      <TestContainRule />
    </>
  );
};
