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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.gpu) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const gpu = await getGpuDevice();
        if (!gpu) {
          setError('Failed to get WebGPU device. Your browser may not support WebGPU or it may be disabled.');
          return;
        }
        setGpu(gpu);
      } catch (err) {
        setError(`WebGPU initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (!navigator.gpu) return <div className={styles.noSupport}>WebGPU is not supported in this browser</div>;
  if (loading) return <div className={styles.loading}>Initializing WebGPU...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!gpu) return <div className={styles.error}>WebGPU device not available</div>;

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
