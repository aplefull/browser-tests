import { useEffect, useRef } from 'react';
import styles from '../../styles.module.scss';
import { m4, createSphereBuffers, createProgram, loadTexture, setupWebGLState } from '../../utils.webgl';
import sphereVertexShader from '../../shaders/sphere.vert?raw';
import sphereFragmentShader from '../../shaders/sphere.frag?raw';
import catImage from '@assets/images/cats/cat-2.jpg';

export const SpherePainter = () => {
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

    const setupSphere = async () => {
      currentProgram = createProgram(gl, sphereVertexShader, sphereFragmentShader);
      if (!currentProgram) return;

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      setupWebGLState(gl);

      const sphereBuffers = createSphereBuffers(gl, 1.0);

      const texture = await loadTexture(gl, catImage);
      if (!texture) return;

      gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers.position);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBuffers.indices);

      const positionAttribLocation = gl.getAttribLocation(currentProgram, 'vertPosition');
      const normalAttribLocation = gl.getAttribLocation(currentProgram, 'vertNormal');
      const texCoordAttribLocation = gl.getAttribLocation(currentProgram, 'vertTexCoord');

      const stride = 8 * Float32Array.BYTES_PER_ELEMENT;

      gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, stride, 0);
      gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
      gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(positionAttribLocation);
      gl.enableVertexAttribArray(normalAttribLocation);
      gl.enableVertexAttribArray(texCoordAttribLocation);

      gl.useProgram(currentProgram);

      const matWorldUniformLocation = gl.getUniformLocation(currentProgram, 'mWorld');
      const matViewUniformLocation = gl.getUniformLocation(currentProgram, 'mView');
      const matProjUniformLocation = gl.getUniformLocation(currentProgram, 'mProj');
      const textureUniformLocation = gl.getUniformLocation(currentProgram, 'u_texture');

      const worldMatrix = new Float32Array(16);
      const viewMatrix = new Float32Array(16);
      const projMatrix = new Float32Array(16);

      const identityResultWorld = m4.identity(worldMatrix);
      for (let i = 0; i < 16; i++) {
        worldMatrix[i] = identityResultWorld[i];
      }

      const viewMat = m4.lookAt([0, 0, -4], [0, 0, 0], [0, 1, 0]);
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

      const yRotationMatrix = new Float32Array(16);
      const identityMatrix = new Float32Array(16);
      const identityResult = m4.identity(identityMatrix);
      for (let i = 0; i < 16; i++) {
        identityMatrix[i] = identityResult[i];
      }

      const animate = (time: number) => {
        const angle = (time / 1000 / 15) * 2 * Math.PI;

        m4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);

        for (let i = 0; i < 16; i++) {
          worldMatrix[i] = yRotationMatrix[i];
        }

        gl.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, sphereBuffers.numElements, gl.UNSIGNED_SHORT, 0);

        animationRef.current = requestAnimationFrame(animate);
      };

      animate(0);
    };

    setupSphere();

    const observer = new ResizeObserver(async (entries) => {
      const { width, height } = entries[0].contentRect;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      cleanup();
      await setupSphere();
    });

    observer.observe(canvas);

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);

  return <canvas className={styles.canvas} ref={canvasRef} />;
};
