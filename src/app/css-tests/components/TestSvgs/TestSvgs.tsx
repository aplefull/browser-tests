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
import { SpotLightSvg } from '@/app/css-tests/components/subcomponents/SpotLightSvg/SpotLightSvg';
import { PointLightSvg } from '@/app/css-tests/components/subcomponents/PointLightSvg/PointLightSvg';
import { DistantLightSvg } from '@/app/css-tests/components/subcomponents/DistantLightSvg/DistantLightSvg';
import { NoiseSvg } from '@/app/css-tests/components/subcomponents/NoiseSvg/NoiseSvg';
import { useEffect, useState } from 'react';
import { ConvolveMatrixSvg } from '@/app/css-tests/components/subcomponents/ConvolveMatrixSvg/ConvolveMatrixSvg';
import { MergeSvg } from '@/app/css-tests/components/subcomponents/MergeSvg/MergeSvg';
import { TilesSvg } from '@/app/css-tests/components/subcomponents/TilesSvg/TilesSvg';
import { MorphologySvg } from '@/app/css-tests/components/subcomponents/MorphologySvg/MorphologySvg';
import { DifficultAnimationSvg } from '@/app/css-tests/components/subcomponents/DifficultAnimationSvg/DifficultAnimationSvg';
import { Section } from '@/app/components/Section/Section';

/*
 * TODO cleanup:
 *  - move svgs to separate components
 *  - maybe map components
 * */
export const TestSvgs = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const svgWidth = Math.min(windowWidth - 80, 800);

  useEffect(() => {
    const handleResize = (e: UIEvent) => {
      if (!(e.target instanceof Window)) return;

      setWindowWidth(e.target.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const tests = [
    {
      title: 'Text path',
      description: null,
      component: TextPathSvg,
    },
    {
      title: 'Embedded image',
      description: null,
      component: EmbeddedImageSvg,
    },
    {
      title: 'Mask',
      description: null,
      component: MaskSvg,
    },
    {
      title: 'Foreign object',
      description: null,
      component: ForeignObjectSvg,
    },
    {
      title: 'Squiggly filter',
      description: null,
      component: FeTurbulenceSquigglyTestSvg,
    },
    {
      title: 'Noise',
      description: null,
      component: NoiseSvg,
    },
    {
      title: 'feDistantLight',
      description: null,
      component: DistantLightSvg,
    },
    {
      title: 'fePointLight',
      description: null,
      component: PointLightSvg,
    },
    {
      title: 'feSpotLight',
      description: null,
      component: SpotLightSvg,
    },
    {
      title: 'feDiffuseLighting and feSpecularLighting',
      description: null,
      component: LightningsSvg,
    },
    {
      title: 'Component transfer',
      description: null,
      component: ComponentTransferSvg,
    },
    {
      title: 'Animate motion',
      description: null,
      component: AnimateMotionSvg,
    },
    {
      title: 'Clip-path and mask',
      description: null,
      component: MixedFeaturesSvg,
    },
    {
      title: 'Blend',
      description: 'Hover over rectangle to see what blend mode is used',
      component: BlendSvg,
    },
    {
      title: 'Tiles',
      description: null,
      component: TilesSvg,
    },
    {
      title: 'Convolve matrix',
      description: null,
      component: ConvolveMatrixSvg,
    },
    {
      title: 'Merge',
      description: null,
      component: MergeSvg,
    },
    {
      title: 'Morphology',
      description: null,
      component: MorphologySvg,
    },
    {
      title: 'Difficult animation',
      description: null,
      component: DifficultAnimationSvg,
    },
  ];

  return (
    <Section className={styles.svgs} title="Different svg features" closedByDefault>
      <div className={styles.svgsContainer}>
        {tests.map((test, index) => {
          return (
            <div key={index}>
              <h2>{test.title}</h2>
              {test.description && <p>{test.description}</p>}
              <test.component width={svgWidth} height={300} />
            </div>
          );
        })}
      </div>
    </Section>
  );
};
