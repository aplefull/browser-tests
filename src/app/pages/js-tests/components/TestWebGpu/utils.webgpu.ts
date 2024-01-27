import { mat4, vec3 } from 'wgpu-matrix';

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

export const createVertexBuffer = (gpu: GPUDevice, vertices: Float32Array) => {
  const buffer = gpu.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  new Float32Array(buffer.getMappedRange()).set(vertices);
  buffer.unmap();

  return buffer;
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
  vertices?: Float32Array | null,
  settings?: {
    usage?: GPUBufferUsageFlags;
    array: 'uint32' | 'float32';
    mappedAtCreation?: boolean;
    fillValue?: number;
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
  }

  if (arrayType === 'uint32') {
    new Uint32Array(buffer.getMappedRange())[0] = settings?.fillValue || 0;
    buffer.unmap();

    return buffer;
  }

  return buffer;
};

export const createIndexBuffer = (gpu: GPUDevice, indices: Uint16Array) => {
  const buffer = gpu.createBuffer({
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX,
    mappedAtCreation: true,
  });

  new Uint16Array(buffer.getMappedRange()).set(indices);
  buffer.unmap();

  return buffer;
};

export const createLinearSampler = (gpu: GPUDevice) => {
  return gpu.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
  });
};

// TODO figure out why this is reducing performance to atoms
export const renderCubeFrameWithTexture = (
  gpu: GPUDevice,
  context: GPUCanvasContext,
  texture: GPUTexture | null,
  depthTexture: GPUTexture | null,
  bindGroup: GPUBindGroup,
  pipeline: GPURenderPipeline,
  verticesBuffer: GPUBuffer,
  uniformBuffer: GPUBuffer,
) => {
  const canvasTexture = context.getCurrentTexture();

  texture = updateMultisampleTexture(gpu, texture, canvasTexture);
  depthTexture = updateMultisampleTexture(gpu, depthTexture, canvasTexture, 'depth24plus');

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
  // TODO pass 36 from above
  passEncoder.draw(36);
  passEncoder.end();
  gpu.queue.submit([commandEncoder.finish()]);
};
