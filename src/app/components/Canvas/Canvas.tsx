import { ForwardedRef, forwardRef, MutableRefObject, useEffect, useRef } from 'react';
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

    if (typeof ref === 'function') return null;

    useEffect(() => {
      const canvas = ref?.current ?? canvasRef.current;
      if (!canvas || isStatic) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      if (onResize) onResize(ctx);

      const observer = new ResizeObserver(() => {
        ctx.canvas.width = canvas.clientWidth;
        ctx.canvas.height = canvas.clientHeight;

        if (onResize) onResize(ctx);
      });

      observer.observe(canvas);

      return () => observer.disconnect();
    }, [onResize, isStatic]);

    useEffect(() => {
      const canvas = ref?.current ?? canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      if (onMount) onMount(ctx);
    }, [onMount]);

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
