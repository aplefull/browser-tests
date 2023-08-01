import styles from './styles.module.scss';
import { MikuArt } from '@/app/misc-tests/components/subcomponents/MikuArt/MikuArt';
import { CssVideo } from '@/app/misc-tests/components/subcomponents/CssVideo/CssVideo';

// TODO utils
const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

const Glow = ({ brightness }: { shadowRadius: number; brightness: number; opacity: number }) => {
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

export const TestMisc = () => {
  return (
    <section className={styles.misc}>
      <h1>Miscellaneous tests</h1>
      <h2>Glow effect</h2>
      <div className={styles.glow}>
        <Glow brightness={70} opacity={1} shadowRadius={2.7} />
        <GlowSVG />
      </div>
      <h2>CSS art</h2>
      <div>
        <MikuArt />
      </div>
      <h2>CSS video</h2>
      <div>
        <CssVideo />
      </div>
    </section>
  );
};
