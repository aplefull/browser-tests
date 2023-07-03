export const MaskSvg = () => {
  const width = 800;
  const height = 300;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <rect width="100%" height="100%" fill="blue" />

      <mask id="gradient-mask">
        <linearGradient id="mask-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <rect width="100%" height="100%" fill="url(#mask-gradient)" />
      </mask>

      <rect width="400" height="150" fill="red" mask="url(#gradient-mask)" />
    </svg>
  );
};
