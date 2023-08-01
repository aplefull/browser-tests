import {
  TestInputs,
  TestOldTags,
  TestSupportedImageFormats,
  TestSupportedVideoFormats,
  TestSvgFavicon,
} from '@/app/html-tests/components';

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
