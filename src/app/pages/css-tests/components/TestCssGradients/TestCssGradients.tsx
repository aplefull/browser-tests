import styles from './styles.module.scss';

export const TestCssGradients = () => {
  return (
    <div className={styles.gradients}>
      <div>
        <p>Gradient mesh</p>
        <div className={styles.gradientMesh} />
      </div>
      <div>
        <p>Gradient 1</p>
        <div className={styles.gradient1} />
      </div>
      <div>
        <p>Gradient 2</p>
        <div className={styles.gradient2} />
      </div>
      <div>
        <p>Gradient 3</p>
        <div className={styles.gradient3} />
      </div>
      <div>
        <p>SVG gradient</p>
        <div className={styles.svgGradient}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <filter id="a" width="120%" height="120%" x="-10%" y="-10%">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="40" />
              </filter>
            </defs>
            <g filter="url(#a)">
              <circle cx="82.22%" cy="68.2%" r="49.259259259259%" fill="color(prophoto-rgb 0.42 0.17 0.92)" />
              <circle cx="36.29%" cy="62.65%" r="49.259259259259%" fill="#60F" />
              <circle cx="57.77%" cy="17.28%" r="49.259259259259%" fill="#0C9" />
              <circle cx="21.11%" cy="90.12%" r="49.259259259259%" fill="#0C9" />
              <circle cx="6.85%" cy="23.14%" r="49.259259259259%" fill="color(prophoto-rgb 0.42 0.17 0.92)" />
              <circle cx="68.14%" cy="87.96%" r="49.259259259259%" fill="oklab(0.75 -0.15 0.03)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
