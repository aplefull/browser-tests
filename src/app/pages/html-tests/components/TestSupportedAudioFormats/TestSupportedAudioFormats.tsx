import styles from './styles.module.scss';
import audioAAC from '@assets/audio/winter.aac';
import audio3GP from '@assets/audio/winter.3gp';
import audioADTS from '@assets/audio/winter.adts';
import audioFLAC from '@assets/audio/winter.flac';
import audioMP3 from '@assets/audio/winter.mp3';
import audioMP4 from '@assets/audio/winter.mp4';
import audioOpus from '@assets/audio/winter.webm';
import audioVorbis from '@assets/audio/winter.ogg';

export const TestSupportedAudioFormats = () => {
  const audios = [
    { name: 'aac', codec: 'AAC', src: audioAAC },
    { name: 'mp4', codec: 'AAC', src: audioMP4 },
    { name: 'adts', codec: 'AAC', src: audioADTS },
    { name: '3gp', codec: 'AAC', src: audio3GP },
    { name: 'flac', codec: 'FLAC', src: audioFLAC },
    { name: 'mp3', codec: 'MP3', src: audioMP3 },
    { name: 'webm', codec: 'Opus', src: audioOpus },
    { name: 'ogg', codec: 'Vorbis', src: audioVorbis },
  ];

  return (
    <div className={styles.supportedAudioFormats}>
      {audios.map((audio, index) => {
        return (
          <div key={index}>
            <audio controls src={audio.src} />
            <span>
              {audio.name}/{audio.codec}
            </span>
          </div>
        );
      })}
    </div>
  );
};
