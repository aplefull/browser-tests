import {
  TestInputs,
  TestOldTags,
  TestSupportedImageFormats,
  TestSupportedVideoFormats,
  TestSvgFavicon,
} from '@/app/pages/html-tests/components';
import {
  TestSupportedAudioFormats
} from '@/app/pages/html-tests/components/TestSupportedAudioFormats/TestSupportedAudioFormats';

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
