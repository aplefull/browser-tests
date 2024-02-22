type TCreatePipelineSettings = {
  vertexBuffers?: GPUVertexBufferLayout[];
  primitive?: boolean;
  depthStencil?: boolean;
  multisample?: boolean;
};

type TBindGroupSettings = {
  layoutIndex?: number;
  entries: (GPUTextureView | GPUExternalTexture | GPUSampler | { buffer: GPUBuffer })[];
  entriesStartIndex?: number;
};

type TBindGroupLayoutSettings = {
  entries: (
    | GPUBufferBindingType
    | {
        visibility: GPUShaderStageFlags;
        buffer: GPUBufferBindingLayout;
      }
  )[];
};

export const getGpuDevice = async () => {
  const adapter = await navigator.gpu.requestAdapter();
  return adapter?.requestDevice();
};

export const createPipeline = (gpu: GPUDevice, shadersUrl: string, settings?: TCreatePipelineSettings) => {
  const { vertexBuffers = [], primitive = false, depthStencil = false, multisample = false } = settings || {};
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  const shaderModule = gpu.createShaderModule({
    code: shadersUrl,
  });

  const targets = [
    {
      format: presentationFormat,
    },
  ];

  const pipeline: GPURenderPipelineDescriptor = {
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'v_main',
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'f_main',
      targets,
    },
    primitive: {
      topology: 'triangle-list',
    },
  };

  if (vertexBuffers.length) {
    pipeline.vertex.buffers = vertexBuffers;
  }

  if (primitive) {
    pipeline.primitive = {
      topology: 'triangle-list',
      cullMode: 'back',
    };
  }

  if (depthStencil) {
    pipeline.depthStencil = {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    };
  }

  if (multisample) {
    pipeline.multisample = {
      count: 4,
    };
  }

  return gpu.createRenderPipeline(pipeline);
};

export const configureContext = (context: GPUCanvasContext, gpu: GPUDevice) => {
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device: gpu,
    format: presentationFormat,
    alphaMode: 'premultiplied',
  });
};

export const updateMultisampleTexture = (
  gpu: GPUDevice,
  currentMultisampleTexture: GPUTexture | null,
  canvasTexture: GPUTexture,
  textureFormat?: GPUTextureFormat,
) => {
  if (
    !currentMultisampleTexture ||
    currentMultisampleTexture.width !== canvasTexture.width ||
    currentMultisampleTexture.height !== canvasTexture.height
  ) {
    if (currentMultisampleTexture) {
      currentMultisampleTexture.destroy();
    }

    return gpu.createTexture({
      format: textureFormat || canvasTexture.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      size: [canvasTexture.width, canvasTexture.height],
      sampleCount: 4,
    });
  }

  return currentMultisampleTexture;
};

export const getCubeTransformationMatrix = (context: GPUCanvasContext) => {
  const now = Date.now() / 1000;
  const aspectRatio = context.canvas.width / context.canvas.height;
  const modelViewProjectionMatrix = mat4.create();
  const viewMatrix = mat4.identity();
  const projectionMatrix = mat4.perspective((2 * Math.PI) / 5, aspectRatio, 1, 100.0);

  mat4.translate(viewMatrix, vec3.fromValues(0, 0, -4), viewMatrix);
  mat4.rotate(viewMatrix, vec3.fromValues(Math.sin(now), Math.cos(now), Math.sin(Math.cos(now))), 1, viewMatrix);
  mat4.multiply(projectionMatrix, viewMatrix, modelViewProjectionMatrix);

  return modelViewProjectionMatrix as Float32Array;
};

export const getSphereTransformationMatrix = (context: GPUCanvasContext) => {
  const now = Date.now() / 1000;
  const aspectRatio = context.canvas.width / context.canvas.height;
  const viewMatrix = mat4.identity();
  const modelViewProjectionMatrix = mat4.create();
  const projectionMatrix = mat4.perspective((2 * Math.PI) / 5, aspectRatio, 1, 100.0);

  mat4.translate(viewMatrix, vec3.fromValues(0, 0, -4), viewMatrix);
  mat4.rotateX(viewMatrix, Math.PI, viewMatrix);
  mat4.rotateY(viewMatrix, (-now * Math.PI) / 10, viewMatrix);
  mat4.multiply(projectionMatrix, viewMatrix, modelViewProjectionMatrix);

  return modelViewProjectionMatrix as Float32Array;
};

export const createBindGroup = (
  gpu: GPUDevice,
  pipeline: GPURenderPipeline | GPUComputePipeline,
  { layoutIndex = 0, entries = [], entriesStartIndex = 0 }: TBindGroupSettings,
) => {
  const groupEntries = entries.map((entry, index) => {
    return {
      binding: index + entriesStartIndex,
      resource: entry,
    };
  });

  return gpu.createBindGroup({
    layout: pipeline.getBindGroupLayout(layoutIndex),
    entries: groupEntries,
  });
};

export const createBindGroupLayout = (gpu: GPUDevice, { entries = [] }: TBindGroupLayoutSettings) => {
  return gpu.createBindGroupLayout({
    entries: entries.map((entry, index) => {
      if (typeof entry === 'string') {
        return {
          binding: index,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: entry,
          },
        };
      }

      return {
        binding: index,
        visibility: entry.visibility,
        buffer: entry.buffer,
      };
    }),
  });
};

export const createSimpleRenderPassDescriptor = (canvasTexture: GPUTexture): GPURenderPassDescriptor => {
  return {
    colorAttachments: [
      {
        view: canvasTexture.createView(),
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
      },
    ],
  };
};

export const createRenderPassDescriptor = (
  canvasTexture: GPUTexture,
  multisampleTexture: GPUTexture,
  depthTexture: GPUTexture,
): GPURenderPassDescriptor => {
  return {
    colorAttachments: [
      {
        view: multisampleTexture.createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: 'clear',
        storeOp: 'store',
        resolveTarget: canvasTexture.createView(),
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  };
};

export const createTexture = (gpu: GPUDevice, imageBitmap: ImageBitmap) => {
  const texture = gpu.createTexture({
    size: [imageBitmap.width, imageBitmap.height, 1],
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
  });

  gpu.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture }, [imageBitmap.width, imageBitmap.height]);

  return texture;
};

export const createEmptyTexture = (gpu: GPUDevice, width: number, height: number) => {
  return gpu.createTexture({
    size: {
      width,
      height,
    },
    format: 'rgba8unorm',
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING,
  });
};

export const createUniformBuffer = (
  gpu: GPUDevice,
  size: number,
  vertices?: Float32Array | Uint32Array | Int32Array | Uint16Array | null,
  settings?: {
    usage?: GPUBufferUsageFlags;
    array?: 'uint32' | 'float32' | 'int32' | 'uint16';
    mappedAtCreation?: boolean;
  },
) => {
  const buffer = gpu.createBuffer({
    size: size,
    usage: settings?.usage || GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: settings?.mappedAtCreation || !!vertices,
  });

  const arrayType = settings?.array || 'float32';

  if (vertices) {
    if (arrayType === 'float32') {
      new Float32Array(buffer.getMappedRange()).set(vertices);
      buffer.unmap();

      return buffer;
    }

    if (arrayType === 'int32') {
      new Int32Array(buffer.getMappedRange()).set(vertices);
      buffer.unmap();

      return buffer;
    }

    if (arrayType === 'uint32') {
      new Uint32Array(buffer.getMappedRange()).set(vertices);
      buffer.unmap();

      return buffer;
    }

    if (arrayType === 'uint16') {
      new Uint16Array(buffer.getMappedRange()).set(vertices);
      buffer.unmap();

      return buffer;
    }
  }

  return buffer;
};

export const createLinearSampler = (gpu: GPUDevice) => {
  return gpu.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
  });
};

export const renderCubeFrameWithTexture = (
  gpu: GPUDevice,
  context: GPUCanvasContext,
  texture: GPUTexture,
  depthTexture: GPUTexture,
  bindGroup: GPUBindGroup,
  pipeline: GPURenderPipeline,
  verticesBuffer: GPUBuffer,
  uniformBuffer: GPUBuffer,
  vertexCount: number,
) => {
  const canvasTexture = context.getCurrentTexture();
  const transformationMatrix = getCubeTransformationMatrix(context);

  gpu.queue.writeBuffer(
    uniformBuffer,
    0,
    transformationMatrix.buffer,
    transformationMatrix.byteOffset,
    transformationMatrix.byteLength,
  );

  const renderPassDescriptor = createRenderPassDescriptor(canvasTexture, texture, depthTexture);

  const commandEncoder = gpu.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.setVertexBuffer(0, verticesBuffer);
  passEncoder.draw(vertexCount);
  passEncoder.end();
  gpu.queue.submit([commandEncoder.finish()]);
};

export const createComputePipeline = (gpu: GPUDevice, shaders: string, bindGroupLayout?: GPUBindGroupLayout) => {
  return gpu.createComputePipeline({
    layout: bindGroupLayout
      ? gpu.createPipelineLayout({
          bindGroupLayouts: [bindGroupLayout],
        })
      : 'auto',
    compute: {
      module: gpu.createShaderModule({
        code: shaders,
      }),
      entryPoint: 'c_main',
    },
  });
};

export const mat4 = {
  create: () => {
    return new Float32Array(16);
  },
  identity: (out?: Float32Array) => {
    out = out || new Float32Array(16);

    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
  },
  perspective: (fov: number, aspect: number, near: number, far: number, out?: Float32Array) => {
    out = out || new Float32Array(16);

    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;

    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;

    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;

    return out;
  },
  rotate: (a: Float32Array, axis: Float32Array | number[], angle: number, out?: Float32Array) => {
    out = out || new Float32Array(16);

    const coords = { x: axis[0], y: axis[1], z: axis[2] };
    const len = Math.sqrt(coords.x * coords.x + coords.y * coords.y + coords.z * coords.z);

    coords.x = coords.x / len;
    coords.y = coords.y / len;
    coords.z = coords.z / len;

    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    s = Math.sin(angle);
    c = Math.cos(angle);
    t = 1 - c;

    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];

    const nx = coords.x;
    const ny = coords.y;
    const nz = coords.z;

    b00 = nx * nx * t + c;
    b01 = ny * nx * t + nz * s;
    b02 = nz * nx * t - ny * s;
    b10 = nx * ny * t - nz * s;
    b11 = ny * ny * t + c;
    b12 = nz * ny * t + nx * s;
    b20 = nx * nz * t + ny * s;
    b21 = ny * nz * t - nx * s;
    b22 = nz * nz * t + c;

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
  translate: (a: Float32Array, v: Float32Array | number[], out?: Float32Array) => {
    out = out || new Float32Array(16);

    const x = v[0];
    const y = v[1];
    const z = v[2];

    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;

    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;

    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];

    return out;
  },
  multiply: (a: Float32Array, b: Float32Array, out?: Float32Array) => {
    out = out || new Float32Array(16);

    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];

    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];

    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];

    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];

    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    return out;
  },
  rotateX: (a: Float32Array, angle: number, out?: Float32Array) => {
    out = out || new Float32Array(16);

    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];

    if (a !== out) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];

      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;

    return out;
  },
  rotateY: (a: Float32Array, angle: number, out?: Float32Array) => {
    out = out || new Float32Array(16);

    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];

    if (a !== out) {
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];

      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;

    return out;
  },
  rotateZ: (a: Float32Array, angle: number, out?: Float32Array) => {
    out = out || new Float32Array(16);

    const s = Math.sin(angle);
    const c = Math.cos(angle);

    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];

    if (a !== out) {
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];

      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }

    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;

    return out;
  },
};

export const vec3 = {
  create: () => {
    return new Float32Array(3);
  },
  fromValues: (x: number, y: number, z: number) => {
    const out = new Float32Array(3);

    out[0] = x;
    out[1] = y;
    out[2] = z;

    return out;
  },
  normalize: (a: Float32Array, out?: Float32Array) => {
    out = out || new Float32Array(3);

    const x = a[0];
    const y = a[1];
    const z = a[2];

    const len = Math.sqrt(x * x + y * y + z * z);

    if (len > 0) {
      out[0] = x / len;
      out[1] = y / len;
      out[2] = z / len;
    } else {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  },
  copy: (a: Float32Array, out?: Float32Array) => {
    out = out || new Float32Array(3);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];

    return out;
  },
};
