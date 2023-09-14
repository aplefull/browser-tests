import {
  TestCanvas,
  TestCrypto,
  TestEvents,
  TestLabelingLoops,
  TestMasonry,
  TestNavigatorFeatures,
  TestTabInteractions,
  TestWebStorage,
  TestMath,
  TestDates,
} from '@/app/pages/js-tests/components';

export const JSTestsPage = () => {
  return (
    <>
      <TestLabelingLoops />
      <TestTabInteractions />
      <TestMasonry />
      <TestEvents />
      <TestNavigatorFeatures />
      <TestWebStorage />
      <TestCanvas />
      <TestCrypto />
      <TestMath />
      <TestDates />
    </>
  );
};
