import flyingCat from '@assets/images/flying-cat.webp';
import catGif from '@assets/images/cat-1.jpeg';

export const BlendSvg = () => {
  const width = 800;
  const height = 300;

  const blendingModes = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'hard-light',
    'color-burn',
    'soft-light',
    'difference',
    'exclusion',
  ];

  const images = [
    {
      x: 0,
      filter: 'fe-blend-screen',
      title: 'blend with crimson flood-fill using screen mode',
    },
    {
      x: width / 3,
      filter: 'fe-blend-multiply',
      title: 'blend with crimson flood-fill using multiply mode',
    },
    {
      x: (width / 3) * 2,
      filter: 'blend-square-multiply',
      title: 'blend between two images using multiply mode and some additional processing',
    },
  ];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <defs>
        <filter id="fe-blend-multiply" x="0" y="0" width="100%" height="100%">
          <feFlood result="floodFill" x="0" y="0" width="100%" height="100%" floodColor="crimson" floodOpacity="1" />
          <feBlend in="SourceGraphic" in2="floodFill" mode="multiply" />
        </filter>
        <filter id="fe-blend-screen" x="0" y="0" width="100%" height="100%">
          <feFlood result="floodFill" x="0" y="0" width="100%" height="100%" floodColor="crimson" floodOpacity="1" />
          <feBlend in="SourceGraphic" in2="floodFill" mode="screen" />
        </filter>
        <filter
          colorInterpolationFilters="sRGB"
          x="-1"
          y="-1"
          width="2"
          height="2"
          xlinkType="simple"
          xlinkActuate="onLoad"
          xlinkShow="other"
          id="blend-square-multiply"
        >
          <feImage
            preserveAspectRatio="xMidYMid slice"
            result="raw-photo"
            x="0"
            y="0"
            width="100%"
            height="100%"
            xlinkHref={catGif}
          />
          <feComposite result="photo-clip" in="raw-photo" in2="SourceGraphic" operator="in" />
          <feColorMatrix
            in="SourceGraphic"
            values="1 0 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0 0 .5 0"
            type="matrix"
            result="color-trans"
          />
          <feBlend mode="multiply" in="photo-clip" in2="color-trans" />
        </filter>
        {blendingModes.map((mode, index) => (
          <filter key={index} id={mode} x="0" y="0" width="100%" height="100%">
            <feImage
              preserveAspectRatio="xMidYMid slice"
              result="p-1"
              x="0"
              y="0"
              width="100%"
              height="100%"
              xlinkHref={catGif}
            />
            <feImage
              preserveAspectRatio="xMidYMid slice"
              result="p-2"
              x="0"
              y="0"
              width="100%"
              height="100%"
              xlinkHref={flyingCat}
            />
            <feComponentTransfer in="p-2" result="p-2">
              <feFuncA type="linear" slope="0.8" />
            </feComponentTransfer>
            <feBlend mode={mode} in="p-1" in2="p-2" />
          </filter>
        ))}
      </defs>

      {images.map((image, index) => (
        <g key={index}>
          <title>{image.title}</title>
          <image
            xlinkHref={flyingCat}
            x={image.x}
            y="0"
            width={width / 3}
            height={height / 4}
            style={{ filter: `url(#${image.filter})` }}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      ))}

      {blendingModes.map((mode, index) => {
        const currentCol = index % 4;
        const currentRow = Math.floor(index / 4);

        const rectX = currentCol * 200;
        const rectY = (currentRow * height) / 4 + height / 4;
        const rectWidth = width / 4;
        const rectHeight = height / 4;

        return (
          <g key={index}>
            <title>{mode}</title>
            <rect
              aria-label={mode}
              x={rectX}
              y={rectY}
              width={rectWidth}
              height={rectHeight}
              style={{ filter: `url(#${mode})` }}
            />
          </g>
        );
      })}
    </svg>
  );
};
