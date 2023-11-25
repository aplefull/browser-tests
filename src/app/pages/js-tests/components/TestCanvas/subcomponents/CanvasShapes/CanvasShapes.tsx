import {
  COMPLEX_PATH,
  getCanvasDimensions,
  getShapeDimensions,
} from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { Canvas } from '@/app/components/Canvas/Canvas';
import globalStyles from '../../styles.module.scss';

export const fillRect = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;
  const shapeSize = 100;

  ctx.fillStyle = '#8f44cc';
  ctx.fillRect(canvas.width / 2 - shapeSize / 2, canvas.height / 2 - shapeSize / 2, shapeSize, shapeSize);
};

export const strokeRect = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;
  const shapeSize = 100;

  ctx.strokeStyle = '#8f44cc';
  ctx.strokeRect(canvas.width / 2 - shapeSize / 2, canvas.height / 2 - shapeSize / 2, shapeSize, shapeSize);
};

const pointsToSvgPath = (
  startPoint: { x: number; y: number },
  points: { cp1x: number; cp1y: number; cp2x: number; cp2y: number; x: number; y: number }[],
) => {
  return points.reduce((acc, point, index) => {
    const { cp1x, cp1y, cp2x, cp2y, x, y } = point;
    const isEnd = index === points.length - 1;

    if (isEnd) {
      return `${acc} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y} Z`;
    }

    return `${acc} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y}`;
  }, `M ${startPoint.x} ${startPoint.y}`);
};

export const drawHeart = (ctx: CanvasRenderingContext2D) => {
  const startPoint = {
    x: 140,
    y: 20,
  };

  const points = [
    {
      cp1x: 73,
      cp1y: 20,
      cp2x: 20,
      cp2y: 74,
      x: 20,
      y: 140,
    },
    {
      cp1x: 20,
      cp1y: 275,
      cp2x: 156,
      cp2y: 310,
      x: 248,
      y: 443,
    },
    {
      cp1x: 336,
      cp1y: 311,
      cp2x: 477,
      cp2y: 270,
      x: 477,
      y: 140,
    },
    {
      cp1x: 477,
      cp1y: 74,
      cp2x: 423,
      cp2y: 20,
      x: 357,
      y: 20,
    },
    {
      cp1x: 309,
      cp1y: 20,
      cp2x: 267,
      cp2y: 48,
      x: 248,
      y: 89,
    },
    {
      cp1x: 229,
      cp1y: 48,
      cp2x: 188,
      cp2y: 20,
      x: 140,
      y: 20,
    },
  ];

  const { width: shapeWidth, height: shapeHeight } = getShapeDimensions(pointsToSvgPath(startPoint, points));
  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(ctx);

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const scale = Math.min(canvasWidth / shapeWidth, canvasHeight / shapeHeight) * 0.6;

  const newShapeHeight = shapeHeight * scale;
  const newShapeWidth = shapeWidth * scale;

  ctx.save();
  ctx.translate(centerX - newShapeWidth / 2, centerY - newShapeHeight / 2);

  ctx.fillStyle = '#8f44cc';

  if (scale < 1) {
    ctx.scale(scale, scale);
  }

  ctx.translate(-10, -10);

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  points.forEach(({ cp1x, cp1y, cp2x, cp2y, x, y }) => {
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  });
  ctx.fill();
  ctx.restore();
};

export const drawShape = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#8f44cc';
  const shape = new Path2D(COMPLEX_PATH);

  ctx.moveTo(0, 0);

  const { width: shapeWidth, height: shapeHeight } = getShapeDimensions(COMPLEX_PATH);
  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(ctx);

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const scale = Math.min(canvasWidth / shapeWidth, canvasHeight / shapeHeight) * 0.9;
  const newShapeHeight = shapeHeight * scale;
  const newShapeWidth = shapeWidth * scale;

  ctx.save();
  ctx.translate(centerX - newShapeWidth / 2, centerY - newShapeHeight / 2);

  if (scale < 1) {
    ctx.scale(scale, scale);
  }

  ctx.fill(shape);
  ctx.restore();
};

export const CanvasShapes = () => {
  return (
    <div className={globalStyles.gridLayout}>
      <Canvas onResize={fillRect} />
      <Canvas onResize={strokeRect} />
      <Canvas onResize={drawHeart} />
      <Canvas onResize={drawShape} />
    </div>
  );
};
