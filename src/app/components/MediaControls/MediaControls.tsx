import styles from './styles.module.scss';
import classNames from 'classnames';
import { KeyboardEvent, PointerEvent, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { Volume, Volume2, Volume3 } from 'tabler-icons-react';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { clamp, formatTime } from '@/utils/utils';

export type TMediaElement = HTMLVideoElement | HTMLAudioElement;

export type TMediaState = {
  playing: boolean;
  ended: boolean;
  waiting: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
  error: string | null;
};

const initialState: TMediaState = {
  playing: false,
  ended: false,
  waiting: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  muted: false,
  error: null,
};

const MEDIA_ERRORS: Record<number, string> = {
  1: 'Playback aborted',
  2: 'Network error',
  3: 'Decoding error',
  4: 'Format not supported',
};

const getBufferedEnd = (media: TMediaElement) => {
  const { buffered, currentTime } = media;

  for (let index = 0; index < buffered.length; index++) {
    if (buffered.start(index) <= currentTime + 0.5 && buffered.end(index) >= currentTime) {
      return buffered.end(index);
    }
  }

  return buffered.length ? buffered.end(buffered.length - 1) : 0;
};

export const useMediaState = (ref: RefObject<TMediaElement | null>) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const media = ref.current;
    if (!media) return;

    let frame = 0;

    const read = () => {
      setState({
        playing: !media.paused && !media.ended,
        ended: media.ended,
        waiting: !media.paused && media.readyState < HTMLMediaElement.HAVE_FUTURE_DATA && !media.error,
        currentTime: media.currentTime,
        duration: media.duration,
        buffered: getBufferedEnd(media),
        volume: media.volume,
        muted: media.muted,
        error: media.error ? MEDIA_ERRORS[media.error.code] || media.error.message || 'Playback error' : null,
      });
    };

    const tick = () => {
      read();
      frame = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      cancelAnimationFrame(frame);
      tick();
    };

    const onStop = () => {
      cancelAnimationFrame(frame);
      read();
    };

    const events = [
      'loadstart',
      'loadedmetadata',
      'durationchange',
      'progress',
      'timeupdate',
      'volumechange',
      'waiting',
      'canplay',
      'seeking',
      'seeked',
      'error',
      'emptied',
    ];

    events.forEach((event) => media.addEventListener(event, read));
    media.addEventListener('playing', onPlay);
    media.addEventListener('play', onPlay);
    media.addEventListener('pause', onStop);
    media.addEventListener('ended', onStop);

    read();
    if (!media.paused) tick();

    return () => {
      cancelAnimationFrame(frame);
      events.forEach((event) => media.removeEventListener(event, read));
      media.removeEventListener('playing', onPlay);
      media.removeEventListener('play', onPlay);
      media.removeEventListener('pause', onStop);
      media.removeEventListener('ended', onStop);
    };
  }, [ref]);

  return state;
};

export const togglePlay = (media: TMediaElement | null) => {
  if (!media) return;

  if (media.paused || media.ended) {
    media.play().catch(() => {});
  } else {
    media.pause();
  }
};

export const seekBy = (media: TMediaElement | null, seconds: number) => {
  if (!media || !Number.isFinite(media.duration)) return;

  media.currentTime = clamp(media.currentTime + seconds, 0, media.duration);
};

export const changeVolume = (media: TMediaElement | null, delta: number) => {
  if (!media) return;

  media.volume = clamp(Number((media.volume + delta).toFixed(2)), 0, 1);
  media.muted = media.volume === 0;
};

export const handleMediaKey = (event: KeyboardEvent, media: TMediaElement | null) => {
  if (!media || event.ctrlKey || event.metaKey || event.altKey) return false;

  switch (event.code) {
    case 'Space':
    case 'KeyK':
      togglePlay(media);
      break;
    case 'KeyM':
      media.muted = !media.muted;
      break;
    case 'ArrowLeft':
      seekBy(media, -5);
      break;
    case 'ArrowRight':
      seekBy(media, 5);
      break;
    case 'KeyJ':
      seekBy(media, -10);
      break;
    case 'KeyL':
      seekBy(media, 10);
      break;
    case 'ArrowUp':
      changeVolume(media, 0.05);
      break;
    case 'ArrowDown':
      changeVolume(media, -0.05);
      break;
    case 'Home':
      seekBy(media, -Infinity);
      break;
    case 'End':
      seekBy(media, Infinity);
      break;
    default: {
      const digit = /^Digit(\d)$/.exec(event.code);
      if (!digit || !Number.isFinite(media.duration)) return false;

      media.currentTime = (media.duration * Number(digit[1])) / 10;
    }
  }

  event.preventDefault();
  event.stopPropagation();
  return true;
};

export const formatMediaTime = (currentTime: number, duration: number) => {
  return `${formatTime(currentTime)} / ${formatTime(duration)}`;
};

type TMediaButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export const MediaButton = ({ label, onClick, children, active, className }: TMediaButtonProps) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={classNames(styles.button, { [styles.active]: active }, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

type TSeekBarProps = {
  media: RefObject<TMediaElement | null>;
  currentTime: number;
  duration: number;
  buffered: number;
  className?: string;
};

export const SeekBar = ({ media, currentTime, duration, buffered, className }: TSeekBarProps) => {
  const [dragTime, setDragTime] = useState<number | null>(null);
  const [hover, setHover] = useState<{ x: number; time: number } | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const wasPlayingRef = useRef(false);

  const seekable = Number.isFinite(duration) && duration > 0;
  const time = dragTime ?? currentTime;
  const toPercent = (value: number) => (seekable ? clamp((value / duration) * 100, 0, 100) : 0);

  const getTime = (clientX: number) => {
    const track = trackRef.current;
    if (!track || !seekable) return { x: 0, time: 0 };

    const { left, width } = track.getBoundingClientRect();
    const x = clamp(clientX - left, 0, width);

    return { x, time: (x / width) * duration };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const element = media.current;
    if (!seekable || !element || event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    wasPlayingRef.current = !element.paused;
    element.pause();

    const { time } = getTime(event.clientX);
    setDragTime(time);
    element.currentTime = time;
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const position = getTime(event.clientX);
    setHover(seekable ? position : null);

    if (dragTime === null || !media.current) return;

    setDragTime(position.time);
    media.current.currentTime = position.time;
  };

  const handlePointerUp = () => {
    if (dragTime === null) return;

    setDragTime(null);

    if (wasPlayingRef.current) {
      media.current?.play().catch(() => {});
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const element = media.current;
    if (!element || !seekable) return;

    const steps: Record<string, number> = {
      ArrowRight: 5,
      ArrowUp: 5,
      ArrowLeft: -5,
      ArrowDown: -5,
      PageUp: duration / 10,
      PageDown: -duration / 10,
      Home: -Infinity,
      End: Infinity,
    };

    if (!(event.key in steps)) return;

    event.preventDefault();
    event.stopPropagation();
    seekBy(element, steps[event.key]);
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={seekable ? 0 : -1}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={seekable ? duration : 0}
      aria-valuenow={seekable ? time : 0}
      aria-valuetext={formatMediaTime(time, duration)}
      aria-disabled={!seekable}
      className={classNames(styles.seekBar, className, {
        [styles.dragging]: dragTime !== null,
        [styles.disabled]: !seekable,
      })}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => setHover(null)}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.track}>
        <div className={styles.buffered} style={{ width: `${toPercent(buffered)}%` }} />
        {hover && <div className={styles.hoverFill} style={{ width: hover.x }} />}
        <div className={styles.progress} style={{ width: `${toPercent(time)}%` }} />
      </div>
      <div className={styles.thumb} style={{ left: `${toPercent(time)}%` }} />
      {hover && (
        <div className={styles.tooltip} style={{ left: hover.x }}>
          {formatTime(hover.time)}
        </div>
      )}
    </div>
  );
};

type TVolumeControlProps = {
  media: RefObject<TMediaElement | null>;
  volume: number;
  muted: boolean;
  className?: string;
};

export const VolumeControl = ({ media, volume, muted, className }: TVolumeControlProps) => {
  const level = muted ? 0 : volume;
  const Icon = level === 0 ? Volume3 : level < 0.5 ? Volume2 : Volume;

  const toggleMute = () => {
    const element = media.current;
    if (!element) return;

    if (element.muted || element.volume === 0) {
      element.muted = false;
      if (element.volume === 0) element.volume = 0.5;
    } else {
      element.muted = true;
    }
  };

  const handleVolumeChange = (value: number) => {
    const element = media.current;
    if (!element) return;

    element.volume = value;
    element.muted = value === 0;
  };

  return (
    <div className={classNames(styles.volume, className)}>
      <MediaButton label={level === 0 ? 'Unmute (m)' : 'Mute (m)'} onClick={toggleMute}>
        <Icon size={18} />
      </MediaButton>
      <RangeInput
        className={styles.volumeSlider}
        value={level}
        onChange={handleVolumeChange}
        min={0}
        max={1}
        step={0.01}
      />
    </div>
  );
};
