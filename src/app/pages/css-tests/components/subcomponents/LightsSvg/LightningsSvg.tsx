import { TDimensions } from '@/types';

export const LightningsSvg = ({ width, height }: TDimensions) => {
  return (
    <div>
      <svg width={width} height={height}>
        <filter id="diffuse-lighting" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="5" />

          <feDiffuseLighting in="noise" lightingColor="white" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
        <filter id="specular-lighting" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" result="noise" numOctaves="5" />

          <feSpecularLighting in="noise" lightingColor="white" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feSpecularLighting>
        </filter>

        <rect x="0" y="0" width="50%" height="100%" filter="url(#diffuse-lighting)" />
        <rect x="50%" y="0" width="50%" height="100%" filter="url(#specular-lighting)" />
      </svg>
    </div>
  );
};
