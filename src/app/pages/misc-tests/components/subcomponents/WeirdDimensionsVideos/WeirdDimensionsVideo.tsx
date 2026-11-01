import styles from './styles.module.scss';
import webm1x1 from '@assets/videos/1x1.webm';
import webm600x1 from '@assets/videos/600x1.webm';
import webm1x600 from '@assets/videos/1x600.webm';
import { Video } from '@/app/components/Video/Video';

export const WeirdDimensionsVideos = () => {
  return (
    <div className={styles.weirdResolutions}>
      <div>
        <span>1x1</span>
        <Video className={styles.video} src={webm1x1} />
      </div>
      <div>
        <span>600x1</span>
        <Video className={styles.video} src={webm600x1} />
      </div>
      <div>
        <span>1x600</span>
        <Video className={styles.video} src={webm1x600} />
      </div>
    </div>
  );
};
