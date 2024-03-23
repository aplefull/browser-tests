import { useState } from 'react';
import styles from './styles.module.scss';
import { parseExpression } from '@/app/pages/css-tests/components/TestCssFunctions/TestCssFunctions';
import { Select } from '@/app/components/Select/Select';
import { Canvas } from '@/app/components/Canvas/Canvas';
import { MATH_CONSTANTS, MATH_MAP, MATH_SPECIAL_VALUES } from '@/utils/constants';
import { isDoubleArgumentFunction, isSingleArgumentFunction, isZeroArgumentsFunction, map, omit } from '@/utils/utils';
import { Table } from '@/app/components/Table/Table';
import { Switcher } from '@/app/components/Switcher/Switcher';
import { QMath } from '@math';

const mathMap = omit(MATH_MAP, ['mod', 'rem']);

export const TestMath = () => {
  const [canvasScale, setCanvasScale] = useState(5);
  const [currentFunction, setCurrentFunction] = useState<string>('abs');

  const doubleArgFunctions = ['atan2', 'pow', 'hypot', 'imul', 'max', 'min'];
  const zeroArgFunctions = ['random'];

  const functions = Object.keys(mathMap).filter((key) => {
    return !doubleArgFunctions.includes(key) && !zeroArgFunctions.includes(key);
  });

  const selectOptions = [
    {
      group: 'Single argument',
      items: functions,
    },
    {
      group: 'Two arguments',
      items: doubleArgFunctions,
    },
    {
      group: 'Zero arguments',
      items: zeroArgFunctions,
    },
  ];

  const bg = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;

    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#000';
    context.clearRect(0, 0, width, height);
  };

  const axis = (canvas: HTMLCanvasElement, from: number, to: number) => {
    const context = canvas.getContext('2d');
    if (!context) return;

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
      const isLast = QMath.chop(val) === width;
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
  };

  const increaseCanvasScale = () => {
    setCanvasScale((prev) => {
      return prev < 10 ? prev + 1 : prev;
    });
  };

  const decreaseCanvasScale = () => {
    setCanvasScale((prev) => {
      return prev > 1 ? prev - 1 : prev;
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

  const specialValuesTableData = MATH_SPECIAL_VALUES.map((value) => {
    const result = parseExpression(value);
    return {
      expression: value,
      result: result.toString(),
    };
  });

  const constantsTableData = MATH_CONSTANTS.map((constant) => {
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
