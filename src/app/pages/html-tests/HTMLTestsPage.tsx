import {
  TestInputs,
  TestOldTags,
  TestSvgFavicon,
  TestSupportedImageFormats,
  TestSupportedVideoFormats,
  TestSupportedAudioFormats,
} from '@/app/pages/html-tests/components';

export const HTMLTestsPage = () => {
  return (
    <>
      <TestInputs />
      <TestOldTags />
      <TestSvgFavicon />
      <TestSupportedImageFormats />
      <TestSupportedVideoFormats />
      <TestSupportedAudioFormats />
    </>
  );
};
