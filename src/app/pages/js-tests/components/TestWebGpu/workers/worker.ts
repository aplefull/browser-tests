import { createSphereMesh } from '../meshes/sphere';
import sphereShaders from '../shaders/sphere.wgsl?raw';
import {
  configureContext,
  createBindGroup,
  createLinearSampler,
  createPipeline,
  createRenderPassDescriptor,
  createTexture,
  createUniformBuffer,
  getGpuDevice,
  getSphereTransformationMatrix,
  mat4,
  updateMultisampleTexture,
} from '../utils.webgpu';

const ref: { current: 'start' | 'stop' } = { current: 'stop' };

const paintSphere = async (
  gpu: GPUDevice,
  context: GPUCanvasContext,
  ref: { current: 'start' | 'stop' },
  imageBitmap: ImageBitmap,
) => {
  configureContext(context, gpu);

  const sphere = createSphereMesh(2, 320, 160);

  const pipeline = createPipeline(gpu, sphereShaders, {
    vertexBuffers: [
      {
        arrayStride: sphere.offsets.arrayStride,
        attributes: [
          {
            shaderLocation: 0,
            offset: sphere.offsets.position,
            format: 'float32x3',
          },
          {
            shaderLocation: 1,
            offset: sphere.offsets.normal,
            format: 'float32x3',
          },
          {
            shaderLocation: 2,
            offset: sphere.offsets.uv,
            format: 'float32x2',
          },
        ],
      },
    ],
    primitive: true,
    depthStencil: true,
    multisample: true,
  });

  const uniformBuffer = createUniformBuffer(gpu, 4 * 16);
  const sphereTexture = createTexture(gpu, imageBitmap);
  const sampler = createLinearSampler(gpu);

  const verticesBuffer = createUniformBuffer(gpu, sphere.vertices.byteLength, sphere.vertices, {
    usage: GPUBufferUsage.VERTEX,
    array: 'float32',
  });

  const indicesBuffer = createUniformBuffer(gpu, sphere.indices.byteLength, sphere.indices, {
    usage: GPUBufferUsage.INDEX,
    array: 'uint16',
  });

  const sphereTransform = mat4.create();
  mat4.identity(sphereTransform);

  const uniformBindGroup = createBindGroup(gpu, pipeline, {
    layoutIndex: 1,
    entries: [
      {
        buffer: createUniformBuffer(gpu, 4 * 16, sphereTransform),
      },
      sampler,
      sphereTexture.createView(),
    ],
  });

  const frameBindGroup = createBindGroup(gpu, pipeline, {
    entries: [
      {
        buffer: uniformBuffer,
      },
    ],
  });

  let multisampleTexture: GPUTexture | null = null;
  let multisampleDepthTexture: GPUTexture | null = null;

  function frame() {
    if (ref.current === 'stop') return;
    const transformationMatrix = getSphereTransformationMatrix(context);

    gpu.queue.writeBuffer(
      uniformBuffer,
      0,
      transformationMatrix.buffer,
      transformationMatrix.byteOffset,
      transformationMatrix.byteLength,
    );

    const canvasTexture = context.getCurrentTexture();

    multisampleTexture = updateMultisampleTexture(gpu, multisampleTexture, canvasTexture);
    multisampleDepthTexture = updateMultisampleTexture(gpu, multisampleDepthTexture, canvasTexture, 'depth24plus');

    const renderPassDescriptor = createRenderPassDescriptor(canvasTexture, multisampleTexture, multisampleDepthTexture);

    const commandEncoder = gpu.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, frameBindGroup);
    passEncoder.setBindGroup(1, uniformBindGroup);
    passEncoder.setVertexBuffer(0, verticesBuffer);
    passEncoder.setIndexBuffer(indicesBuffer, 'uint16');
    passEncoder.drawIndexed(sphere.indices.length);
    passEncoder.end();
    gpu.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

self.addEventListener('message', async (event) => {
  const context = event.data.canvas?.getContext('webgpu');
  const gpu = await getGpuDevice();
  const type = event.data.type;

  if (type === 'start') {
    ref.current = 'start';
  }

  if (type === 'stop') {
    ref.current = 'stop';
    return;
  }

  if (!gpu || !context) return;

  paintSphere(gpu, context, ref, event.data.bitmap);
});
