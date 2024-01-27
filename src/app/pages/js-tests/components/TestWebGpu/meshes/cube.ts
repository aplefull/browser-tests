const positions = [
  [1, -1, 1],
  [-1, -1, 1],
  [-1, -1, -1],
  [1, -1, -1],
  [1, -1, 1],
  [-1, -1, -1],
  [1, 1, 1],
  [1, -1, 1],
  [1, -1, -1],
  [1, 1, -1],
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, 1],
  [1, 1, 1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, 1, 1],
  [1, 1, -1],
  [-1, -1, 1],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, -1],
  [-1, -1, 1],
  [-1, 1, -1],
  [1, 1, 1],
  [-1, 1, 1],
  [-1, -1, 1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [1, -1, -1],
  [-1, -1, -1],
  [-1, 1, -1],
  [1, 1, -1],
  [1, -1, -1],
  [-1, 1, -1],
];
const uvs = [
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 1],
  [1, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 1],
  [1, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 1],
  [1, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 1],
  [1, 0],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, 0],
  [0, 0],
  [0, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [0, 0],
  [0, 1],
  [1, 0],
];

export const createCubeMesh = (size: number = 1) => {
  const vertices = [];

  for (let i = 0; i < positions.length; i++) {
    positions[i][0] *= size;
    positions[i][1] *= size;
    positions[i][2] *= size;

    vertices.push(...[...positions[i], 1], ...[1, 1, 1, 1], ...uvs[i]);
  }

  return {
    vertices: new Float32Array(vertices),
    offsets: {
      arrayStride: 4 * 10,
      position: 0,
      uv: 4 * 8,
    },
  };
};