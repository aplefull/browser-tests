import styles from './styles.module.scss';
import { CanvasShapes } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasShapes/CanvasShapes';
import { CanvasText } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasText/CanvasText';
import { CanvasGradients } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasGradients/CanvasGradients';
import { CanvasClip } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasClip/CanvasClip';
import { CanvasTransform } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasTransform/CanvasTransform';
import { CanvasImage } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasImage/CanvasImage';
import { CanvasCompositing } from '@/app/pages/js-tests/components/TestCanvas/subcomponents/CanvasCompositing/CanvasCompositing';

export const TestCanvas = () => {
  return (
    <div className={styles.canvasContainer}>
      <h2>Shapes</h2>
      <CanvasShapes />
      <h2>Text</h2>
      <CanvasText />
      <h2>Gradients</h2>
      <CanvasGradients />
      <h2>Clip</h2>
      <CanvasClip />
      <h2>Transform</h2>
      <CanvasTransform />
      <h2>Image</h2>
      <CanvasImage />
      <h2>Compositing</h2>
      <CanvasCompositing />
    </div>
  );
};
