import styles from './styles.module.scss';
import { useState } from 'react';
import { Select } from '@/app/components/Select/Select';
import { TrianglePainter } from './painters/TrianglePainter/TrianglePainter';
import { CubePainter } from './painters/CubePainter/CubePainter';
import { BlurPainter } from './painters/BlurPainter/BlurPainter';
import { SpherePainter } from './painters/SpherePainter/SpherePainter';

const SCENES = {
  TRIANGLE: 'Triangle',
  TEXTURED_CUBE: 'Textured Cube',
  BLUR: 'Blur',
  SPHERE: 'Sphere',
};

export const TestWebGl = () => {
  const [scene, setScene] = useState<string>(SCENES.TRIANGLE);

  return (
    <div className={styles.container}>
      <Select options={Object.values(SCENES)} onChange={setScene} value={scene} />
      {scene === SCENES.TRIANGLE && <TrianglePainter />}
      {scene === SCENES.TEXTURED_CUBE && <CubePainter />}
      {scene === SCENES.BLUR && <BlurPainter />}
      {scene === SCENES.SPHERE && <SpherePainter />}
    </div>
  );
};
