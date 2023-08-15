import {
  TestInputs,
  TestOldTags,
  TestSupportedImageFormats,
  TestSupportedVideoFormats,
  TestSvgFavicon,
} from '@/app/pages/html-tests/components';

export const HTMLTestsPage = () => {
  return (
    <>
      <TestInputs />
      <TestOldTags />
      <TestSvgFavicon />
      <TestSupportedImageFormats />
      <TestSupportedVideoFormats />
    </>
  );
};
