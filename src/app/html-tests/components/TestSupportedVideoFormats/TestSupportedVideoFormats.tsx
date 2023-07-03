import styles from './styles.module.scss';
import videoAv1 from '@assets/videos/cats_av1.avi';
import video3GP from '@assets/videos/cats_h263.3gp';
import videoH264 from '@assets/videos/cats_h264.mp4';
import videoH265 from '@assets/videos/cats_h265.mp4';
import videoMP4V from '@assets/videos/cats_mp4v-es.mp4';
import videoMPEG1 from '@assets/videos/cats_mpeg-1.mpeg';
import videoMPEG2 from '@assets/videos/cats_mpeg-2.mpeg';
import videoOGG from '@assets/videos/cats_theora.ogg';
import videoVP8 from '@assets/videos/cats_vp8.webm';
import videoVP9 from '@assets/videos/cats_vp9.webm';

export default function TestSupportedVideoFormats() {
  const videos = [
    { name: 'mp4', codec: 'AV1', src: videoAv1 },
    { name: '3gp', codec: 'H.263', src: video3GP },
    { name: 'mp4', codec: 'H.264', src: videoH264 },
    { name: 'mp4', codec: 'H.265', src: videoH265 },
    { name: 'mp4', codec: 'MP4V-ES', src: videoMP4V },
    { name: 'MPEG', codec: 'MPEG-1', src: videoMPEG1 },
    { name: 'MPEG', codec: 'MPEG-2', src: videoMPEG2 },
    { name: 'ogg', codec: 'Theora', src: videoOGG },
    { name: 'webm', codec: 'VP8', src: videoVP8 },
    { name: 'webm', codec: 'VP9', src: videoVP9 },
  ];

  return (
    <section className={styles.supportedVideoFormats}>
      <h1>Supported video formats</h1>
      <div>
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
    </section>
  );
}
