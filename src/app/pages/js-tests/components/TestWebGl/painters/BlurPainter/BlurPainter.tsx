import { useEffect, useRef, useState } from 'react';
import styles from '../../styles.module.scss';
import { createProgram, loadTexture } from '../../utils.webgl';
import blurVertexShader from '../../shaders/blur.vert?raw';
import blurFragmentShader from '../../shaders/blur.frag?raw';
import catImage from '@assets/images/cats/cat-2.jpg';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';

export const BlurPainter = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blurRadius, setBlurRadius] = useState<number>(3);
  const blurRenderRef = useRef<((blurRadius: number) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    let currentProgram: WebGLProgram | null = null;
    let buffers: { [key: string]: WebGLBuffer | null } = {};

    const setupBlur = async () => {
      currentProgram = createProgram(gl, blurVertexShader, blurFragmentShader);
      if (!currentProgram) return;

      gl.useProgram(currentProgram);

      const vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]);

      buffers.vertex = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const texture = await loadTexture(gl, catImage);
      if (!texture) return;

      const positionLocation = gl.getAttribLocation(currentProgram, 'a_position');
      const textureLocation = gl.getUniformLocation(currentProgram, 'u_texture');
      const resolutionLocation = gl.getUniformLocation(currentProgram, 'u_resolution');
      const blurRadiusLocation = gl.getUniformLocation(currentProgram, 'u_blurRadius');

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textureLocation, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(blurRadiusLocation, blurRadius);

      const render = () => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      render();

      blurRenderRef.current = (currentBlurRadius: number) => {
        gl.uniform1f(blurRadiusLocation, currentBlurRadius);
        render();
      };
    };

    setupBlur();

    const observer = new ResizeObserver(async (entries) => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      await setupBlur();
    });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (blurRenderRef.current) {
      blurRenderRef.current(blurRadius);
    }
  }, [blurRadius]);

  return (
    <>
      <RangeInput min={0} max={10} value={blurRadius} onChange={setBlurRadius} step={0.1} label="Blur Radius" />
      <canvas className={styles.canvas} ref={canvasRef} />
    </>
  );
};
