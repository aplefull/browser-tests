import cat from '@assets/images/cats/cat-2.jpg';
import catGif from '@assets/images/gifs/cat-vibing.gif';
import catsVideo from '@assets/videos/cats_vp8.webm';
import { TDimensions } from '@/types';

type TMixedFeaturesSvgProps = TDimensions & {
  useAnimatedImage: boolean;
};

export const MixedFeaturesSvg = ({ width, height, useAnimatedImage }: TMixedFeaturesSvgProps) => {
  const videoAspectRatio = 1.7777777778;
  const img = useAnimatedImage ? catGif : cat;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <defs>
        <clipPath id="clip-path">
          <circle cx={Math.min(height / 2, width / 4)} cy="50%" r={Math.min(height / 2, width / 4)} />
        </clipPath>

        <clipPath id="clip-path-2">
          <circle cx={Math.min(height / 2, width / 4)} cy={height / 2} r="50" />
        </clipPath>

        <pattern id="pattern" patternUnits="userSpaceOnUse" width="70" height="8" patternTransform="scale(2) rotate(0)">
          <rect x="0" y="0" width="100%" height="100%" fill="hsla(0,0%,100%,1)" />
          <path
            d="M-.02 22c8.373 0 11.938-4.695 16.32-9.662C20.785 7.258 25.728 2 35 2c9.272 0 14.215 5.258 18.7 10.338C58.082 17.305 61.647 22 70.02 22M-.02 14.002C8.353 14 11.918 9.306 16.3 4.339 20.785-.742 25.728-6 35-6 44.272-6 49.215-.742 53.7 4.339c4.382 4.967 7.947 9.661 16.32 9.664M70 6.004c-8.373-.001-11.918-4.698-16.3-9.665C49.215-8.742 44.272-14 35-14c-9.272 0-14.215 5.258-18.7 10.339C11.918 1.306 8.353 6-.02 6.002"
            strokeWidth="1"
            stroke="hsla(258.5,59.4%,59.4%,1)"
            fill="none"
          />
        </pattern>

        <radialGradient id="fade-radial-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0.1" stopColor="white" stopOpacity="0" />
          <stop offset="0.4" stopColor="white" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="white" stopOpacity="1" />
        </radialGradient>

        <mask id="fade" maskUnits="objectBoundingBox" x={0.5} y="0" width={2} height="1">
          <rect x={width / 2} width={width / 2} height={height} cx="0.5" cy="0.5" fill="url(#fade-radial-gradient)" />
        </mask>
      </defs>

      <rect width="50%" height="100%" transform="translate(0,0)" fill="url(#pattern)" clipPath={`url(#clip-path)`} />

      <foreignObject width={Math.min(height, width / 2)} height={height} clipPath={`url(#clip-path-2)`}>
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
          <video autoPlay muted loop style={{ width: '100%' }}>
            <source src={catsVideo} type="video/webm" />
          </video>
        </div>
      </foreignObject>
      <foreignObject x={width / 2} width={width / 2} height={height}>
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
          <img
            src={img}
            alt="cat vibing"
            style={{
              position: 'absolute',
              width: '100%',
              height: `${width / 2 / videoAspectRatio}px`,
              objectFit: 'cover',
              zIndex: -1,
            }}
          />
        </div>
      </foreignObject>
      <foreignObject x={width / 2} width={width / 2} height={height} mask="url(#fade)">
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
          <video controls autoPlay muted loop style={{ width: '100%' }}>
            <source src={catsVideo} type="video/webm" />
          </video>
        </div>
      </foreignObject>
    </svg>
  );
};
