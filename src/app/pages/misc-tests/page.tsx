import {
  TestLargeImage,
  TestDifficultStrings,
  TestEmojis,
  TestLayouts,
  TestMisc,
} from '@/app/pages/misc-tests/components';
import { TestMathMl } from '@/app/pages/misc-tests/components/TestMathML/TestMathML';

export const MiscTestsPage = () => {
  return (
    <>
      <TestLargeImage />
      <TestLayouts />
      <TestDifficultStrings />
      <TestEmojis />
      <TestMisc />
      <TestMathMl />
    </>
  );
};
