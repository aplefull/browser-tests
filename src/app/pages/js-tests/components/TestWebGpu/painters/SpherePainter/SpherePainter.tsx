import { useEffect, useRef } from 'react';
import styles from '@/app/pages/js-tests/components/TestWebGpu/styles.module.scss';
import sphereSceneWorker from '../../workers/worker?script';
import { getImageBitmap } from '@utils';
import catImage from '@assets/images/cats/cat-2.jpg';

export const SpherePainter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const init = async () => {
      const worker = new Worker(sphereSceneWorker, { type: 'module' });

      const offScreenCanvas = canvas.transferControlToOffscreen();
      offScreenCanvas.width = canvas.clientWidth;
      offScreenCanvas.height = canvas.clientHeight;

      const imageBitmap = await getImageBitmap(catImage);
      worker.postMessage({ type: 'start', canvas: offScreenCanvas, bitmap: imageBitmap }, [
        offScreenCanvas,
        imageBitmap,
      ]);

      workerRef.current = worker;
    };

    init().catch(console.error);

    return () => {
      workerRef.current?.postMessage({ type: 'stop' });
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
