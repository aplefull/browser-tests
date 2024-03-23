import styles from './styles.module.scss';
import videoAv1 from '@assets/videos/cats_av1.mp4';
import videoH264 from '@assets/videos/cats_h264.mp4';
import videoH265 from '@assets/videos/cats_h265.mp4';
import videoOGG from '@assets/videos/cats_theora.ogg';
import videoVP8 from '@assets/videos/cats_vp8.webm';
import videoVP9 from '@assets/videos/cats_vp9.webm';

export const TestSupportedVideoFormats = () => {
  const videos = [
    { name: 'mp4', codec: 'AV1', src: videoAv1 },
    { name: 'mp4', codec: 'H.264', src: videoH264 },
    { name: 'mp4', codec: 'H.265', src: videoH265 },
    { name: 'webm', codec: 'VP8', src: videoVP8 },
    { name: 'webm', codec: 'VP9', src: videoVP9 },
  ];
  return (
    <div className={styles.supportedVideoFormats}>
      {videos.map((video, index) => {
        return (
          <div key={index}>
            <video controls src={video.src} />
            <span>
              {video.name}/{video.codec}
            </span>
          </div>
        );
      })}
    </div>
  );
};
