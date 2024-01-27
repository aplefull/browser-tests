import styles from './styles.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize,
  Minimize,
  PictureInPictureOff,
  PictureInPictureOn,
  PlayerPause,
  PlayerPlay,
  Volume,
  VolumeOff,
} from 'tabler-icons-react';
import classNames from 'classnames';
import { calculateThumbPosition, clamp } from '@/utils/utils';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';

type TVideoProps = {
  src?: string;
  initialVolume?: number;
  style?: React.CSSProperties;
  className?: string;
  videoClassName?: string;
};

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const hoursString = hours ? `${hours.toString().padStart(2, '0')}:` : '';
  const minutesString = `${minutes.toString().padStart(2, '0')}:`;
  const secondsString = seconds.toString().padStart(2, '0');

  return `${hoursString}${minutesString}${secondsString}`;
};

export const Video = ({ src, style, initialVolume = 0.5, className, videoClassName }: TVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isInPicInPic, setIsInPicInPic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isControlsPanelVisible, setIsControlsPanelVisible] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(initialVolume);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarContainerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();
  const isCursorOverControlsRef = useRef(false);

  const play = async () => {
    await videoRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const toggleFullScreen = async () => {
    if (isFullScreen) {
      await document.exitFullscreen();
    } else {
      await containerRef.current?.requestFullscreen();
    }

    setIsFullScreen(!isFullScreen);
  };

  const togglePicInPic = async () => {
    if (isInPicInPic) {
      await document.exitPictureInPicture();
    } else {
      await videoRef.current?.requestPictureInPicture();
    }

    setIsInPicInPic(!isInPicInPic);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      //videoRef.current.volume = initialVolume;
    } else {
      //videoRef.current.volume = 0;
    }

    setIsMuted(!isMuted);
  };

  const startControlsTimeout = () => {
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isCursorOverControlsRef.current) return;

      setIsControlsPanelVisible(false);
    }, 2000);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    setCurrentTime(videoRef.current.currentTime);
  };

  const handleDurationChange = () => {
    if (!videoRef.current) return;

    setDuration(videoRef.current.duration);
  };

  const handleLoadStart = () => {
    if (!videoRef.current) return;

    videoRef.current.volume = initialVolume;
  };

  const handleVolumeSliderChange = (newVolume: number) => {
    if (!videoRef.current) return;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleVideoKeyDown = async (event: React.KeyboardEvent) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    switch (event.code) {
      case 'Space':
      case 'KeyK':
        event.preventDefault();
        await togglePlay();
        break;

      case 'KeyF':
        event.preventDefault();
        await toggleFullScreen();
        break;

      case 'KeyP':
        event.preventDefault();
        await togglePicInPic();
        break;

      case 'KeyM':
        event.preventDefault();
        toggleMute();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        videoElement.currentTime = Math.max(videoRef.current?.currentTime - 5, 0);
        break;

      case 'ArrowRight':
        event.preventDefault();
        videoElement.currentTime = Math.min(videoRef.current?.currentTime + 5, videoRef.current?.duration);
        break;

      case 'KeyJ':
        event.preventDefault();
        videoElement.currentTime = Math.max(videoRef.current?.currentTime - 10, 0);
        break;

      case 'KeyL':
        event.preventDefault();
        videoElement.currentTime = Math.min(videoRef.current?.currentTime + 10, videoRef.current?.duration);
        break;

      default:
        break;
    }
  };

  const handleProgressBarMouseDown = (event: React.MouseEvent) => {
    const progressBarContainer = progressBarContainerRef.current;
    const video = videoRef.current;

    if (!progressBarContainer || !video) return;

    document.body.style.userSelect = 'none';

    const { left, width } = progressBarContainer.getBoundingClientRect();

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX } = event;
      const progress = clamp((clientX - left) / width, 0, 1);
      const time = progress * video.duration;

      video.currentTime = time;
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
    const videoContainer = containerRef.current;
    const video = videoRef.current;
    if (!videoContainer || !video) return;

    videoContainer.addEventListener('fullscreenchange', () => {
      setIsFullScreen(document.fullscreenElement !== null);
    });

    video.addEventListener('enterpictureinpicture', () => {
      setIsInPicInPic(true);
    });

    video.addEventListener('leavepictureinpicture', () => {
      setIsInPicInPic(false);
    });
  }, []);

  useEffect(() => {
    startControlsTimeout();

    return () => {
      clearTimeout(hideControlsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      clearTimeout(hideControlsTimeoutRef.current);
      setIsControlsPanelVisible(true);
      return;
    }

    clearTimeout(hideControlsTimeoutRef.current);
    startControlsTimeout();
  }, [isPlaying]);

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
    <div
      className={classNames(styles.container, className)}
      ref={containerRef}
      onMouseMove={() => {
        setIsControlsPanelVisible(true);
        clearTimeout(hideControlsTimeoutRef.current);

        if (!isPlaying) return;

        startControlsTimeout();
      }}
    >
      <video
        className={classNames(styles.video, videoClassName)}
        style={style}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onLoadStart={handleLoadStart}
        onKeyDown={handleVideoKeyDown}
        onClick={togglePlay}
        onDoubleClick={toggleFullScreen}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        ref={videoRef}
        src={src}
        tabIndex={0}
      />
      <div
        className={classNames(styles.controls, {
          [styles.hidden]: !isControlsPanelVisible,
        })}
        onMouseEnter={() => (isCursorOverControlsRef.current = true)}
        onMouseLeave={() => (isCursorOverControlsRef.current = false)}
      >
        <div className={styles.buttons}>
          <div className={styles.buttonsGroup}>
            <button onClick={togglePlay} className={styles.buttonWithIcon}>
              {isPlaying ? <PlayerPause /> : <PlayerPlay />}
            </button>
            <div className={styles.time}>{`${formatTime(currentTime)} / ${formatTime(duration)}`}</div>
          </div>
          <div className={styles.buttonsGroup}>
            <div className={styles.volumeControl}>
              <button onClick={toggleMute} className={styles.buttonWithIcon}>
                {isMuted ? <VolumeOff /> : <Volume />}
              </button>
              <RangeInput
                className={styles.volumeSlider}
                value={volume}
                onChange={handleVolumeSliderChange}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
            <button onClick={toggleFullScreen} className={styles.buttonWithIcon}>
              {isFullScreen ? <Minimize /> : <Maximize />}
            </button>
            <button onClick={togglePicInPic} className={styles.buttonWithIcon}>
              {isInPicInPic ? <PictureInPictureOff /> : <PictureInPictureOn />}
            </button>
          </div>
        </div>
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
      </div>
    </div>
  );
};
