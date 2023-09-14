import { Canvas } from '@/app/components/Canvas/Canvas';
import {
  COMPLEX_PATH,
  getCanvasDimensions,
  getShapeDimensions,
} from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { GRADIENT_STOPS } from '@/utils/constants';
import globalStyles from '../../styles.module.scss';
import styles from './styles.module.scss';
import classNames from 'classnames';

const clipPath = async (ctx: CanvasRenderingContext2D) => {
  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(ctx);

  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);

  GRADIENT_STOPS.forEach(({ stop, color }) => gradient.addColorStop(stop, color));

  const shape = new Path2D(COMPLEX_PATH);
  ctx.fillStyle = gradient;

  const { width: shapeWidth, height: shapeHeight } = getShapeDimensions(COMPLEX_PATH);

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const scale = Math.min(canvasWidth / shapeWidth, canvasHeight / shapeHeight) * 0.9;
  const newShapeHeight = shapeHeight * scale;
  const newShapeWidth = shapeWidth * scale;

  ctx.beginPath();
  ctx.translate(centerX - newShapeWidth / 2, centerY - newShapeHeight / 2);

  if (scale < 1) {
    ctx.scale(scale, scale);
  }

  ctx.clip(shape);

  if (scale < 1) {
    ctx.scale(1 / scale, 1 / scale);
  }

  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

export const CanvasClip = () => {
  return (
    <div className={classNames(globalStyles.gridLayout, styles.clip)}>
      <Canvas onResize={clipPath} />
    </div>
  );
};
