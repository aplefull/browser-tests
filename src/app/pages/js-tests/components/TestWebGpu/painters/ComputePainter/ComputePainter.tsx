import { useEffect, useRef, useState } from 'react';
import sha256Shaders from '../../shaders/sha256.wgsl?raw';
import { Input } from '@/app/components/Input/Input';
import styles from './styles.module.scss';
import {
  createBindGroup,
  createBindGroupLayout,
  createComputePipeline,
  createUniformBuffer,
} from '@/app/pages/js-tests/components/TestWebGpu/utils.webgpu';
import { toHexString } from '@/app/pages/js-tests/components/TestCrypto/TestCrypto';

type TComputePainterProps = {
  gpu: GPUDevice;
};

const sha256GPU = async (value: string, gpu: GPUDevice) => {
  const inputArray = Uint32Array.from(new TextEncoder().encode(value));

  const buffer0 = createUniformBuffer(gpu, inputArray.byteLength, inputArray, {
    mappedAtCreation: true,
    usage: GPUBufferUsage.STORAGE,
    array: 'int32',
  });

  const buffer1 = createUniformBuffer(gpu, Int32Array.BYTES_PER_ELEMENT, new Uint32Array([inputArray.length]), {
    mappedAtCreation: true,
    usage: GPUBufferUsage.STORAGE,
    array: 'int32',
  });

  const buffer2 = createUniformBuffer(gpu, Uint32Array.BYTES_PER_ELEMENT * 32, null, {
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: false,
  });

  const resultBuffer = createUniformBuffer(gpu, Uint32Array.BYTES_PER_ELEMENT * 32, null, {
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    mappedAtCreation: false,
  });

  const bindGroupLayout = createBindGroupLayout(gpu, {
    entries: ['read-only-storage', 'read-only-storage', 'storage'],
  });

  const computePipeline = createComputePipeline(gpu, sha256Shaders, bindGroupLayout);

  const bindGroup = createBindGroup(gpu, computePipeline, {
    entries: [{ buffer: buffer0 }, { buffer: buffer1 }, { buffer: buffer2 }],
  });

  const commandEncoder = gpu.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(computePipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(1, 1);
  passEncoder.end();
  commandEncoder.copyBufferToBuffer(buffer2, 0, resultBuffer, 0, Uint32Array.BYTES_PER_ELEMENT * 32);
  gpu.queue.submit([commandEncoder.finish()]);

  await resultBuffer.mapAsync(GPUMapMode.READ);

  return toHexString(new Uint32Array(resultBuffer.getMappedRange())).toLowerCase();
};

export const ComputePainter = ({ gpu }: TComputePainterProps) => {
  const [input, setInput] = useState('Hello!');
  const [result, setResult] = useState('');

  const disabledRef = useRef(false);

  const handleInputChange = async (value: string) => {
    if (disabledRef.current) return;

    disabledRef.current = true;
    setInput(value);

    const result = value !== '' && (await sha256GPU(value, gpu));

    if (result) {
      setResult(() => result);
    }

    disabledRef.current = false;
  };

  useEffect(() => {
    handleInputChange(input).catch(console.error);
  }, []);

  return (
    <div className={styles.computeContainer}>
      <Input value={input} onChange={handleInputChange} className={styles.input} />
      <span>{result}</span>
    </div>
  );
};
