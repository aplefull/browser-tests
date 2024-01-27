import { MutableRefObject, useEffect, useRef, useState } from 'react';
import catImage from '@assets/images/cats/cat-2.jpg';
import catImageIco from '@assets/images/flying_cat/flying-cat.ico';
import catImageSvg from '@assets/images/flying_cat/flying-cat.svg';
import catImageTransparency from '@assets/images/cats/black-cat.png';
import hugeImage from '@assets/images/huge.png';
import catVideo from '@assets/videos/cat.webm';
import { createCubeMesh } from './meshes/cube';
import triangleShaders from './shaders/triangle.wgsl?raw';
import cubeVideoShaders from './shaders/cubeVideo.wgsl?raw';
import cubeImageShaders from './shaders/cubeImage.wgsl?raw';
import blurShaders from './shaders/blur.wgsl?raw';
import styles from './styles.module.scss';
import { Select } from '@/app/components/Select/Select';
import sphereSceneWorker from './workers/worker?url';
import { getImageBitmap } from '@/utils/utils';
import {
  configureContext,
  createBindGroup,
  createPipeline,
  createRenderPassDescriptor,
  createVertexBuffer,
  getGpuDevice,
  getCubeTransformationMatrix,
  updateMultisampleTexture,
  createLinearSampler,
  createUniformBuffer,
  createTexture,
  createSimpleRenderPassDescriptor,
  createEmptyTexture,
} from '@/app/pages/js-tests/components/TestWebGpu/utils.webgpu';
import { TSelectOption } from '@/types';

const SCENES = {
  TRIANGLE: 'Triangle',
  CUBE_VIDEO: 'Cube Video',
  CUBE_IMAGE: 'Cube Image',
  BLUR: 'Blur',
  SPHERE: 'Sphere',
};

const images = {
  default: {
    title: 'Default',
    src: catImage,
  },
  ico: {
    title: '.ico',
    src: catImageIco,
  },
  svg: {
    title: '.svg',
    src: catImageSvg,
  },
  transparency: {
    title: 'Image with transparent background',
    src: catImageTransparency,
  },
  huge: {
    title: 'Huge image',
    src: hugeImage,
  },
};

const cube = createCubeMesh(1);
const cubeVertexBuffers: GPUVertexBufferLayout[] = [
  {
    arrayStride: cube.offsets.arrayStride,
    attributes: [
      {
        shaderLocation: 0,
        offset: cube.offsets.position,
        format: 'float32x4',
      },
      {
        shaderLocation: 1,
        offset: cube.offsets.uv,
        format: 'float32x2',
      },
    ],
  },
];

const createComputePipeline = (gpu: GPUDevice, shaders: string) => {
  return gpu.createComputePipeline({
    layout: 'auto',
    compute: {
      module: gpu.createShaderModule({
        code: shaders,
      }),
      entryPoint: 'c_main',
    },
  });
};

const paintTriangle = (gpu: GPUDevice, context: GPUCanvasContext, sceneRef: MutableRefObject<string>) => {
  configureContext(context, gpu);

  const pipeline = createPipeline(gpu, triangleShaders);

  const frame = () => {
    if (sceneRef.current !== SCENES.TRIANGLE) return;

    const commandEncoder = gpu.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3);
    passEncoder.end();

    gpu.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

const paintCubeImage = async (
  gpu: GPUDevice,
  context: GPUCanvasContext,
  image: string,
  sceneRef: MutableRefObject<string>,
) => {
  configureContext(context, gpu);

  const pipeline = createPipeline(gpu, cubeImageShaders, {
    vertexBuffers: cubeVertexBuffers,
    primitive: true,
    depthStencil: true,
    multisample: true,
  });

  const verticesBuffer = createVertexBuffer(gpu, cube.vertices);
  const uniformBuffer = createUniformBuffer(gpu, 4 * 16);
  const imageBitmap = await getImageBitmap(image);
  const cubeTexture = createTexture(gpu, imageBitmap);
  const sampler = createLinearSampler(gpu);

  const uniformBindGroup = createBindGroup(gpu, pipeline, {
    entries: [
      {
        buffer: uniformBuffer,
      },
      sampler,
      cubeTexture.createView(),
    ],
  });

  let multisampleTexture: GPUTexture | null = null;
  let multisampleDepthTexture: GPUTexture | null = null;

  function frame() {
    if (sceneRef.current !== SCENES.CUBE_IMAGE) return;

    const canvasTexture = context.getCurrentTexture();

    multisampleTexture = updateMultisampleTexture(gpu, multisampleTexture, canvasTexture);
    multisampleDepthTexture = updateMultisampleTexture(gpu, multisampleDepthTexture, canvasTexture, 'depth24plus');

    const transformationMatrix = getCubeTransformationMatrix(context);

    gpu.queue.writeBuffer(
      uniformBuffer,
      0,
      transformationMatrix.buffer,
      transformationMatrix.byteOffset,
      transformationMatrix.byteLength,
    );

    const renderPassDescriptor = createRenderPassDescriptor(canvasTexture, multisampleTexture, multisampleDepthTexture);

    const commandEncoder = gpu.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, verticesBuffer);
    passEncoder.draw(cube.vertices.length / 10);
    passEncoder.end();
    gpu.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

const paintCubeVideo = async (gpu: GPUDevice, context: GPUCanvasContext, sceneRef: MutableRefObject<string>) => {
  const video = document.createElement('video');
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.src = catVideo;
  await video.play();

  configureContext(context, gpu);

  const verticesBuffer = createVertexBuffer(gpu, createCubeMesh(1).vertices);

  const pipeline = createPipeline(gpu, cubeVideoShaders, {
    vertexBuffers: cubeVertexBuffers,
    primitive: true,
    depthStencil: true,
    multisample: true,
  });

  const uniformBuffer = createUniformBuffer(gpu, 4 * 16);
  const sampler = createLinearSampler(gpu);

  let multisampleTexture: GPUTexture | null = null;
  let multisampleDepthTexture: GPUTexture | null = null;

  function frame() {
    if (sceneRef.current !== SCENES.CUBE_VIDEO) return;

    const canvasTexture = context.getCurrentTexture();

    multisampleTexture = updateMultisampleTexture(gpu, multisampleTexture, canvasTexture);
    multisampleDepthTexture = updateMultisampleTexture(gpu, multisampleDepthTexture, canvasTexture, 'depth24plus');

    const uniformBindGroup = createBindGroup(gpu, pipeline, {
      entries: [
        {
          buffer: uniformBuffer,
        },
        sampler,
        gpu.importExternalTexture({
          source: video,
        }),
      ],
    });

    const transformationMatrix = getCubeTransformationMatrix(context);

    gpu.queue.writeBuffer(
      uniformBuffer,
      0,
      transformationMatrix.buffer,
      transformationMatrix.byteOffset,
      transformationMatrix.byteLength,
    );

    const renderPassDescriptor = createRenderPassDescriptor(canvasTexture, multisampleTexture, multisampleDepthTexture);

    const commandEncoder = gpu.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.setVertexBuffer(0, verticesBuffer);
    passEncoder.draw(cube.vertices.length / 10);
    passEncoder.end();
    gpu.queue.submit([commandEncoder.finish()]);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
};

// TODO
const paintBlur = async (gpu: GPUDevice, context: GPUCanvasContext, sceneRef: MutableRefObject<string>) => {
  const filterSize = 15;
  const iterationsCount = 2;

  configureContext(context, gpu);

  const video = document.createElement('video');
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.src = catVideo;
  await video.play();

  const blurPipeline = createComputePipeline(gpu, blurShaders);
  const pipeline = createPipeline(gpu, blurShaders);
  const sampler = createLinearSampler(gpu);
  const imageBitmap = await getImageBitmap(catImage);

  const [srcWidth, srcHeight] = [imageBitmap.width, imageBitmap.height];

  const texture = createTexture(gpu, imageBitmap);

  const textures = {
    vertical: createEmptyTexture(gpu, srcWidth, srcHeight),
    horizontal: createEmptyTexture(gpu, srcWidth, srcHeight),
  };

  const buffer0 = createUniformBuffer(gpu, 4, null, {
    usage: GPUBufferUsage.UNIFORM,
    array: 'uint32',
    mappedAtCreation: true,
    fillValue: 0,
  });

  const buffer1 = createUniformBuffer(gpu, 4, null, {
    usage: GPUBufferUsage.UNIFORM,
    array: 'uint32',
    mappedAtCreation: true,
    fillValue: 1,
  });

  const blurParamsBuffer = createUniformBuffer(gpu, 8);

  const computeConstants = createBindGroup(gpu, blurPipeline, {
    entries: [sampler, { buffer: blurParamsBuffer }],
  });

  const computeBindGroup0 = createBindGroup(gpu, blurPipeline, {
    layoutIndex: 1,
    entriesStartIndex: 1,
    entries: [
      texture.createView(),
      textures.vertical.createView(),
      {
        buffer: buffer0,
      },
    ],
  });

  const computeBindGroup1 = createBindGroup(gpu, blurPipeline, {
    layoutIndex: 1,
    entriesStartIndex: 1,
    entries: [
      textures.vertical.createView(),
      textures.horizontal.createView(),
      {
        buffer: buffer1,
      },
    ],
  });

  const computeBindGroup2 = createBindGroup(gpu, blurPipeline, {
    layoutIndex: 1,
    entriesStartIndex: 1,
    entries: [
      textures.horizontal.createView(),
      textures.vertical.createView(),
      {
        buffer: buffer0,
      },
    ],
  });

  const showResultBindGroup = createBindGroup(gpu, pipeline, {
    entries: [sampler, textures.horizontal.createView()],
  });

  let blockSize = 128 - (filterSize - 1);
  gpu.queue.writeBuffer(blurParamsBuffer, 0, new Uint32Array([filterSize, blockSize]));

  function frame() {
    if (sceneRef.current !== SCENES.BLUR) return;

    const commandEncoder = gpu.createCommandEncoder();

    const workgroupCount = {
      firstPass: [Math.ceil(srcWidth / blockSize), Math.ceil(srcHeight / 4)],
      secondPass: [Math.ceil(srcHeight / blockSize), Math.ceil(srcWidth / 4)],
    };

    const computePass = commandEncoder.beginComputePass();
    computePass.setPipeline(blurPipeline);
    computePass.setBindGroup(0, computeConstants);

    const pass = (computePass: GPUComputePassEncoder, bingGroup: GPUBindGroup, workgroupCount: number[]) => {
      computePass.setBindGroup(1, bingGroup);
      computePass.dispatchWorkgroups(workgroupCount[0], workgroupCount[1]);
    };

    pass(computePass, computeBindGroup0, workgroupCount.firstPass);
    pass(computePass, computeBindGroup1, workgroupCount.secondPass);

    for (let i = 0; i < iterationsCount - 1; i++) {
      pass(computePass, computeBindGroup2, workgroupCount.firstPass);
      pass(computePass, computeBindGroup1, workgroupCount.secondPass);
    }

    computePass.end();

    const renderPassDescriptor = createSimpleRenderPassDescriptor(context.getCurrentTexture());
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, showResultBindGroup);
    passEncoder.draw(6);
    passEncoder.end();
    gpu.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

export const TestWebGpu = () => {
  const [gpu, setGpu] = useState<GPUDevice | null>(null);
  const [scene, setScene] = useState<string>(SCENES.TRIANGLE);
  const [currentImage, setCurrentImage] = useState(images.default.src);

  const sceneRef = useRef(scene);
  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offScreenCanvasRef = useRef<HTMLCanvasElement>(null);

  const getContext = (canvasRef: MutableRefObject<HTMLCanvasElement | null>) => canvasRef.current?.getContext('webgpu');

  const handleSceneChange = async (value: string) => {
    if (sceneRef.current === value) return;

    if (value !== SCENES.SPHERE) {
      workerRef.current?.postMessage({ type: 'stop' });
      workerRef.current = null;
    }

    setScene(value);
    sceneRef.current = value;

    const context = getContext(canvasRef);
    if (!gpu) return;

    switch (value) {
      case SCENES.TRIANGLE: {
        if (!context) return;

        paintTriangle(gpu, context, sceneRef);
        return;
      }

      case SCENES.CUBE_IMAGE: {
        if (!context) return;

        paintCubeImage(gpu, context, currentImage, sceneRef);
        return;
      }

      case SCENES.CUBE_VIDEO: {
        if (!context) return;

        paintCubeVideo(gpu, context, sceneRef);
        return;
      }

      case SCENES.SPHERE: {
        const hiddenCanvas = offScreenCanvasRef.current;

        if (!hiddenCanvas) return;

        const worker = new Worker(sphereSceneWorker, { type: 'module' });
        workerRef.current = worker;

        const offScreenCanvas = hiddenCanvas.transferControlToOffscreen();
        offScreenCanvas.width = hiddenCanvas.clientWidth;
        offScreenCanvas.height = hiddenCanvas.clientHeight;

        const imageBitmap = await getImageBitmap(catImage);
        worker.postMessage({ type: 'start', canvas: offScreenCanvas, bitmap: imageBitmap }, [
          offScreenCanvas,
          imageBitmap,
        ]);

        return;
      }

      case SCENES.BLUR: {
        const context = getContext(canvasRef);
        if (!context) return;

        paintBlur(gpu, context, sceneRef);
        return;
      }
    }
  };

  const handleImageChange = async (_: string, entry: TSelectOption) => {
    const image = images[entry.value];

    setCurrentImage(image.src);
  };

  useEffect(() => {
    if (!navigator.gpu) {
      console.log('WebGPU is not supported');
      return;
    }

    const init = async () => {
      const gpu = await getGpuDevice();
      const ctx = getContext(canvasRef);
      if (!gpu) return;

      setGpu(gpu);

      if (!ctx) return;

      paintTriangle(gpu, ctx, sceneRef);
    };

    init().catch(console.error);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hiddenCanvas = offScreenCanvasRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const target = entries[0].target;

      if (!(target instanceof HTMLCanvasElement)) return;

      const width = target.clientWidth;
      const height = target.clientHeight;

      target.width = width;
      target.height = height;

      handleSceneChange(scene);
    });

    canvas && resizeObserver.observe(canvas);
    hiddenCanvas && resizeObserver.observe(hiddenCanvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [scene, currentImage]);

  return (
    <div className={styles.container}>
      <Select options={Object.values(SCENES)} onChange={setScene} value={scene} />
      <div className={styles.options}>
        {scene === SCENES.CUBE_IMAGE && (
          <Select
            label="Select image"
            options={Object.entries(images).map(([key, value]) => ({
              value: key,
              label: value.title,
            }))}
            value={currentImage}
            onChange={handleImageChange}
          />
        )}
      </div>
      {scene === SCENES.SPHERE && <canvas ref={offScreenCanvasRef} className={styles.canvas} />}
      {scene !== SCENES.SPHERE && <canvas ref={canvasRef} className={styles.canvas} />}
    </div>
  );
};
