import { GRADIENT_STOPS } from '@/utils/constants';
import { TDimensions } from '@/types';

type TPropertyGetter = (propertyName: string) => string | number | undefined;

const getString = (value: string | number | CSSUnparsedValue | CSSUnitValue | undefined): string | null => {
  if (value instanceof CSSUnparsedValue) {
    return getString(value.toString());
  }

  if (value instanceof CSSUnitValue) {
    return value.value.toString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  return null;
};

const getNumber = (value: string | number | CSSUnparsedValue | CSSUnitValue | undefined): number | null => {
  if (value instanceof CSSUnparsedValue) {
    return getNumber(value.toString());
  }

  if (value instanceof CSSUnitValue) {
    return value.value;
  }

  if (typeof value === 'string') {
    return Number.isNaN(parseFloat(value)) ? null : parseFloat(value);
  }

  if (typeof value === 'number') {
    return value;
  }

  return null;
};

class Dots {
  static get inputProperties() {
    return ['--dot-size', '--gap-size', '--dot-color', '--x-dots', '--y-dots'];
  }

  paint(
    ctx: CanvasRenderingContext2D,
    size: TDimensions,
    properties: {
      get: TPropertyGetter;
    },
  ) {
    const dotSize = getNumber(properties.get('--dot-size')) || 10;
    const gapSize = getNumber(properties.get('--gap-size')) || 5;
    const dotColor = getString(properties.get('--dot-color')) || 'red';
    const xDots = getNumber(properties.get('--x-dots'));
    const yDots = getNumber(properties.get('--y-dots'));

    const dotRadius = dotSize / 2;

    const dotsCountHorizontal = xDots || Math.floor(size.width / (dotSize + gapSize));
    const dotsCountVertical = yDots || Math.floor(size.height / (dotSize + gapSize));

    const totalHorizontalWidth = dotsCountHorizontal * dotSize + (dotsCountHorizontal - 1) * gapSize;
    const totalVerticalWidth = dotsCountVertical * dotSize + (dotsCountVertical - 1) * gapSize;

    const extraHorizontalSpace = size.width - totalHorizontalWidth;
    const extraVerticalSpace = size.height - totalVerticalWidth;

    let x = xDots ? dotRadius / 2 : extraHorizontalSpace / 2;
    let y = yDots ? dotRadius / 2 : extraVerticalSpace / 2;

    const gapSizeX = xDots ? (size.width - xDots * dotSize) / (xDots - 1) : gapSize;
    const gapSizeY = yDots ? (size.height - yDots * dotSize) / (yDots - 1) : gapSize;

    ctx.fillStyle = dotColor;

    for (let i = 0; i < dotsCountVertical; i++) {
      for (let j = 0; j < dotsCountHorizontal; j++) {
        ctx.beginPath();
        ctx.arc(x + dotRadius / 2, y + dotRadius / 2, dotRadius, 0, 2 * Math.PI);
        ctx.fill();

        x += dotSize + gapSizeX;
      }

      x = xDots ? dotRadius / 2 : extraHorizontalSpace / 2;
      y += dotSize + gapSizeY;
    }
  }
}

class Outline {
  static get inputProperties() {
    return [
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      '--outline-color',
      '--outline-width',
    ];
  }

  paint(
    ctx: CanvasRenderingContext2D,
    size: TDimensions,
    properties: {
      get: TPropertyGetter;
    },
  ) {
    const outlineColor = getString(properties.get('--outline-color')) || 'red';
    const outlineWidth = getNumber(properties.get('--outline-width')) || 1;
    const borderRadiusTopLeft = getNumber(properties.get('border-top-left-radius')) || 0;
    const borderRadiusTopRight = getNumber(properties.get('border-top-right-radius')) || 0;
    const borderRadiusBottomRight = getNumber(properties.get('border-bottom-right-radius')) || 0;
    const borderRadiusBottomLeft = getNumber(properties.get('border-bottom-left-radius')) || 0;

    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineWidth;

    ctx.roundRect(0, 0, size.width, size.height, [
      borderRadiusTopLeft,
      borderRadiusTopRight,
      borderRadiusBottomRight,
      borderRadiusBottomLeft,
    ]);
    ctx.stroke();
  }
}

class GradientText {
  static get inputProperties() {
    return [];
  }

  paint(ctx: CanvasRenderingContext2D, size: TDimensions) {
    const gradient = ctx.createLinearGradient(0, 0, size.width, size.height);
    GRADIENT_STOPS.forEach(({ stop, color }) => gradient.addColorStop(stop, color));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.width, size.height);
  }
}

class Polygon {
  static get inputProperties() {
    return [];
  }

  static get inputArguments() {
    return ['<integer>'];
  }

  paint(
    ctx: CanvasRenderingContext2D,
    size: TDimensions,
    _: {
      get: TPropertyGetter;
    },
    args: string[],
  ) {
    const sides = getNumber(args[0]) || 3;

    const radius = size.width / 2;

    const centerX = size.width / 2;
    const centerY = size.height / 2;

    ctx.beginPath();
    ctx.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));

    for (let i = 1; i <= sides; i += 1) {
      ctx.lineTo(
        centerX + radius * Math.cos((i * 2 * Math.PI) / sides),
        centerY + radius * Math.sin((i * 2 * Math.PI) / sides),
      );
    }

    ctx.fill();
  }
}

if (registerPaint) {
  registerPaint('dots', Dots);
  registerPaint('outline', Outline);
  registerPaint('gradient-text', GradientText);
  registerPaint('polygon', Polygon);
}
