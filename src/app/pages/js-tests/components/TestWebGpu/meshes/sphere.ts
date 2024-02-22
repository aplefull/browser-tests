import { range } from '@utils';
import { vec3 } from '@/app/pages/js-tests/components/TestWebGpu/utils.webgpu';

export const createSphereMesh = (radius: number, widthSegments = 32, heightSegments = 16) => {
  const vertices = [];
  const firstVertex = vec3.create();

  // Generate vertices. Each vertex is [ x, y, z, normalX, normalY, normalZ, u, v ]
  // i = height, j = width
  for (let i = 0; i <= heightSegments; i++) {
    const currentVertexPosition = vec3.create();
    const currentVertexNormal = vec3.create();
    const currentVertexUv = [0, i / heightSegments];

    const isTopPole = i === 0;
    const isBottomPole = i === heightSegments;

    for (let j = 0; j <= widthSegments; j++) {
      const u = j / widthSegments;
      const v = i / heightSegments;

      if (j === widthSegments) {
        vec3.copy(firstVertex, currentVertexPosition);
      } else if (j == 0 || (!isTopPole && !isBottomPole)) {
        currentVertexPosition[0] = -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);
        currentVertexPosition[1] = radius * Math.cos(v * Math.PI);
        currentVertexPosition[2] = radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);

        if (j == 0) {
          vec3.copy(currentVertexPosition, firstVertex);
        }
      }

      vec3.copy(currentVertexPosition, currentVertexNormal);
      vec3.normalize(currentVertexNormal, currentVertexNormal);

      currentVertexUv[0] = u + (isTopPole ? 0.5 / widthSegments : isBottomPole ? -0.5 / widthSegments : 0);
      currentVertexUv[1] = 1 - v;

      vertices.push(...[...currentVertexPosition, ...currentVertexNormal, ...currentVertexUv]);
    }
  }

  // Generate indices
  const indices = [];
  const rawRange = range(0, (widthSegments + 1) * (heightSegments + 1) - 1);

  const ranges = [];
  for (let i = 0; i < rawRange.length; i += widthSegments + 1) {
    ranges.push(rawRange.slice(i, i + widthSegments + 1));
  }

  // i = height, j = width
  for (let i = 0; i < heightSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const nextHorizontal = j + 1;
      const nextVertical = i + 1;

      // Turn quads into triangles
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
    offsets: {
      arrayStride: 8 * 4,
      position: 0,
      normal: 3 * 4,
      uv: 6 * 4,
    },
  };
};
