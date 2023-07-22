import catsVideo from '@assets/videos/cats_h264.mp4';
import bgImage from '@assets/images/cat-2.jpg';

export const NoiseSvg = ({ width, height }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <filter id="noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence baseFrequency="0.01 0.4" result="noise" numOctaves="2" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="R"
        ></feDisplacementMap>
      </filter>

      <foreignObject x="0" y="0" width="100%" height="100%" filter="url(#noise)">
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: '100px',
          }}
        >
          <video controls width="100%" height="100% " src={catsVideo} />
        </div>
      </foreignObject>
    </svg>
  );
};
