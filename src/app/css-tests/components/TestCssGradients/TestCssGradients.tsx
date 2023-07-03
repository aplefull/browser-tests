import styles from './styles.module.scss';

export default function TestCssGradients() {
  return (
    <section className={styles.cssGradients}>
      <h1>Gradients</h1>
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
                  <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="86" />
                </filter>
              </defs>
              <g filter="url(#a)">
                <circle cx="444" cy="221" r="192" fill="#0C9" />
                <circle cx="196" cy="203" r="192" fill="#60F" />
                <circle cx="312" cy="56" r="192" fill="#0C9" />
                <circle cx="114" cy="292" r="192" fill="#0C9" />
                <circle cx="37" cy="75" r="192" fill="color(prophoto-rgb 0.42 0.17 0.92)" />
                <circle cx="368" cy="285" r="192" fill="oklab(0.75 -0.15 0.03)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
