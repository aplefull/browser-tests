import styles from './styles.module.scss';
import { TextPathSvg } from '../subcomponents/TextPathSvg/TextPathSvg';
import { EmbeddedImageSvg } from '@/app/css-tests/components/subcomponents/EmbeddedImageSvg/EmbeddedImageSvg';
import { MaskSvg } from '@/app/css-tests/components/subcomponents/MaskSvg/MaskSvg';
import { ForeignObjectSvg } from '@/app/css-tests/components/subcomponents/ForeignObjectSvg/ForeignObjectSvg';
import { ComponentTransferSvg } from '@/app/css-tests/components/subcomponents/ComponentTransferSvg/ComponentTransferSvg';
import { AnimateMotionSvg } from '@/app/css-tests/components/subcomponents/AnimateMotionSvg/AnimateMotionSvg';
import { MixedFeaturesSvg } from '@/app/css-tests/components/subcomponents/MixedFeaturesSvg/MixedFeaturesSvg';
import { BlendSvg } from '@/app/css-tests/components/subcomponents/BlendSvg/BlendSvg';
import { FeTurbulenceSquigglyTestSvg } from '@/app/css-tests/components/subcomponents/FeTurbulenceSquigglyTestSvg/FeTurbulenceSquigglyTestSvg';
import { LightsSvg } from '@/app/css-tests/components/subcomponents/LightsSvg/LightsSvg';
import catsVideo from '@assets/videos/cats_h264.mp4';

/*
 * TODO cleanup:
 *  - move svgs to separate components
 *  - clean up styles
 *  - maybe map components
 *  - make h2's consistent
 * */
export default function TestSvgs() {
  return (
    <section className={styles.svgs}>
      <h1>Different svg features</h1>
      <div className={styles.svgsContainer}>
        <div>
          <h2>Text path</h2>
          <TextPathSvg />
        </div>
        <div>
          <h2>Embedded image</h2>
          <EmbeddedImageSvg />
        </div>
        <div>
          <h2>Mask</h2>
          <MaskSvg />
        </div>
        <div>
          <h2>Foreign object</h2>
          <ForeignObjectSvg />
        </div>
        <div>
          <h2>Good luck</h2>
          <FeTurbulenceSquigglyTestSvg />
          <svg width={500} height={500}>
            <filter id="noise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence baseFrequency="0.01 0.4" result="NOISE" numOctaves="2" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="NOISE"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="R"
              ></feDisplacementMap>
            </filter>

            {/*<image
              xlinkHref="/assets/images/flying-cat.jpg"
              x="0"
              y="0"
              width="100%"
              height="100%"
              filter="url(#noise)"
            ></image>*/}
            <foreignObject x="0" y="0" width="100%" height="100%" filter={'url(#noise)'}>
              <video controls width="100%" src={catsVideo} />
            </foreignObject>
          </svg>

          <LightsSvg />
        </div>
        <div>
          <h2>Component transfer</h2>
          <ComponentTransferSvg />
        </div>
        <div>
          <h2>Animate motion</h2>
          <AnimateMotionSvg />
        </div>
        <div>
          <h2>Clip-path and mask</h2>
          <MixedFeaturesSvg />
        </div>
        <div>
          <h2>Blend</h2>
          <BlendSvg />
        </div>
      </div>
    </section>
  );
}
