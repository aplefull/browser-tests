import catGif from '@assets/images/cat-vibing.gif';

export const EmbeddedImageSvg = () => {
  const width = 800;
  const height = 300;

  return (
    <svg width={width} height={height}>
      <defs>
        <clipPath id="circleView">
          <circle cx="400" cy="150" r="100" fill="#FFFFFF" />
        </clipPath>
      </defs>
      <image x="200" height="300" xlinkHref={catGif} clipPath="url(#circleView)" />
    </svg>
  );
};
