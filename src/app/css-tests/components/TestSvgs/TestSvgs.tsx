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
import { LightningsSvg } from '@/app/css-tests/components/subcomponents/LightsSvg/LightningsSvg';
import catsVideo from '@assets/videos/cats_h264.mp4';
import { SpotLightSvg } from '@/app/css-tests/components/subcomponents/SpotLightSvg/SpotLightSvg';
import { PointLightSvg } from '@/app/css-tests/components/subcomponents/PointLightSvg/PointLightSvg';
import { DistantLightSvg } from '@/app/css-tests/components/subcomponents/DistantLightSvg/DistantLightSvg';
import { NoiseSvg } from '@/app/css-tests/components/subcomponents/NoiseSvg/NoiseSvg';
import { useEffect, useState } from 'react';

/*
 * TODO cleanup:
 *  - move svgs to separate components
 *  - clean up styles
 *  - maybe map components
 *  - make h2's consistent
 * */
export default function TestSvgs() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const svgWidth = Math.min(windowWidth - 50, 800);

  useEffect(() => {
    const handleResize = (e) => {
      setWindowWidth(e.target.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className={styles.svgs}>
      <h1>Different svg features</h1>
      <div className={styles.svgsContainer}>
        <div>
          <h2>Text path</h2>
          <TextPathSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Embedded image</h2>
          <EmbeddedImageSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Mask</h2>
          <MaskSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Foreign object</h2>
          <ForeignObjectSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Squiggly filter</h2>
          <FeTurbulenceSquigglyTestSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Noise</h2>
          <NoiseSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>feDistantLight</h2>
          <DistantLightSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>fePointLight</h2>
          <PointLightSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>feSpotLight</h2>
          <SpotLightSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>feDiffuseLighting and feSpecularLighting</h2>
          <LightningsSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Component transfer</h2>
          <ComponentTransferSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Animate motion</h2>
          <AnimateMotionSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Clip-path and mask</h2>
          <MixedFeaturesSvg width={svgWidth} height={300} />
        </div>
        <div>
          <h2>Blend</h2>
          <p>Hover over rectangle to see what blend mode is used</p>
          <BlendSvg width={svgWidth} height={300} />
        </div>
      </div>
    </section>
  );
}
