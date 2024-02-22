import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Select } from '@/app/components/Select/Select';
import { getGpuDevice } from '@/app/pages/js-tests/components/TestWebGpu/utils.webgpu';
import { TrianglePainter } from '@/app/pages/js-tests/components/TestWebGpu/painters/TrianglePainter/TrianglePainter';
import { CubePainter } from '@/app/pages/js-tests/components/TestWebGpu/painters/CubePainter/CubePainter';
import { BlurPainter } from '@/app/pages/js-tests/components/TestWebGpu/painters/BlurPainter/BlurPainter';
import { SpherePainter } from '@/app/pages/js-tests/components/TestWebGpu/painters/SpherePainter/SpherePainter';
import { ComputePainter } from '@/app/pages/js-tests/components/TestWebGpu/painters/ComputePainter/ComputePainter';

const SCENES = {
  TRIANGLE: 'Triangle',
  CUBE_VIDEO: 'Cube Video',
  CUBE_IMAGE: 'Cube Image',
  BLUR: 'Blur',
  SPHERE: 'Sphere',
};

export const TestWebGpu = () => {
  const [gpu, setGpu] = useState<GPUDevice | null>(null);
  const [scene, setScene] = useState<string>(SCENES.TRIANGLE);

  useEffect(() => {
    if (!navigator.gpu) return;

    const init = async () => {
      const gpu = await getGpuDevice();
      if (!gpu) return;

      setGpu(gpu);
    };

    init().catch(console.error);
  }, []);

  if (!navigator.gpu) return <div className={styles.noSupport}>WebGPU is not supported</div>;
  if (!gpu) return null;

  return (
    <>
      <div className={styles.container}>
        <Select options={Object.values(SCENES)} onChange={setScene} value={scene} />
        {scene === SCENES.TRIANGLE && <TrianglePainter gpu={gpu} />}
        {scene === SCENES.BLUR && <BlurPainter gpu={gpu} />}
        {scene === SCENES.CUBE_IMAGE && <CubePainter gpu={gpu} scene="image" />}
        {scene === SCENES.CUBE_VIDEO && <CubePainter gpu={gpu} scene="video" />}
        {scene === SCENES.SPHERE && <SpherePainter />}
      </div>
      <div className={styles.compute}>
        <span>Computing sha256 using compute shader:</span>
        <ComputePainter gpu={gpu} />
      </div>
    </>
  );
};
