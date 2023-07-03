import catGif from '@assets/images/cat-vibing.gif';

export const ComponentTransferSvg = () => {
  const width = 800;
  const height = 300;

  const images = [
    {
      x: 0,
      y: 0,
      filter: 'identity',
    },
    {
      x: width / 3,
      y: 0,
      filter: 'table',
    },
    {
      x: (width / 3) * 2,
      y: 0,
      filter: 'discrete',
    },
    {
      x: 0,
      y: height / 2,
      filter: 'linear',
    },
    {
      x: width / 3,
      y: height / 2,
      filter: 'gamma',
    },
  ];

  const spans = [
    {
      x: (width / 3) * 2,
      filter: 'identity',
    },
    {
      x: (width / 3) * 2,
      filter: 'table',
    },
    {
      x: (width / 3) * 2,
      filter: 'discrete',
    },
    {
      x: (width / 3) * 2,
      filter: 'linear',
    },
    {
      x: (width / 3) * 2,
      filter: 'gamma',
    },
  ];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <filter id="component-transfer-filter">
        <filter id="identity" x="0" y="0" width="100%" height="100%">
          <feComponentTransfer>
            <feFuncR type="identity"></feFuncR>
            <feFuncG type="identity"></feFuncG>
            <feFuncB type="identity"></feFuncB>
            <feFuncA type="identity"></feFuncA>
          </feComponentTransfer>
        </filter>
        <filter id="table" x="0" y="0" width="100%" height="100%">
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0 0 1 1"></feFuncR>
            <feFuncG type="table" tableValues="1 1 0 0"></feFuncG>
            <feFuncB type="table" tableValues="0 1 1 0"></feFuncB>
          </feComponentTransfer>
        </filter>
        <filter id="discrete" x="0" y="0" width="100%" height="100%">
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0 1 1"></feFuncR>
            <feFuncG type="discrete" tableValues="1 1 0 0"></feFuncG>
            <feFuncB type="discrete" tableValues="0 1 1 0"></feFuncB>
          </feComponentTransfer>
        </filter>
        <filter id="linear" x="0" y="0" width="100%" height="100%">
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.5" intercept="0"></feFuncR>
            <feFuncG type="linear" slope="0.5" intercept="0.25"></feFuncG>
            <feFuncB type="linear" slope="0.5" intercept="0.5"></feFuncB>
          </feComponentTransfer>
        </filter>
        <filter id="gamma" x="0" y="0" width="100%" height="100%">
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="4" exponent="7" offset="0"></feFuncR>
            <feFuncG type="gamma" amplitude="4" exponent="4" offset="0"></feFuncG>
            <feFuncB type="gamma" amplitude="4" exponent="1" offset="0"></feFuncB>
          </feComponentTransfer>
        </filter>
      </filter>

      {images.map((image, index) => (
        <image
          key={index}
          x={image.x}
          y={image.y}
          width={width / 3}
          height={height / 2}
          xlinkHref={catGif}
          filter={`url(#${image.filter})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ))}

      <text x={(width / 3) * 2} y={height / 2}>
        {spans.map((span, index) => (
          <tspan key={index} x={span.x + 10} dy="20" filter={`url(#${span.filter})`} stroke="aliceblue">
            {index + 1}. {span.filter}
          </tspan>
        ))}
      </text>
    </svg>
  );
};
