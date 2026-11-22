import { IMAGES_DIFFERENT_FORMATS } from '@/utils/constants';
import { fitSource, reset } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { Canvas } from '@/app/components/Canvas/Canvas';
import styles from './styles.module.scss';
import globalStyles from '../../styles.module.scss';
import classNames from 'classnames';

const drawImageFormats = async (ctx: CanvasRenderingContext2D) => {
  const formats = Object.entries(IMAGES_DIFFERENT_FORMATS).filter(([name]) => name !== 'tiff');
  const canvas = ctx.canvas;

  const columns = Math.ceil(Math.sqrt(formats.length));
  const rows = Math.ceil(formats.length / columns);
  const columnWidth = canvas.width / columns;
  const rowHeight = canvas.height / rows;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '20px sans-serif';
  ctx.fillStyle = 'white';
  ctx.shadowBlur = 5;

  const imagesToPaint = await Promise.all(
    formats.map(async ([name, src], index) => {
      const img = new Image();
      img.src = src;
      const decoded = await img.decode().then(
        () => true,
        () => false,
      );

      return { img: decoded ? img : null, name, index };
    }),
  );

  imagesToPaint.forEach(({ img, name, index }) => {
    const xOff = (index % columns) * columnWidth;
    const yOff = Math.floor(index / columns) * rowHeight;

    if (img) {
      const {
        width: sw,
        height: sh,
        x: sx,
        y: sy,
      } = fitSource(img.naturalWidth, img.naturalHeight, columnWidth, rowHeight);
      ctx.drawImage(img, sx, sy, sw, sh, xOff, yOff, columnWidth, rowHeight);
    }

    ctx.shadowColor = 'black';

    ctx.fillText(img ? name : `${name}: Fail`, xOff + columnWidth / 2, yOff + rowHeight / 2);

    ctx.shadowColor = 'transparent';
  });
};

export const drawImageData = async (ctx: CanvasRenderingContext2D) => {
  const { width, height } = ctx.canvas;

  const img = new Image();
  img.src = IMAGES_DIFFERENT_FORMATS.jpg;
  await img.decode();

  reset(ctx);
  ctx.clearRect(0, 0, width, height);

  const { width: sw, height: sh, x: sx, y: sy } = fitSource(img.naturalWidth, img.naturalHeight, width, height);

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);

  const tempCanvas = document.createElement('canvas');
  const tempCanvasCtx = tempCanvas.getContext('2d');

  if (!tempCanvasCtx) {
    console.error('No context');
    return;
  }

  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  tempCanvasCtx.putImageData(imageData, 0, 0);

  const newImage = new Image();
  newImage.src = tempCanvas.toDataURL();
  await newImage.decode();

  ctx.drawImage(newImage, 0, 0, width, height);
};

export const CanvasImage = () => {
  return (
    <div className={classNames(styles.image, globalStyles.gridLayout)}>
      <Canvas onResize={drawImageFormats} />
      <Canvas
        title="This image is taken from one canvas and drawn onto this one to test if image drawing functions work fine :)"
        onResize={drawImageData}
      />
    </div>
  );
};
