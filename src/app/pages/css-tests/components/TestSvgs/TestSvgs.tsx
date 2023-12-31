import styles from './styles.module.scss';
import { TextPathSvg } from '../subcomponents/TextPathSvg/TextPathSvg';
import { EmbeddedImageSvg } from '@/app/pages/css-tests/components/subcomponents/EmbeddedImageSvg/EmbeddedImageSvg';
import { MaskSvg } from '@/app/pages/css-tests/components/subcomponents/MaskSvg/MaskSvg';
import { ForeignObjectSvg } from '@/app/pages/css-tests/components/subcomponents/ForeignObjectSvg/ForeignObjectSvg';
import { ComponentTransferSvg } from '@/app/pages/css-tests/components/subcomponents/ComponentTransferSvg/ComponentTransferSvg';
import { AnimateMotionSvg } from '@/app/pages/css-tests/components/subcomponents/AnimateMotionSvg/AnimateMotionSvg';
import { MixedFeaturesSvg } from '@/app/pages/css-tests/components/subcomponents/MixedFeaturesSvg/MixedFeaturesSvg';
import { BlendSvg } from '@/app/pages/css-tests/components/subcomponents/BlendSvg/BlendSvg';
import { FeTurbulenceSquigglyTestSvg } from '@/app/pages/css-tests/components/subcomponents/FeTurbulenceSquigglyTestSvg/FeTurbulenceSquigglyTestSvg';
import { LightningsSvg } from '@/app/pages/css-tests/components/subcomponents/LightsSvg/LightningsSvg';
import { SpotLightSvg } from '@/app/pages/css-tests/components/subcomponents/SpotLightSvg/SpotLightSvg';
import { PointLightSvg } from '@/app/pages/css-tests/components/subcomponents/PointLightSvg/PointLightSvg';
import { DistantLightSvg } from '@/app/pages/css-tests/components/subcomponents/DistantLightSvg/DistantLightSvg';
import { NoiseSvg } from '@/app/pages/css-tests/components/subcomponents/NoiseSvg/NoiseSvg';
import { useEffect, useState } from 'react';
import { ConvolveMatrixSvg } from '@/app/pages/css-tests/components/subcomponents/ConvolveMatrixSvg/ConvolveMatrixSvg';
import { MergeSvg } from '@/app/pages/css-tests/components/subcomponents/MergeSvg/MergeSvg';
import { TilesSvg } from '@/app/pages/css-tests/components/subcomponents/TilesSvg/TilesSvg';
import { MorphologySvg } from '@/app/pages/css-tests/components/subcomponents/MorphologySvg/MorphologySvg';
import { DifficultAnimationSvg } from '@/app/pages/css-tests/components/subcomponents/DifficultAnimationSvg/DifficultAnimationSvg';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { UseSvg } from '@/app/pages/css-tests/components/subcomponents/UseSvg/UseSvg';
import { GlowSvg } from '@/app/pages/css-tests/components/subcomponents/GlowSvg/GlowSvg';

export const TestSvgs = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [useAnimateImages, setUseAnimateImages] = useState(false);
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
      title: 'Use',
      description: null,
      component: UseSvg,
    },
    {
      title: 'Glow effect',
      description: null,
      component: GlowSvg,
    },
    {
      title: 'Difficult animation',
      description: null,
      component: DifficultAnimationSvg,
    },
  ];

  return (
    <div className={styles.svgs}>
      <Checkbox checked={useAnimateImages} onChange={setUseAnimateImages} label="Use animated images" />
      <div className={styles.svgsContainer}>
        {tests.map((test, index) => {
          return (
            <div key={index}>
              <h2>{test.title}</h2>
              {test.description && <p>{test.description}</p>}
              <test.component width={svgWidth} height={300} useAnimatedImage={useAnimateImages} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
