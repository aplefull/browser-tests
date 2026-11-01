import styles from './styles.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Maximize,
  Minimize,
  PictureInPictureOff,
  PictureInPictureOn,
  PlayerPause,
  PlayerPlay,
} from 'tabler-icons-react';
import classNames from 'classnames';
import {
  formatMediaTime,
  handleMediaKey,
  MediaButton,
  SeekBar,
  togglePlay,
  useMediaState,
  VolumeControl,
} from '@/app/components/MediaControls/MediaControls';
import { Loader } from '@/app/components/Loader/Loader';

type TVideoProps = {
  src?: string;
  initialVolume?: number;
  style?: React.CSSProperties;
  className?: string;
  videoClassName?: string;
};

type TWebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

const HIDE_CONTROLS_DELAY = 2000;

export const Video = ({ src, style, initialVolume = 0.5, className, videoClassName }: TVideoProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isInPicInPic, setIsInPicInPic] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const media = useMediaState(videoRef);
  const canPicInPic = document.pictureInPictureEnabled === true;
  const canFullScreen = document.fullscreenEnabled || 'webkitEnterFullscreen' in HTMLVideoElement.prototype;
  const controlsVisible = !media.playing || !isIdle;

  const toggleFullScreen = () => {
    const video = videoRef.current as TWebkitVideo | null;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (document.fullscreenEnabled) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      video?.webkitEnterFullscreen?.();
    }
  };

  const togglePicInPic = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    } else {
      videoRef.current?.requestPictureInPicture().catch(() => {});
    }
  };

  const wakeControls = () => {
    setIsIdle(false);
    clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => setIsIdle(true), HIDE_CONTROLS_DELAY);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.getAttribute('role') === 'slider') return;
    if (target.tagName === 'BUTTON' && (event.key === ' ' || event.key === 'Enter')) return;

    if (event.code === 'KeyF') {
      event.preventDefault();
      event.stopPropagation();
      toggleFullScreen();
    } else if (event.code === 'KeyP' && canPicInPic) {
      event.preventDefault();
      event.stopPropagation();
      togglePicInPic();
    } else if (!handleMediaKey(event, videoRef.current)) {
      return;
    }

    wakeControls();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.min(Math.max(initialVolume, 0), 1);

    const onFullScreenChange = () => setIsFullScreen(document.fullscreenElement === containerRef.current);
    const onEnterPicInPic = () => setIsInPicInPic(true);
    const onLeavePicInPic = () => setIsInPicInPic(false);

    document.addEventListener('fullscreenchange', onFullScreenChange);
    video.addEventListener('enterpictureinpicture', onEnterPicInPic);
    video.addEventListener('leavepictureinpicture', onLeavePicInPic);

    return () => {
      clearTimeout(idleTimeoutRef.current);
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      video.removeEventListener('enterpictureinpicture', onEnterPicInPic);
      video.removeEventListener('leavepictureinpicture', onLeavePicInPic);
    };
  }, []);

  useEffect(() => {
    if (media.playing) wakeControls();
  }, [media.playing]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={classNames(styles.container, className, {
        [styles.idle]: !controlsVisible,
        [styles.fullScreen]: isFullScreen,
      })}
      onMouseMove={wakeControls}
      onMouseLeave={() => media.playing && setIsIdle(true)}
      onKeyDown={handleKeyDown}
      onFocus={wakeControls}
    >
      <video
        ref={videoRef}
        src={src}
        style={style}
        className={classNames(styles.video, videoClassName)}
        playsInline
        onClick={() => togglePlay(videoRef.current)}
        onDoubleClick={toggleFullScreen}
      />

      {media.error && (
        <div className={styles.overlay}>
          <div className={styles.error}>
            <AlertTriangle size={18} />
            <span>{media.error}</span>
          </div>
        </div>
      )}

      {!media.error && media.waiting && (
        <div className={styles.overlay}>
          <Loader size={36} />
        </div>
      )}

      {!media.error && !media.playing && !media.waiting && (
        <button
          type="button"
          aria-label="Play"
          tabIndex={-1}
          className={styles.bigPlay}
          onClick={() => togglePlay(videoRef.current)}
        >
          <PlayerPlay size={26} fill="currentColor" />
        </button>
      )}

      <div className={styles.controls}>
        <SeekBar media={videoRef} currentTime={media.currentTime} duration={media.duration} buffered={media.buffered} />
        <div className={styles.row}>
          <MediaButton label={media.playing ? 'Pause (k)' : 'Play (k)'} onClick={() => togglePlay(videoRef.current)}>
            {media.playing ? (
              <PlayerPause size={18} fill="currentColor" />
            ) : (
              <PlayerPlay size={18} fill="currentColor" />
            )}
          </MediaButton>
          <VolumeControl media={videoRef} volume={media.volume} muted={media.muted} />
          <span className={styles.time}>{formatMediaTime(media.currentTime, media.duration)}</span>
          <div className={styles.spacer} />
          {canPicInPic && (
            <MediaButton
              label={isInPicInPic ? 'Exit picture-in-picture (p)' : 'Picture-in-picture (p)'}
              active={isInPicInPic}
              onClick={togglePicInPic}
            >
              {isInPicInPic ? <PictureInPictureOff size={18} /> : <PictureInPictureOn size={18} />}
            </MediaButton>
          )}
          {canFullScreen && (
            <MediaButton label={isFullScreen ? 'Exit full screen (f)' : 'Full screen (f)'} onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </MediaButton>
          )}
        </div>
      </div>
    </div>
  );
};
