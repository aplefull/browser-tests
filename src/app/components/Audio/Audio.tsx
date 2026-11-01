import styles from './styles.module.scss';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AlertTriangle, PlayerPause, PlayerPlay, Repeat } from 'tabler-icons-react';
import classNames from 'classnames';
import { assignRefs, clamp } from '@utils';
import {
  formatMediaTime,
  handleMediaKey,
  MediaButton,
  SeekBar,
  togglePlay,
  useMediaState,
  VolumeControl,
} from '@/app/components/MediaControls/MediaControls';

type TAudioProps = {
  src?: string;
  style?: React.CSSProperties;
  className?: string;
  defaultVolume?: number;
  defaultLoop?: boolean;
};

const AudioPlayer = forwardRef<HTMLAudioElement | null, TAudioProps>(
  ({ src, style, className, defaultLoop = false, defaultVolume = 1 }, ref) => {
    const [loop, setLoop] = useState(defaultLoop);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const media = useMediaState(audioRef);

    const toggleLoop = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.loop = !audio.loop;
      setLoop(audio.loop);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.getAttribute('role') === 'slider') return;
      if (target.tagName === 'BUTTON' && (event.key === ' ' || event.key === 'Enter')) return;

      handleMediaKey(event, audioRef.current);
    };

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = clamp(defaultVolume, 0, 1);
      audio.loop = defaultLoop;

      return () => {
        audio.pause();
      };
    }, []);

    return (
      <div className={classNames(styles.container, className)} style={style} onKeyDown={handleKeyDown}>
        <button
          type="button"
          aria-label={media.playing ? 'Pause' : 'Play'}
          title={media.playing ? 'Pause (k)' : 'Play (k)'}
          className={styles.play}
          onClick={() => togglePlay(audioRef.current)}
          disabled={!!media.error}
        >
          {media.playing ? <PlayerPause size={16} fill="currentColor" /> : <PlayerPlay size={16} fill="currentColor" />}
        </button>
        <span className={styles.time}>{formatMediaTime(media.currentTime, media.duration)}</span>
        {media.error ? (
          <span className={styles.error}>
            <AlertTriangle size={14} />
            {media.error}
          </span>
        ) : (
          <SeekBar
            className={styles.seekBar}
            media={audioRef}
            currentTime={media.currentTime}
            duration={media.duration}
            buffered={media.buffered}
          />
        )}
        <MediaButton label={loop ? 'Loop: on' : 'Loop: off'} active={loop} onClick={toggleLoop}>
          <Repeat size={18} />
        </MediaButton>
        <VolumeControl media={audioRef} volume={media.volume} muted={media.muted} />
        <audio ref={assignRefs(audioRef, ref)} src={src} preload="metadata" />
      </div>
    );
  },
);

export { AudioPlayer as Audio };
