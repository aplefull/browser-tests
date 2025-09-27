export const m4 = {
  perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    const rangeInv = 1.0 / (near - far);

    return new Float32Array([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ]);
  },

  translation(tx: number, ty: number, tz: number) {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
  },

  xRotation(angleInRadians: number) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  },

  yRotation(angleInRadians: number) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  },

  zRotation(angleInRadians: number) {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  },

  multiply(a: Float32Array, b: Float32Array) {
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] = 0;
        for (let k = 0; k < 4; k++) {
          result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
        }
      }
    }

    return result;
  },

  identity(out?: Float32Array) {
    const result = out || new Float32Array(16);
    result[0] = 1;
    result[1] = 0;
    result[2] = 0;
    result[3] = 0;
    result[4] = 0;
    result[5] = 1;
    result[6] = 0;
    result[7] = 0;
    result[8] = 0;
    result[9] = 0;
    result[10] = 1;
    result[11] = 0;
    result[12] = 0;
    result[13] = 0;
    result[14] = 0;
    result[15] = 1;
    return result;
  },

  lookAt(eye: number[], target: number[], up: number[]) {
    const zAxis = [eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]];
    const zLen = Math.sqrt(zAxis[0] * zAxis[0] + zAxis[1] * zAxis[1] + zAxis[2] * zAxis[2]);
    zAxis[0] /= zLen;
    zAxis[1] /= zLen;
    zAxis[2] /= zLen;

    const xAxis = [
      up[1] * zAxis[2] - up[2] * zAxis[1],
      up[2] * zAxis[0] - up[0] * zAxis[2],
      up[0] * zAxis[1] - up[1] * zAxis[0],
    ];
    const xLen = Math.sqrt(xAxis[0] * xAxis[0] + xAxis[1] * xAxis[1] + xAxis[2] * xAxis[2]);
    xAxis[0] /= xLen;
    xAxis[1] /= xLen;
    xAxis[2] /= xLen;

    const yAxis = [
      zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1],
      zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2],
      zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0],
    ];

    return new Float32Array([
      xAxis[0],
      yAxis[0],
      zAxis[0],
      0,
      xAxis[1],
      yAxis[1],
      zAxis[1],
      0,
      xAxis[2],
      yAxis[2],
      zAxis[2],
      0,
      -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]),
      -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]),
      -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]),
      1,
    ]);
  },

  rotate(out: Float32Array, a: Float32Array, rad: number, axis: number[]) {
    const x = axis[0],
      y = axis[1],
      z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);

    if (len < 0.000001) return out;

    len = 1 / len;
    const nx = x * len;
    const ny = y * len;
    const nz = z * len;

    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;

    const b00 = nx * nx * t + c;
    const b01 = ny * nx * t + nz * s;
    const b02 = nz * nx * t - ny * s;
    const b10 = nx * ny * t - nz * s;
    const b11 = ny * ny * t + c;
    const b12 = nz * ny * t + nx * s;
    const b20 = nx * nz * t + ny * s;
    const b21 = ny * nz * t - nx * s;
    const b22 = nz * nz * t + c;

    const a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    const a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    return out;
  },
};

export function createCubeBuffers(gl: WebGL2RenderingContext) {
  const boxVertices = new Float32Array([
    -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -1.0, 0.5,
    0.5, 0.5, -1.0, 1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0, 0.75, 0.25, 0.5, 1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0,
    -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, -1.0, 1.0, 1.0, 0.0,
    0.15, -1.0, -1.0, 1.0, 1.0, 0.0, 0.15, -1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, -1.0,
    -1.0, 0.0, 1.0, 0.15, -1.0, -1.0, -1.0, 0.0, 1.0, 0.15, -1.0, 1.0, -1.0, 0.0, 1.0, 0.15, -1.0, -1.0, -1.0, 0.5, 0.5,
    1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
  ]);

  const boxIndices = new Uint16Array([
    0, 1, 2, 0, 2, 3, 5, 4, 6, 6, 4, 7, 8, 9, 10, 8, 10, 11, 13, 12, 14, 15, 14, 12, 16, 17, 18, 16, 18, 19, 21, 20, 22,
    22, 20, 23,
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, boxVertices, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, boxIndices, gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    numElements: boxIndices.length,
  };
}

export function createTexturedCubeBuffers(gl: WebGL2RenderingContext) {
  const positions = [
    -1.0, -1.0, 1.0, 0.0, 0.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 0.0, 1.0,

    -1.0, -1.0, -1.0, 1.0, 0.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 0.0, 1.0, 1.0, -1.0, -1.0, 0.0, 0.0,

    -1.0, 1.0, -1.0, 0.0, 1.0, -1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    -1.0, -1.0, -1.0, 0.0, 0.0, 1.0, -1.0, -1.0, 1.0, 0.0, 1.0, -1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 0.0, 1.0,

    1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, -1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 0.0, 1.0,

    -1.0, -1.0, -1.0, 1.0, 0.0, -1.0, -1.0, 1.0, 0.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
  ];

  const indices = [
    0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22,
    20, 22, 23,
  ];

  const vertexData = new Float32Array(positions);
  const indexData = new Uint16Array(indices);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    numElements: indexData.length,
  };
}

export function createSphereMesh(radius: number, widthSegments = 32, heightSegments = 16) {
  const vertices = [];
  const firstVertex = [0, 0, 0];

  for (let i = 0; i <= heightSegments; i++) {
    const currentVertexPosition = [0, 0, 0];
    const currentVertexNormal = [0, 0, 0];
    const currentVertexUv = [0, i / heightSegments];

    const isTopPole = i === 0;
    const isBottomPole = i === heightSegments;

    for (let j = 0; j <= widthSegments; j++) {
      const u = j / widthSegments;
      const v = i / heightSegments;

      if (j === widthSegments) {
        currentVertexPosition[0] = firstVertex[0];
        currentVertexPosition[1] = firstVertex[1];
        currentVertexPosition[2] = firstVertex[2];
      } else if (j == 0 || (!isTopPole && !isBottomPole)) {
        currentVertexPosition[0] = -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);
        currentVertexPosition[1] = radius * Math.cos(v * Math.PI);
        currentVertexPosition[2] = radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);

        if (j == 0) {
          firstVertex[0] = currentVertexPosition[0];
          firstVertex[1] = currentVertexPosition[1];
          firstVertex[2] = currentVertexPosition[2];
        }
      }

      const length = Math.sqrt(
        currentVertexPosition[0] * currentVertexPosition[0] +
          currentVertexPosition[1] * currentVertexPosition[1] +
          currentVertexPosition[2] * currentVertexPosition[2],
      );
      currentVertexNormal[0] = currentVertexPosition[0] / length;
      currentVertexNormal[1] = currentVertexPosition[1] / length;
      currentVertexNormal[2] = currentVertexPosition[2] / length;

      currentVertexUv[0] = u + (isTopPole ? 0.5 / widthSegments : isBottomPole ? -0.5 / widthSegments : 0);
      currentVertexUv[1] = v;

      vertices.push(
        currentVertexPosition[0],
        currentVertexPosition[1],
        currentVertexPosition[2],
        currentVertexNormal[0],
        currentVertexNormal[1],
        currentVertexNormal[2],
        currentVertexUv[0],
        currentVertexUv[1],
      );
    }
  }

  const indices = [];
  const ranges = [];
  for (let i = 0; i <= heightSegments; i++) {
    const row = [];
    for (let j = 0; j <= widthSegments; j++) {
      row.push(i * (widthSegments + 1) + j);
    }
    ranges.push(row);
  }

  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const nextHorizontal = j + 1;
      const nextVertical = i + 1;

      const firstTriangleFarPoint = ranges[i][nextHorizontal];
      const firstTriangleAdjacentPoint = ranges[i][j];
      const secondTriangleAdjacentPoint = ranges[nextVertical][j];
      const secondTriangleFarPoint = ranges[nextVertical][nextHorizontal];

      if (i !== 0) {
        indices.push(firstTriangleFarPoint, firstTriangleAdjacentPoint, secondTriangleFarPoint);
      }

      if (i !== heightSegments - 1) {
        indices.push(firstTriangleAdjacentPoint, secondTriangleAdjacentPoint, secondTriangleFarPoint);
      }
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
  };
}

export function createSphereBuffers(gl: WebGL2RenderingContext, radius: number = 1.0) {
  const sphere = createSphereMesh(radius);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sphere.vertices, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphere.indices, gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    numElements: sphere.indices.length,
  };
}

export const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export const createProgram = (gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) return null;

  return program;
};

export const loadTexture = async (gl: WebGL2RenderingContext, imageSrc: string): Promise<WebGLTexture | null> => {
  const texture = gl.createTexture();
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      resolve(texture);
    };
    image.onerror = () => reject(new Error('Failed to load texture'));
    image.src = imageSrc;
  });
};

export const setupWebGLState = (gl: WebGL2RenderingContext) => {
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
};
