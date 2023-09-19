import styles from './styles.module.scss';
import { MikuArt } from '@/app/pages/misc-tests/components/subcomponents/MikuArt/MikuArt';
import { CssVideo } from '@/app/pages/misc-tests/components/subcomponents/CssVideo/CssVideo';
import { map } from '@/utils/utils';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/Button/Button';
import { Select } from '@/app/components/Select/Select';
import dynamicResolutionWebmCrazy from '@assets/videos/cat.webm';
import dynamicResolutionWebmCalm from '@assets/videos/out_smooth.webm';
import transparentWebm from '@assets/videos/bad-apple-transparent.webm';
import longWebm from '@assets/videos/long.webm';
import webm1x1 from '@assets/videos/1x1.webm';
import webm1x600 from '@assets/videos/1x600.webm';
import webm600x1 from '@assets/videos/600x1.webm';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import classNames from 'classnames';
import { ColorPicker } from '@/app/components/ColorPicker/ColorPicker';

type TResolution = {
  width: number;
  height: number;
};

const Glow = ({ brightness }: { brightness: number }) => {
  const getRGBComponents = (color: string) => {
    const args = color.slice(4, -1).split(',');
    const [r, g, b] = args;

    return {
      r: parseInt(r),
      g: parseInt(g),
      b: parseInt(b),
    };
  };

  const getRGBString = (r: number, g: number, b: number) => {
    return `rgb(${r}, ${g}, ${b})`;
  };

  const setBrightness = (color: string, percent: number) => {
    const { r, g, b } = getRGBComponents(color);

    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;

    const newR = Math.round((t - r) * p) + r;
    const newG = Math.round((t - g) * p) + g;
    const newB = Math.round((t - b) * p) + b;

    return getRGBString(newR, newG, newB);
  };

  const getRadius = (start: number, i: number) => {
    return start * 2 ** i;
  };

  const glowComponents = [
    { color: 'rgb(255, 222, 255)', radius: 0 },
    { color: 'rgb(255, 222, 255)', radius: 1 },
    { color: 'rgb(255, 222, 255)', radius: 2 },
    { color: 'rgb(168, 61, 240)', radius: 3 },
    { color: 'rgb(168, 61, 240)', radius: 4 },
    { color: 'rgb(168, 61, 240)', radius: 5 },
  ];

  const shadowRadius = map(brightness, 0, 100, 0, 3.5);
  const opacity = map(brightness, 0, 100, 0, 1);

  const glow = glowComponents
    .map(({ color, radius }) => {
      const rgb = setBrightness(color, 0);
      const r = getRadius(shadowRadius, radius);

      return `drop-shadow(${rgb} 0px 0px ${r}px)`;
    })
    .join(' ');

  return (
    <div
      className={styles.glowDiv}
      style={{
        backgroundColor: `rgba(255, 222, 255, ${opacity})`,
        filter: `${glow}`,
      }}
    />
  );
};

const GlowSVG = () => {
  const width = 200;
  const height = 200;

  const rectWidth = width;
  const rectHeight = height;

  const viewBox = `-${width / 2} -${height / 2} ${width * 2} ${height * 2}`;

  const rectX = (width - rectWidth) / 2;
  const rectY = (height - rectHeight) / 2;

  return (
    <svg
      className={styles.glowSvg}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill="#FFDEFF"
    >
      <defs>
        <filter
          id="filter0_dddddd_1_3"
          x="-1039.6566"
          y="-1056.6566"
          width="3068.313"
          height="3068.313"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.18639" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.871403 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_3" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2.37278" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.871403 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="effect1_dropShadow_1_3" result="effect2_dropShadow_1_3" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="8.30472" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.871403 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="effect2_dropShadow_1_3" result="effect3_dropShadow_1_3" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="16.6094" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.658824 0 0 0 0 0.239216 0 0 0 0 0.941176 0 0 0 1 0" />
          <feBlend mode="normal" in2="effect3_dropShadow_1_3" result="effect4_dropShadow_1_3" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="28.4733" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.658824 0 0 0 0 0.239216 0 0 0 0 0.941176 0 0 0 1 0" />
          <feBlend mode="normal" in2="effect4_dropShadow_1_3" result="effect5_dropShadow_1_3" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="49.8283" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.658824 0 0 0 0 0.239216 0 0 0 0 0.941176 0 0 0 1 0" />
          <feBlend mode="normal" in2="effect5_dropShadow_1_3" result="effect6_dropShadow_1_3" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect6_dropShadow_1_3" result="shape" />
        </filter>
      </defs>

      <g filter="url(#filter0_dddddd_1_3)">
        <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} ry="10" fill="#FFDEFF" />
      </g>
    </svg>
  );
};

const webmOptions = [
  {
    label: 'Calm',
    value: dynamicResolutionWebmCalm,
  },
  {
    label: 'Crazy',
    value: dynamicResolutionWebmCrazy,
  },
];

const getVideoResolution = async (video: string) => {
  const videoElement = document.createElement('video');
  videoElement.src = video;
  videoElement.preload = 'metadata';

  return new Promise<TResolution>((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    };
  });
};

const DynamicResolutionVideos = () => {
  const [dynamicWebm, setDynamicWebm] = useState({
    label: 'Calm',
    value: dynamicResolutionWebmCalm,
  });
  const [resolution, setResolution] = useState<TResolution | null>(null);
  const [forcedVideoCurrentTime, setForcedVideoCurrentTime] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getAspectRatio = async () => {
      const resolution = await getVideoResolution(dynamicWebm.value);

      setResolution(resolution);

      if (videoRef3.current) {
        setContainerHeight((videoRef3.current?.clientWidth * resolution?.height) / resolution?.width);
      }
    };

    const handleResize = () => {
      if (videoRef3.current && resolution) {
        setContainerHeight((videoRef3.current?.clientWidth * resolution?.height) / resolution?.width);
      }
    };

    window.addEventListener('resize', handleResize);

    getAspectRatio().catch(console.error);

    return () => window.removeEventListener('resize', handleResize);
  }, [dynamicWebm]);

  const aspectRatioStyle = {
    aspectRatio: resolution ? `${resolution.width} / ${resolution.height}` : 'unset',
  };

  return (
    <>
      <div className={styles.dynamicResolution} style={{ height: Math.min(containerHeight, 700) }}>
        <video controls ref={videoRef1} src={dynamicWebm.value} />
        <video controls ref={videoRef2} src={dynamicWebm.value} />
        <video controls ref={videoRef3} src={dynamicWebm.value} style={aspectRatioStyle} />
      </div>
      <div className={styles.dynamicResolutionControls}>
        Video type:
        <div>
          <Select
            options={webmOptions}
            onChange={(_, option) => {
              setDynamicWebm(option);
            }}
            value={dynamicWebm.label}
          />
        </div>
        Control all videos:
        <RangeInput
          value={forcedVideoCurrentTime}
          min={0}
          max={100}
          onChange={(val: number) => {
            setForcedVideoCurrentTime(val);

            if (videoRef1.current && videoRef2.current && videoRef3.current) {
              const value1 = map(val, 0, 100, 0, videoRef1.current.duration);
              const value2 = map(val, 0, 100, 0, videoRef2.current.duration);
              const value3 = map(val, 0, 100, 0, videoRef3.current.duration);
              videoRef1.current.currentTime = value1;
              videoRef2.current.currentTime = value2;
              videoRef3.current.currentTime = value3;
            }
          }}
        />
      </div>
    </>
  );
};

const TransparentVideo = () => {
  const [shadow, setShadow] = useState(false);
  const [colorBurn, setColorBurn] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  const onLoadStart = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    video.volume = 0.2;
  };

  return (
    <div className={styles.transparency}>
      <div className={styles.videoContainer}>
        <video
          className={classNames({
            [styles.shadow]: shadow,
            [styles.colorBurn]: colorBurn,
          })}
          style={{ backgroundColor }}
          onLoadStart={onLoadStart}
          controls
          src={transparentWebm}
        />
        <span>It makes sense to use these checkboxes only with default background color.</span>
        <Checkbox checked={shadow} onChange={setShadow} label="Add shadow (looks cool)" />
        <Checkbox
          checked={colorBurn}
          onChange={setColorBurn}
          label="Add color burn (removes white outline, but makes controls barely visible)"
        />
        <div className={styles.colorControl}>
          <span>Pick a background color:</span>
          <ColorPicker onChange={setBackgroundColor} />
          <Button
            className={styles.resetColor}
            variant="dark"
            text="Reset color"
            onClick={() => setBackgroundColor('transparent')}
          />
        </div>
      </div>
    </div>
  );
};

const WeirdDimensionsVideos = () => {
  return (
    <div className={styles.weirdResolutions}>
      <div>
        <span>1x1</span>
        <video controls src={webm1x1} />
      </div>
      <div>
        <span>600x1</span>
        <video controls src={webm600x1} />
      </div>
      <div>
        <span>1x600</span>
        <video controls src={webm1x600} />
      </div>
    </div>
  );
};

export const TestMisc = () => {
  return (
    <div className={styles.misc}>
      <h2>Glow effect</h2>
      <div className={styles.glow}>
        <Glow brightness={50} />
        <GlowSVG />
      </div>
      <h2>CSS art</h2>
      <MikuArt />
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
