import styles from './styles.module.scss';
import { useEffect, useRef } from 'react';
import triangleVertexShader from './shaders/triangle.vert?raw';
import triangleFragmentShader from './shaders/triangle.frag?raw';

const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

const paintTriangle = (gl: WebGL2RenderingContext) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, triangleVertexShader);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, triangleFragmentShader);

  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  if (!program) return;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  const vertices = new Float32Array([
    -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 0.5, 0.0, 0.0, 1.0, 1.0, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,
  ]);

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) return;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionAttributeLocation: number = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);

  const colorAttributeLocation: number = gl.getAttribLocation(program, 'a_color');
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(
    colorAttributeLocation,
    4,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT,
  );

  const frame = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return requestAnimationFrame(frame);
  };

  frame();
};

export const TestWebGl = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    paintTriangle(gl);

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;

      gl.viewport(0, 0, width, height);
    });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};
