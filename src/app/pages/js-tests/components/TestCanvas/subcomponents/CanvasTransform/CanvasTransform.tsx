import { Canvas } from '@/app/components/Canvas/Canvas';
import { bg } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { useState } from 'react';
import { map } from '@/utils/utils';
import styles from './styles.module.scss';
import globalStyles from '../../styles.module.scss';
import { GRADIENT_STOPS } from '@/utils/constants';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import classNames from 'classnames';

const drawGradient = (ctx: CanvasRenderingContext2D, gradientSize: number) => {
  const gradient = ctx.createLinearGradient(0, 0, gradientSize, gradientSize);

  GRADIENT_STOPS.forEach(({ stop, color }) => gradient.addColorStop(stop, color));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, gradientSize, gradientSize);
};

const drawTransform = (translate: { x: number; y: number }, rotate: number) => (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas;

  const shapeSize = 100;

  const angle = rotate === 360 ? Infinity : (rotate * Math.PI) / 180;
  const translateX = map(translate.x, -100, 100, 0, width - shapeSize);
  const translateY = map(translate.y, -100, 100, 0, height - shapeSize);

  bg(ctx);

  ctx.save();
  ctx.translate(translateX, translateY);
  ctx.translate(shapeSize / 2, shapeSize / 2);
  ctx.rotate(angle);
  ctx.translate(-shapeSize / 2, -shapeSize / 2);
  drawGradient(ctx, shapeSize);
  ctx.restore();
};

export const CanvasTransform = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(360);

  const setX = (x: number) => setTranslate({ ...translate, x });
  const setY = (y: number) => setTranslate({ ...translate, y });
  const setRotation = (rotate: number) => setRotate(rotate);

  return (
    <div className={classNames(styles.canvasTransform, globalStyles.gridLayout)}>
      <div>
        <Canvas onResize={drawTransform(translate, rotate)} />
        <div className={styles.controls}>
          <RangeInput label="X" value={translate.x} min={-100} max={100} onChange={setX} />
          <RangeInput label="Y" value={translate.y} min={-100} max={100} onChange={setY} />
          <RangeInput label="Rotation" value={rotate} min={0} max={360} onChange={setRotation} />
        </div>
      </div>
    </div>
  );
};
