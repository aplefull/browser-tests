import { IMAGES_DIFFERENT_FORMATS } from '@/utils/constants';
import { fitSource, reset } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { Canvas } from '@/app/components/Canvas/Canvas';
import styles from './styles.module.scss';
import globalStyles from '../../styles.module.scss';
import classNames from 'classnames';

const drawImageFormats = async (ctx: CanvasRenderingContext2D) => {
  const testImages = Object.values(IMAGES_DIFFERENT_FORMATS);
  const canvas = ctx.canvas;

  const numberOfImages = testImages.length - 1;
  const columns = Math.ceil(Math.sqrt(numberOfImages));
  const rows = Math.ceil(numberOfImages / columns);
  const columnWidth = canvas.width / columns;
  const rowHeight = canvas.height / rows;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '20px sans-serif';
  ctx.fillStyle = 'white';
  ctx.shadowBlur = 5;

  const imagesToPaint = await Promise.all(
    testImages
      .filter((img) => img !== IMAGES_DIFFERENT_FORMATS.tiff)
      .map(async (image, index) => {
        const img = new Image();
        img.src = image;
        await img.decode();

        return {
          img: img,
          intrinsicWidth: img.naturalWidth,
          intrinsicHeight: img.naturalHeight,
          index,
          extension: image.split('/').pop()?.split('.').pop() || '',
        };
      }),
  );

  imagesToPaint.forEach(({ img, intrinsicWidth, intrinsicHeight, index, extension }) => {
    const xOff = (columnWidth - columnWidth) / 2 + (index % columns) * columnWidth;
    const yOff = (rowHeight - rowHeight) / 2 + Math.floor(index / columns) * rowHeight;

    const { width: sw, height: sh, x: sx, y: sy } = fitSource(intrinsicWidth, intrinsicHeight, columnWidth, rowHeight);
    ctx.drawImage(img, sx, sy, sw, sh, xOff, yOff, columnWidth, rowHeight);

    console.log(columnWidth, performance.now());
    ctx.shadowColor = 'black';

    ctx.fillText(`${extension}`, xOff + columnWidth / 2, yOff + rowHeight / 2);

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
