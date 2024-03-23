import styles from './styles.module.scss';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { PlayerPause, PlayerPlay, Repeat, RepeatOff } from 'tabler-icons-react';
import classNames from 'classnames';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { assignRefs, calculateThumbPosition, clamp, formatTime } from '@utils';
import { QMath } from '@math';

type TAudioProps = {
  src?: string;
  style?: React.CSSProperties;
  className?: string;
  defaultVolume?: number;
  defaultLoop?: boolean;
};

const AudioPlayer = forwardRef<HTMLAudioElement | null, TAudioProps>(
  ({ src, style, className, defaultLoop, defaultVolume }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(QMath.clamp(defaultVolume || 1, 0, 1));
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loop, setLoop] = useState(defaultLoop || false);

    const progressBarContainerRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      setIsPlaying((prev) => !prev);

      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    };

    const toggleLoop = () => {
      const audio = audioRef.current;
      if (!audio) return;

      setLoop((prev) => !prev);
      audio.loop = !loop;
    };

    const handleVolumeSliderChange = (value: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      setVolume(Number(value));
      audio.volume = Number(value);
    };

    const handleProgressBarMouseDown = (event: React.MouseEvent) => {
      const audio = audioRef.current;
      if (!audio) return;

      const progressBarContainer = progressBarContainerRef.current;

      if (!progressBarContainer || !audio) return;

      document.body.style.userSelect = 'none';

      const { left, width } = progressBarContainer.getBoundingClientRect();

      const handleMouseMove = (event: MouseEvent) => {
        const { clientX } = event;
        const progress = clamp((clientX - left) / width, 0, 1);
        const time = progress * audio.duration;

        audio.currentTime = time;
        setCurrentTime(time);
      };

      handleMouseMove(event.nativeEvent);

      const handleMouseUp = () => {
        document.body.style.userSelect = '';

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('focusout', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('blur', handleMouseUp);
    };

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.volume = volume;
      audio.loop = loop;

      const onLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const onTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const onPause = () => {
        setIsPlaying(false);
      };

      const onEnded = () => {
        setCurrentTime(0);
        setIsPlaying(false);
      };

      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.pause();
      };
    }, []);

    const thumbElement = progressBarContainerRef.current?.querySelector(`.${styles.thumb}`);

    const { width: thumbWidth = 10 } = thumbElement?.getBoundingClientRect() || {};
    const { width: containerWidth = 100 } = progressBarContainerRef.current?.getBoundingClientRect() || {};

    const minThumbLeft = calculateThumbPosition(0, 0, duration, thumbWidth, containerWidth);
    const maxThumbLeft = calculateThumbPosition(duration, 0, duration, thumbWidth, containerWidth);

    const progressStyle = {
      width: `${(currentTime / duration) * 100}%`,
    };

    const thumbStyle = {
      left: `${clamp((currentTime / duration) * 100, minThumbLeft, maxThumbLeft)}%`,
    };

    return (
      <div className={classNames(styles.container, className)} style={style}>
        <button onClick={togglePlay} className={styles.buttonWithIcon}>
          {isPlaying ? <PlayerPause /> : <PlayerPlay />}
        </button>
        <div className={styles.time}>{`${formatTime(currentTime)} / ${formatTime(duration)}`}</div>
        <div
          className={styles.progressBarContainer}
          ref={progressBarContainerRef}
          onMouseDown={handleProgressBarMouseDown}
        >
          <div className={styles.progressBar}>
            <div className={styles.progressBarProgress} style={progressStyle} />
            <div className={styles.progressBarLoaded} />
          </div>
          <div className={styles.thumb} style={thumbStyle} />
        </div>
        <button onClick={toggleLoop} className={styles.buttonWithIcon}>
          {loop ? <Repeat /> : <RepeatOff />}
        </button>
        <RangeInput
          className={styles.volumeSlider}
          value={volume}
          onChange={handleVolumeSliderChange}
          min={0}
          max={1}
          step={0.01}
        />
        <audio className={styles.hidden} ref={assignRefs(audioRef, ref)} src={src} />
      </div>
    );
  },
);

export { AudioPlayer as Audio };
