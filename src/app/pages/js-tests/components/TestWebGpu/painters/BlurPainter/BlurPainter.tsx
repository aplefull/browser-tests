import { MutableRefObject, useEffect, useRef, useState } from 'react';
import styles from '@/app/pages/js-tests/components/TestWebGpu/styles.module.scss';
import {
  configureContext,
  createBindGroup,
  createComputePipeline,
  createEmptyTexture,
  createLinearSampler,
  createPipeline,
  createSimpleRenderPassDescriptor,
  createTexture,
  createUniformBuffer,
} from '@/app/pages/js-tests/components/TestWebGpu/utils.webgpu';
import blurShaders from '../../shaders/blur.wgsl?raw';
import { getImageBitmap } from '@utils';
import catImage from '@assets/images/cats/cat-2.jpg';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { Select } from '@/app/components/Select/Select';
import catImageIco from '@assets/images/flying_cat/flying-cat.ico';
import catImageSvg from '@assets/images/flying_cat/flying-cat.svg';
import { TSelectOption } from '@/types';

type TPaintBlurSettings = {
  filterSize: number;
  iterationsCount: number;
  src: string;
};

const paintBlur = async (
  gpu: GPUDevice,
  context: GPUCanvasContext,
  ref: MutableRefObject<number | null>,
  settings: TPaintBlurSettings,
) => {
  configureContext(context, gpu);

  const blurPipeline = createComputePipeline(gpu, blurShaders);
  const pipeline = createPipeline(gpu, blurShaders);
  const sampler = createLinearSampler(gpu);
  const imageBitmap = await getImageBitmap(settings.src, context.canvas.width, context.canvas.height);

  const [srcWidth, srcHeight] = [imageBitmap.width, imageBitmap.height];

  const texture = createTexture(gpu, imageBitmap);

  const textures = {
    vertical: createEmptyTexture(gpu, srcWidth, srcHeight),
    horizontal: createEmptyTexture(gpu, srcWidth, srcHeight),
  };

  const buffer0 = createUniformBuffer(gpu, 4, new Uint32Array([0]), {
    usage: GPUBufferUsage.UNIFORM,
    array: 'uint32',
    mappedAtCreation: true,
  });

  const buffer1 = createUniformBuffer(gpu, 4, new Uint32Array([1]), {
    usage: GPUBufferUsage.UNIFORM,
    array: 'uint32',
    mappedAtCreation: true,
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

  const blockSize = 128 - (settings.filterSize - 1);
  gpu.queue.writeBuffer(blurParamsBuffer, 0, new Uint32Array([settings.filterSize, blockSize]));

  function frame() {
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

    for (let i = 0; i < settings.iterationsCount - 1; i++) {
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
};

type TBlurPainterProps = {
  gpu: GPUDevice;
};

export const BlurPainter = ({ gpu }: TBlurPainterProps) => {
  const [value, setValue] = useState(images.default);

  const [iterations, setIterations] = useState(2);
  const [filterSize, setFilterSize] = useState(15);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  const handleImageChange = async (_: string, entry: TSelectOption) => {
    const image = Object.values(images).find((image) => image.title === entry.label);
    if (!image) return;

    setValue(image);
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
      paintBlur(gpu, ctx, animationIdRef, {
        filterSize,
        iterationsCount: iterations,
        src: value.src,
      });
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      animationIdRef.current && cancelAnimationFrame(animationIdRef.current);
    };
  }, [iterations, filterSize, value.src]);

  return (
    <>
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
      <RangeInput min={2} max={20} value={iterations} onChange={setIterations} step={1} label="Iterations" />
      <RangeInput min={2} max={20} value={filterSize} onChange={setFilterSize} step={1} label="Filter size" />
      <canvas ref={canvasRef} className={styles.canvas} />
    </>
  );
};
