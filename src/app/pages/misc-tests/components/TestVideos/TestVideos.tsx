import styles from './styles.module.scss';
import { CssVideo } from '@/app/pages/misc-tests/components/subcomponents/CssVideo/CssVideo';
import longWebm from '@assets/videos/long.webm';
import { DynamicResolutionVideos } from '@/app/pages/misc-tests/components/subcomponents/DynamicResolutionVideos/DynamicResolutionVideo';
import { TransparentVideo } from '@/app/pages/misc-tests/components/subcomponents/TransparentVideo/TransparentVideo';
import { WeirdDimensionsVideos } from '@/app/pages/misc-tests/components/subcomponents/WeirdDimensionsVideos/WeirdDimensionsVideo';

export const TestVideos = () => {
  return (
    <div className={styles.videos}>
      <h2>CSS video</h2>
      <CssVideo />
      <h2>Videos with dynamic resolution</h2>
      <DynamicResolutionVideos />
      <h2>Video with alpha channel</h2>
      <TransparentVideo />
      <h2>Weird video resolutions</h2>
      <WeirdDimensionsVideos />
      <video controls src={longWebm} />
    </div>
  );
};
