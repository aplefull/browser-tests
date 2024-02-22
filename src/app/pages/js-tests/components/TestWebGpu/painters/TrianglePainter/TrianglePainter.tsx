import styles from '@/app/pages/js-tests/components/TestWebGpu/styles.module.scss';
import { MutableRefObject, useEffect, useRef } from 'react';
import { configureContext, createPipeline } from '@/app/pages/js-tests/components/TestWebGpu/utils.webgpu';
import triangleShaders from '../../shaders/triangle.wgsl?raw';

type TTriangleProps = {
  gpu: GPUDevice;
};

const paintTriangle = (gpu: GPUDevice, context: GPUCanvasContext, ref: MutableRefObject<number | null>) => {
  configureContext(context, gpu);

  const pipeline = createPipeline(gpu, triangleShaders);

  const frame = () => {
    const commandEncoder = gpu.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3);
    passEncoder.end();

    gpu.queue.submit([commandEncoder.finish()]);
    ref.current = requestAnimationFrame(frame);
  };

  ref.current = requestAnimationFrame(frame);
};

export const TrianglePainter = ({ gpu }: TTriangleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('webgpu');

    if (!canvas || !ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const target = entries[0].target;

      if (!(target instanceof HTMLCanvasElement)) return;

      const width = target.clientWidth;
      const height = target.clientHeight;

      target.width = width;
      target.height = height;

      animationIdRef.current && cancelAnimationFrame(animationIdRef.current);
      paintTriangle(gpu, ctx, animationIdRef);
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      animationIdRef.current && cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
