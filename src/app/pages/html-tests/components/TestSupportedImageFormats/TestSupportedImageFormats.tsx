import styles from './styles.module.scss';
import flyingCatWebp from '@assets/images/flying_cat/flying-cat.webp';
import flyingCatJpg from '@assets/images/flying_cat/flying-cat.jpg';
import flyingCatPng from '@assets/images/flying_cat/flying-cat.png';
import flyingCatGif from '@assets/images/flying_cat/flying-cat.gif';
import flyingCatSvg from '@assets/images/flying_cat/flying-cat.svg';
import flyingCatBmp from '@assets/images/flying_cat/flying-cat.bmp';
import flyingCatIco from '@assets/images/flying_cat/flying-cat.ico';
import flyingCatTiff from '@assets/images/flying_cat/flying-cat.tiff';
import flyingCatAvif from '@assets/images/flying_cat/flying-cat.avif';
import flyingCatJfif from '@assets/images/flying_cat/flying-cat.jfif';

export const TestSupportedImageFormats = () => {
  return (
    <div className={styles.supportedImageFormats}>
      <div>
        <img src={flyingCatWebp} alt="webp image" />
        <span>WebP</span>
      </div>
      <div>
        <img src={flyingCatJpg} alt="jpg image" />
        <span>JPG</span>
      </div>
      <div>
        <img src={flyingCatPng} alt="png image" />
        <span>PNG</span>
      </div>
      <div>
        <img src={flyingCatGif} alt="gif image" />
        <span>GIF</span>
      </div>
      <div>
        <img src={flyingCatSvg} alt="svg image" />
        <span>SVG</span>
      </div>
      <div>
        <img src={flyingCatBmp} alt="bmp image" />
        <span>BMP</span>
      </div>
      <div>
        <img src={flyingCatIco} alt="ico image" />
        <span>ICO</span>
      </div>
      <div>
        <img src={flyingCatTiff} alt="tiff image" />
        <span>TIFF</span>
      </div>
      <div>
        <img src={flyingCatAvif} alt="avif image" />
        <span>AVIF</span>
      </div>
      <div>
        <img src={flyingCatJfif} alt="jfif image" />
        <span>JFIF</span>
      </div>
    </div>
  );
};
