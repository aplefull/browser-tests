import { forwardRef, useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { assignRefs } from '@utils';

type TCanvasProps = {
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  isStatic?: boolean;
  onResize?: (ctx: CanvasRenderingContext2D) => void;
  onMount?: (ctx: CanvasRenderingContext2D) => void;
};

export const Canvas = forwardRef<HTMLCanvasElement, TCanvasProps>(
  ({ width, height, className, title, isStatic = false, onResize, onMount }, ref) => {
    const canvasRef = useRef(null);

    useEffect(() => {
      if (typeof ref === 'function') return;

      const canvas = ref?.current ?? canvasRef.current;
      if (!canvas || isStatic) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.canvas.width = canvas.clientWidth;
      ctx.canvas.height = canvas.clientHeight;

      if (ctx.canvas.width === 0 || ctx.canvas.height === 0) return;

      if (onResize) onResize(ctx);

      const observer = new ResizeObserver(() => {
        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight;

        if (ctx.canvas.width !== newWidth || ctx.canvas.height !== newHeight) {
          ctx.canvas.width = newWidth;
          ctx.canvas.height = newHeight;

          if (ctx.canvas.width === 0 || ctx.canvas.height === 0) return;

          if (onResize) onResize(ctx);
        }
      });

      observer.observe(canvas);

      return () => observer.disconnect();
    }, [onResize, isStatic]);

    useEffect(() => {
      if (typeof ref === 'function') return;

      const canvas = ref?.current ?? canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      if (onMount) onMount(ctx);
    }, [onMount]);

    if (typeof ref === 'function') return null;

    return (
      <canvas
        width={width}
        height={height}
        title={title}
        className={classNames(styles.canvas, className)}
        ref={assignRefs(ref, canvasRef)}
      />
    );
  },
);
