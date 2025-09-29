import { useEffect, useRef } from 'react';
import styles from '../../styles.module.scss';
import { m4, createTexturedCubeBuffers, createProgram, loadTexture, setupWebGLState } from '../../utils.webgl';
import texturedVertexShader from '../../shaders/textured.vert?raw';
import texturedFragmentShader from '../../shaders/textured.frag?raw';
import catImage from '@assets/images/cats/cat-2.jpg';

export const CubePainter = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    let currentProgram: WebGLProgram | null = null;

    const cleanup = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const setupTexturedCube = async () => {
      currentProgram = createProgram(gl, texturedVertexShader, texturedFragmentShader);
      if (!currentProgram) return;

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      setupWebGLState(gl);

      const cubeBuffers = createTexturedCubeBuffers(gl);

      const texture = await loadTexture(gl, catImage);
      if (!texture) return;

      gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffers.position);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffers.indices);

      const positionAttribLocation = gl.getAttribLocation(currentProgram, 'vertPosition');
      const texCoordAttribLocation = gl.getAttribLocation(currentProgram, 'vertTexCoord');

      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
      gl.vertexAttribPointer(
        texCoordAttribLocation,
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT,
      );
      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(texCoordAttribLocation);

      gl.useProgram(currentProgram);

      const matWorldUniformLocation = gl.getUniformLocation(currentProgram, 'mWorld');
      const matViewUniformLocation = gl.getUniformLocation(currentProgram, 'mView');
      const matProjUniformLocation = gl.getUniformLocation(currentProgram, 'mProj');
      const textureUniformLocation = gl.getUniformLocation(currentProgram, 'u_texture');

      const worldMatrix = new Float32Array(16);
      const viewMatrix = new Float32Array(16);
      const projMatrix = new Float32Array(16);

      const identityResult = m4.identity(worldMatrix);
      for (let i = 0; i < 16; i++) {
        worldMatrix[i] = identityResult[i];
      }
      const viewMat = m4.lookAt([0, 0, -8], [0, 0, 0], [0, 1, 0]);
      for (let i = 0; i < 16; i++) {
        viewMatrix[i] = viewMat[i];
      }
      const projMat = m4.perspective(Math.PI / 4, canvas.width / canvas.height, 0.1, 1000.0);
      for (let i = 0; i < 16; i++) {
        projMatrix[i] = projMat[i];
      }

      gl.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
      gl.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(textureUniformLocation, 0);

      const xRotationMatrix = new Float32Array(16);
      const yRotationMatrix = new Float32Array(16);
      const identityMatrix = new Float32Array(16);
      const identityResult2 = m4.identity(identityMatrix);
      for (let i = 0; i < 16; i++) {
        identityMatrix[i] = identityResult2[i];
      }

      const animate = (time: number) => {
        const angle = (time / 1000 / 6) * 2 * Math.PI;

        m4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        m4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        const newWorldMatrix = m4.multiply(yRotationMatrix, xRotationMatrix);
        for (let i = 0; i < 16; i++) {
          worldMatrix[i] = newWorldMatrix[i];
        }

        gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, cubeBuffers.numElements, gl.UNSIGNED_SHORT, 0);

        animationRef.current = requestAnimationFrame(animate);
      };

      animate(0);
    };

    setupTexturedCube();

    const observer = new ResizeObserver(async (entries) => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      cleanup();
      await setupTexturedCube();
    });

    observer.observe(canvas);

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);

  return <canvas className={styles.canvas} ref={canvasRef} />;
};
