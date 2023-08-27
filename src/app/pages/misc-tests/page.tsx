import {
  TestLargeImage,
  TestDifficultStrings,
  TestEmojis,
  TestLayouts,
  TestMisc,
} from '@/app/pages/misc-tests/components';

export const MiscTestsPage = () => {
  return (
    <>
      <TestLargeImage />
      <TestLayouts />
      <TestDifficultStrings />
      <TestEmojis />
      <TestMisc />
    </>
  );
};
