import { Canvas } from '@/app/components/Canvas/Canvas';
import { GCO, IMAGES_DIFFERENT_FORMATS } from '@/utils/constants';
import spaceCat from '@assets/images/cats/space-cat.jpg';
import { fitSource, reset } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { useState } from 'react';
import { Select } from '@/app/components/Select/Select';
import styles from './styles.module.scss';
import { Switcher } from '@/app/components/Switcher/Switcher';

export const canvasCompositing = (gco: GlobalCompositeOperation) => async (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas;

  const img = new Image();
  img.src = IMAGES_DIFFERENT_FORMATS.jpg;
  await img.decode();

  const imgSpaceCat = new Image();
  imgSpaceCat.src = spaceCat;
  await imgSpaceCat.decode();

  reset(ctx);

  const { width: sw, height: sh, x: sx, y: sy } = fitSource(img.naturalWidth, img.naturalHeight, width / 2, height / 2);

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width / 2, height / 2);

  ctx.globalCompositeOperation = gco;

  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
  ctx.fillStyle = '#e6e6fa';
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';
};

const isGlobalCompositeOperation = (value: string): value is GlobalCompositeOperation => {
  return GCO.includes(value as GlobalCompositeOperation);
};

export const CanvasCompositing = () => {
  const [currentOperation, setCurrentOperation] = useState<GlobalCompositeOperation>('source-over');

  const handleSelect = (value: string) => {
    if (isGlobalCompositeOperation(value)) {
      setCurrentOperation(value);
    }
  };

  const previousOperation = () => {
    const index = GCO.indexOf(currentOperation);
    const prevIndex = index - 1 < 0 ? GCO.length - 1 : index - 1;
    setCurrentOperation(GCO[prevIndex]);
  };

  const nextOperation = () => {
    const index = GCO.indexOf(currentOperation);
    const nextIndex = index + 1 > GCO.length - 1 ? 0 : index + 1;
    setCurrentOperation(GCO[nextIndex]);
  };

  return (
    <div className={styles.compositing}>
      <Switcher onPrev={previousOperation} onNext={nextOperation}>
        <Select options={GCO} onChange={handleSelect} value={currentOperation} />
      </Switcher>
      <Canvas onResize={canvasCompositing(currentOperation)} />
    </div>
  );
};
