import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  configureContext,
  createBindGroup,
  createLinearSampler,
  createPipeline,
  createTexture,
  createUniformBuffer,
  renderCubeFrameWithTexture,
  updateMultisampleTexture,
} from '@/app/pages/js-tests/components/TestWebGpu/utils.webgpu';
import { getImageBitmap } from '@utils';
import { createCubeMesh } from '@/app/pages/js-tests/components/TestWebGpu/meshes/cube';
import styles from '@/app/pages/js-tests/components/TestWebGpu/styles.module.scss';
import cubeVideoShaders from '../../shaders/cubeVideo.wgsl?raw';
import cubeImageShaders from '../../shaders/cubeImage.wgsl?raw';
import { Select } from '@/app/components/Select/Select';
import catImage from '@assets/images/cats/cat-2.jpg';
import catImageIco from '@assets/images/flying_cat/flying-cat.ico';
import catImageSvg from '@assets/images/flying_cat/flying-cat.svg';
import catImageTransparency from '@assets/images/cats/black-cat.png';
import catVideo from '@assets/videos/out_smooth.webm';
import transparentVideo from '@assets/videos/bad-apple-transparent.webm';
import { TSelectOption } from '@/types';

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

const paintCubeImage = async (
  gpu: GPUDevice,
  context: GPUCanvasContext,
  ref: MutableRefObject<number | null>,
  imageSrc: string,
) => {
  configureContext(context, gpu);

  const pipeline = createPipeline(gpu, cubeImageShaders, {
    vertexBuffers: cubeVertexBuffers,
    primitive: true,
    depthStencil: true,
    multisample: true,
  });

  const verticesBuffer = createUniformBuffer(gpu, cube.vertices.byteLength, cube.vertices, {
    usage: GPUBufferUsage.VERTEX,
    array: 'float32',
  });
  const uniformBuffer = createUniformBuffer(gpu, 4 * 16);
  const imageBitmap = await getImageBitmap(imageSrc);
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
    const canvasTexture = context.getCurrentTexture();

    multisampleTexture = updateMultisampleTexture(gpu, multisampleTexture, canvasTexture);
    multisampleDepthTexture = updateMultisampleTexture(gpu, multisampleDepthTexture, canvasTexture, 'depth24plus');

    renderCubeFrameWithTexture(
      gpu,
      context,
      multisampleTexture,
      multisampleDepthTexture,
      uniformBindGroup,
      pipeline,
      verticesBuffer,
      uniformBuffer,
      cube.vertices.length / 10,
    );

    ref.current = requestAnimationFrame(frame);
  }

  ref.current = requestAnimationFrame(frame);
};

const paintCubeVideo = async (
  gpu: GPUDevice,
  context: GPUCanvasContext,
  ref: MutableRefObject<number | null>,
  videoSrc: string,
) => {
  const video = document.createElement('video');
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.src = videoSrc;
  await video.play();

  configureContext(context, gpu);

  const verticesBuffer = createUniformBuffer(gpu, cube.vertices.byteLength, cube.vertices, {
    usage: GPUBufferUsage.VERTEX,
    array: 'float32',
  });

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

    renderCubeFrameWithTexture(
      gpu,
      context,
      multisampleTexture,
      multisampleDepthTexture,
      uniformBindGroup,
      pipeline,
      verticesBuffer,
      uniformBuffer,
      cube.vertices.length / 10,
    );

    ref.current = requestAnimationFrame(frame);
  }

  ref.current = requestAnimationFrame(frame);
};

const images = {
  default: {
    title: 'Default',
    src: catImage,
  },
  ico: {
    title: 'Icon (.ico)',
    src: catImageIco,
  },
  svg: {
    title: 'Svg (.svg)',
    src: catImageSvg,
  },
  transparency: {
    title: 'Image with transparent background',
    src: catImageTransparency,
  },
};

const videos = {
  cat: {
    title: 'Cat',
    src: catVideo,
  },
  transparent: {
    title: 'Transparent',
    src: transparentVideo,
  },
};

type TCubePainterProps = {
  gpu: GPUDevice;
  scene: 'image' | 'video';
};

export const CubePainter = ({ gpu, scene }: TCubePainterProps) => {
  const [value, setValue] = useState(scene === 'image' ? images.default : videos.cat);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  const handleImageChange = async (_: string, entry: TSelectOption) => {
    const image = Object.values(images).find((image) => image.title === entry.label);
    if (!image) return;

    setValue(image);
  };

  const handleVideoChange = async (_: string, entry: TSelectOption) => {
    const video = Object.values(videos).find((video) => video.title === entry.label);
    if (!video) return;

    setValue(video);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('webgpu');

    if (!canvas || !ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const target = entries[0].target;

      if (!(target instanceof HTMLCanvasElement)) return;

      const width = target.clientWidth;
      const height = target.clientHeight;

      target.width = width;
      target.height = height;

      animationIdRef.current && cancelAnimationFrame(animationIdRef.current);

      if (scene === 'image') {
        paintCubeImage(gpu, ctx, animationIdRef, value.src);
      } else {
        paintCubeVideo(gpu, ctx, animationIdRef, value.src);
      }
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      animationIdRef.current && cancelAnimationFrame(animationIdRef.current);
    };
  }, [scene, value]);

  return (
    <>
      {scene === 'image' && (
        <Select
          label="Select image"
          options={Object.values(images).map(({ title, src }) => ({
            value: src,
            label: title,
          }))}
          value={{
            value: value.src,
            label: value.title,
          }}
          onChange={handleImageChange}
        />
      )}
      {scene === 'video' && (
        <Select
          label="Select video"
          options={Object.values(videos).map(({ title, src }) => ({
            value: src,
            label: title,
          }))}
          value={{
            value: value.src,
            label: value.title,
          }}
          onChange={handleVideoChange}
        />
      )}
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};
