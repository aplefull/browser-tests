import { useRef, useState } from 'react';
import styles from './styles.module.scss';
import { parseExpression } from '@/app/pages/css-tests/components/TestCssFunctions/TestCssFunctions';
import { Select } from '@/app/components/Select/Select';
import { Canvas } from '@/app/components/Canvas/Canvas';
import { MATH_MAP } from '@/utils/constants';
import { isDoubleArgumentFunction, isSingleArgumentFunction, isZeroArgumentsFunction, map, omit } from '@/utils/utils';
import { Table } from '@/app/components/Table/Table';
import { Switcher } from '@/app/components/Switcher/Switcher';

const mathMap = omit(MATH_MAP, ['mod', 'rem']);

// TODO refactor
export const TestMath = () => {
  const [canvasScale, setCanvasScale] = useState(5);
  const [currentFunction, setCurrentFunction] = useState<string>('abs');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const doubleArgFunctions = ['atan2', 'pow', 'hypot', 'imul', 'max', 'min'];
  const zeroArgFunctions = ['random'];

  const functions = Object.keys(mathMap).filter((key) => {
    return !doubleArgFunctions.includes(key) && !zeroArgFunctions.includes(key);
  });

  const selectOptions = [
    ...functions,
    { type: 'separator' },
    ...doubleArgFunctions,
    { type: 'separator' },
    ...zeroArgFunctions,
  ];

  const mathConstants = [
    {
      name: 'E',
      value: Math.E,
    },
    {
      name: 'LN2',
      value: Math.LN2,
    },
    {
      name: 'LN10',
      value: Math.LN10,
    },
    {
      name: 'LOG2E',
      value: Math.LOG2E,
    },
    {
      name: 'LOG10E',
      value: Math.LOG10E,
    },
    {
      name: 'PI',
      value: Math.PI,
    },
    {
      name: 'SQRT1_2',
      value: Math.SQRT1_2,
    },
    {
      name: 'SQRT2',
      value: Math.SQRT2,
    },
  ];

  const specialValues = [
    'sin(Infinity)',
    'cos(-Infinity)',
    'tan(0)',
    'asin(1)',
    'acos(0)',
    'atan(0)',
    'atan(Infinity)',
    'atan(-Infinity)',
    'atan2(0, -1)',
    'atan2(0, 1)',
    'sinh(pi)',
    'cosh(0)',
    'tanh(0)',
    'asinh(pi)',
    'asinh(infinity)',
    'sqrt(-1)',
    'sqrt(-1.3)',
    'cbrt(-1)',
    'cbrt(-pi)',
    'cbrt(-Infinity)',
    'clz32(-00000)',
    'clz32(Infinity)',
    'expm1(0)',
    'expm1(-pi)',
    'expm1(Infinity)',
    'expm1(-Infinity)',
    'log1p(0)',
    'log1p(-1)',
    'log1p(pi)',
    'log1p(Infinity)',
    'exp(-Infinity)',
    'pow(0, 0)',
    'pow(0, -1)',
    'pow(0, -Infinity)',
    'pow(0, Infinity)',
    'pow(Infinity, 0)',
    'pow(Infinity, -1)',
    'pow(Infinity, -Infinity)',
    'pow(Infinity, Infinity)',
    'pow(1, Infinity)',
    'pow(-1, Infinity)',
    'pow(pi, pi)',
    'pow(-pi, pi)',
    'pow(Infinity, -pi)',
    'round(Infinity)',
    'ceil(Infinity)',
    'floor(Infinity)',
    'trunc(Infinity)',
    'fround(Infinity)',
    'max(Infinity, -Infinity)',
    'min(Infinity, -Infinity)',
    'max()',
    'min()',
  ];

  const bg = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#000';
    context.clearRect(0, 0, width, height);
  };

  const axis = (canvas: HTMLCanvasElement, from: number, to: number) => {
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const numberOfLabels = to - from;
    const step = width / numberOfLabels;

    context.strokeStyle = '#ccc';

    // X axis
    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();

    // Y axis
    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width / 2, height);
    context.stroke();

    // Labels
    for (let val = 0; val <= width; val += step) {
      const isFirst = val === 0;
      const isLast = val === width;
      const isCenter = Math.round(val) === Math.round(width / 2);

      // Lines
      context.beginPath();
      context.moveTo(val, height / 2 - 5);
      context.lineTo(val, height / 2 + 5);
      context.stroke();

      context.beginPath();
      context.moveTo(width / 2 - 5, val);
      context.lineTo(width / 2 + 5, val);
      context.stroke();

      const numberOffset = isFirst ? 10 : isLast ? -10 : 0;

      if (isCenter) {
        context.save();
        context.font = '10px Arial';
        context.fillStyle = '#ccc';
        context.textAlign = 'left';
        context.textBaseline = 'top';
        context.fillText('0', width / 2 + 10, height / 2 + 10);
        context.restore();

        continue;
      }

      // Numbers
      context.save();
      context.font = '10px Arial';
      context.fillStyle = '#ccc';
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillText(`${Math.round(from + (val / width) * numberOfLabels)}`, val + numberOffset, height / 2 + 10);
      context.restore();

      context.save();
      context.font = '10px Arial';
      context.fillStyle = '#ccc';
      context.textAlign = 'left';
      context.textBaseline = 'middle';
      context.fillText(`${Math.round(to - (val / height) * numberOfLabels)}`, width / 2 + 10, val + numberOffset);
      context.restore();
    }
  };

  const plot = (functionName: string, scale: number) => (context: CanvasRenderingContext2D) => {
    //const context = canvas?.getContext('2d');
    const canvas = context.canvas;

    if (!context || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const plotStart = -scale;
    const plotEnd = scale;

    bg(canvas);
    axis(canvas, plotStart, plotEnd);

    const isKeyOfMathMap = (key: string): key is keyof typeof mathMap => key in mathMap;

    if (!isKeyOfMathMap(functionName)) return;

    const func = mathMap[functionName];

    context.strokeStyle = '#3b8bd5';

    context.moveTo(0, 0);
    context.beginPath();

    for (let x = 0; x <= width; x++) {
      let yValue = 0;
      const xValue = map(x, 0, width, plotStart, plotEnd);

      if (isSingleArgumentFunction(func)) {
        yValue = func(xValue);
      } else if (isDoubleArgumentFunction(func)) {
        yValue = func(xValue, 2);
      } else if (isZeroArgumentsFunction(func)) {
        yValue = func();
      } else {
        console.error('Unknown function', func);
      }

      const y = map(yValue, plotStart, plotEnd, height, 0);

      context.lineTo(x, y);
    }

    context.stroke();
  };

  const handleFunctionSelect = (func: string) => {
    setCurrentFunction(func);

    if (canvasRef.current) {
      //plot(canvasRef.current, func, canvasScale);
    }
  };

  const increaseCanvasScale = () => {
    setCanvasScale((prev) => {
      const newScale = prev < 10 ? prev + 1 : prev;
      //plot(canvasRef.current, currentFunction, newScale);
      return newScale;
    });
  };

  const decreaseCanvasScale = () => {
    setCanvasScale((prev) => {
      const newScale = prev > 1 ? prev - 1 : prev;
      // plot(canvasRef.current, currentFunction, newScale);
      return newScale;
    });
  };

  const nextFunction = () => {
    const currentIndex = Object.keys(mathMap).indexOf(currentFunction);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= Object.keys(mathMap).length) {
      const firstFunctionName = Object.keys(mathMap)[0];
      handleFunctionSelect(firstFunctionName);
    }

    const nextFunctionName = Object.keys(mathMap)[nextIndex];
    handleFunctionSelect(nextFunctionName);
  };

  const prevFunction = () => {
    const currentIndex = Object.keys(mathMap).indexOf(currentFunction);
    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      const lastFunctionName = Object.keys(mathMap)[Object.keys(mathMap).length - 1];
      handleFunctionSelect(lastFunctionName);
    }

    const prevFunctionName = Object.keys(mathMap)[prevIndex];
    handleFunctionSelect(prevFunctionName);
  };

  const specialValuesTableData = specialValues.map((value) => {
    const result = parseExpression(value);
    return {
      expression: value,
      result: result.toString(),
    };
  });

  const constantsTableData = mathConstants.map((constant) => {
    return {
      name: constant.name,
      value: constant.value.toString(),
    };
  });

  return (
    <div className={styles.math}>
      <h2>Constants and special values</h2>
      <div className={styles.constants}>
        <Table data={constantsTableData} />
        <Table maxHeight={249} data={specialValuesTableData} />
      </div>
      <h2>Functions</h2>
      <div className={styles.functions}>
        <div>
          <Switcher onNext={increaseCanvasScale} onPrev={decreaseCanvasScale}>
            <div className={styles.scale}>
              <span>Scale: </span>
              <span>{canvasScale}</span>
            </div>
          </Switcher>
        </div>
        <Canvas width={700} height={700} onResize={plot(currentFunction, canvasScale)} />
        <Switcher onNext={nextFunction} onPrev={prevFunction}>
          <Select options={selectOptions} onChange={handleFunctionSelect} value={currentFunction} />
        </Switcher>
      </div>
    </div>
  );
};
