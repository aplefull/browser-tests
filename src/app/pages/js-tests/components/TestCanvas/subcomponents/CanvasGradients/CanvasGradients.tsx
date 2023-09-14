import { Canvas } from '@/app/components/Canvas/Canvas';
import { getCanvasDimensions } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import styles from './styles.module.scss';
import globalStyles from '../../styles.module.scss';
import classNames from 'classnames';

const gradientStops = [
  { stop: 0.0, color: 'rgb(167,20,235)' },
  { stop: 0.05, color: 'rgb(136,36,218)' },
  { stop: 0.1, color: 'rgb(108,53,202)' },
  { stop: 0.15, color: 'rgb(84,71,186)' },
  { stop: 0.2, color: 'rgb(64,90,171)' },
  { stop: 0.25, color: 'rgb(54,110,157)' },
  { stop: 0.3, color: 'rgb(57,130,143)' },
  { stop: 0.35, color: 'rgb(73,150,129)' },
  { stop: 0.4, color: 'rgb(102,169,114)' },
  { stop: 0.45, color: 'rgb(143,186,99)' },
  { stop: 0.5, color: 'rgb(191,199,85)' },
  { stop: 0.55, color: 'rgb(239,205,74)' },
  { stop: 0.6, color: 'rgb(247,188,76)' },
  { stop: 0.65, color: 'rgb(245,163,87)' },
  { stop: 0.7, color: 'rgb(240,136,104)' },
  { stop: 0.75, color: 'rgb(234,112,124)' },
  { stop: 0.8, color: 'rgb(227,92,146)' },
  { stop: 0.85, color: 'rgb(218,78,170)' },
  { stop: 0.9, color: 'rgb(205,72,194)' },
  { stop: 0.95, color: 'rgb(186,74,215)' },
  { stop: 1.0, color: 'rgb(160,85,232)' },
];

const drawGradient = async (ctx: CanvasRenderingContext2D, gradient: CanvasGradient) => {
  const { width, height } = getCanvasDimensions(ctx);

  for (const stop of gradientStops) {
    gradient.addColorStop(stop.stop, stop.color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
};

export const drawLinearGradient = async (ctx: CanvasRenderingContext2D) => {
  const { width, height } = getCanvasDimensions(ctx);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  await drawGradient(ctx, gradient);
};

export const drawRadialGradient = async (ctx: CanvasRenderingContext2D) => {
  const { width, height } = getCanvasDimensions(ctx);

  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
  await drawGradient(ctx, gradient);
};

export const drawConicGradient = async (ctx: CanvasRenderingContext2D) => {
  const { width, height } = getCanvasDimensions(ctx);

  const gradient = ctx.createConicGradient(0, width / 2, height / 2);
  await drawGradient(ctx, gradient);
};

export const CanvasGradients = () => {
  return (
    <div className={classNames(styles.gradients, globalStyles.gridLayout)}>
      <Canvas onResize={drawLinearGradient} />
      <Canvas onResize={drawRadialGradient} />
      <Canvas onResize={drawConicGradient} />
    </div>
  );
};
