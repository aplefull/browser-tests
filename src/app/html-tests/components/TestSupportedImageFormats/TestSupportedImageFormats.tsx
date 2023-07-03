import styles from './styles.module.scss';

export default function TestSupportedImageFormats() {
  return (
    <section className={styles.supportedImageFormats}>
      <h1>Supported image formats</h1>
      <div>
        <div>
          <img src="/assets/images/flying-cat.webp" alt="webp image" />
          <span>WebP</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.jpg" alt="jpg image" />
          <span>JPG</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.png" alt="png image" />
          <span>PNG</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.gif" alt="gif image" />
          <span>GIF</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.svg" alt="svg image" />
          <span>SVG</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.bmp" alt="bmp image" />
          <span>BMP</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.ico" alt="ico image" />
          <span>ICO</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.tiff" alt="tiff image" />
          <span>TIFF</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.avif" alt="avif image" />
          <span>AVIF</span>
        </div>
        <div>
          <img src="/assets/images/flying-cat.jfif" alt="jfif image" />
          <span>JFIF</span>
        </div>
      </div>
    </section>
  );
}
