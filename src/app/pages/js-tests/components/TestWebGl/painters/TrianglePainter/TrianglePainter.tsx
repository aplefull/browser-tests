import { useEffect, useRef } from 'react';
import styles from '../../styles.module.scss';
import { createProgram } from '../../utils.webgl';
import triangleVertexShader from '../../shaders/triangle.vert?raw';
import triangleFragmentShader from '../../shaders/triangle.frag?raw';

export const TrianglePainter = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    let currentProgram: WebGLProgram | null = null;
    let buffers: { [key: string]: WebGLBuffer | null } = {};

    const cleanup = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const setupTriangle = () => {
      currentProgram = createProgram(gl, triangleVertexShader, triangleFragmentShader);
      if (!currentProgram) return;

      gl.useProgram(currentProgram);

      const vertices = new Float32Array([
        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 1.0, 1.0, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
      ]);

      buffers.vertex = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(currentProgram, 'a_position');
      const colorLocation = gl.getAttribLocation(currentProgram, 'a_color');

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 6 * 4, 0);

      gl.enableVertexAttribArray(colorLocation);
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 6 * 4, 2 * 4);

      const animate = () => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setupTriangle();

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      cleanup();
      setupTriangle();
    });

    observer.observe(canvas);

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);

  return <canvas className={styles.canvas} ref={canvasRef} />;
};
