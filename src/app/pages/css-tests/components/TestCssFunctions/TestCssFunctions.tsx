import styles from './styles.module.scss';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Section } from '@/app/components/Section/Section';
import { MATH_MAP } from '@/utils/constants';
import { isDoubleArgumentFunction, isSingleArgumentFunction } from '@/utils/utils';

const parseSingleMathValue = (value: string) => {
  const trimmedArg = value.trim();

  if (trimmedArg.endsWith('deg')) {
    const degrees = parseFloat(trimmedArg.replace('deg', ''));

    return degrees * (Math.PI / 180);
  }

  if (trimmedArg.endsWith('turn')) {
    const turns = parseFloat(trimmedArg.replace('turn', ''));

    return turns * 2 * Math.PI;
  }

  if (trimmedArg.endsWith('rad')) {
    return parseFloat(trimmedArg.replace('rad', ''));
  }

  if (trimmedArg.endsWith('grad')) {
    const grads = parseFloat(trimmedArg.replace('grad', ''));

    return grads * (Math.PI / 200);
  }

  if (trimmedArg.endsWith('px')) {
    return parseFloat(trimmedArg.replace('px', ''));
  }

  if (trimmedArg.endsWith('rem')) {
    const rems = parseFloat(trimmedArg.replace('rem', ''));

    return rems * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  if (trimmedArg.includes('pi')) {
    return parseFloat(trimmedArg.replace('pi', '1')) * Math.PI;
  }

  if (trimmedArg.includes('e')) {
    return parseFloat(trimmedArg.replace('e', '1')) * Math.E;
  }

  if (trimmedArg.includes('infinity')) {
    return parseFloat(trimmedArg.replace('infinity', '1')) * Infinity;
  }

  return parseFloat(trimmedArg);
};

const clearExpression = (value: string) => {
  const cssFunctions = ['calc', 'rotate', 'scale', 'translate', 'skew'];

  const cssFunction = cssFunctions.find((func) => value.trim().startsWith(`${func}(`));

  if (!cssFunction) return value.trim();

  return value.slice(cssFunction.length + 1, -1).trim();
};

const getExpression = (func: string, value: string, type: string) => {
  if (type === 'number') return `calc(100px * ${func}(${value}))`;

  return `rotate(${func}(${value}))`;
};

const getRotationAngle = (transformString: string) => {
  if (transformString === 'none') return 0;

  const values = transformString.split('(')[1].split(')')[0].split(',');

  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);

  const angle = Math.atan2(b, a) * (180 / Math.PI);

  return angle < 0 ? angle + 360 : angle;
};

const isOperator = (char: string) => ['+', '-', '*', '/'].includes(char);
const isFunction = (chars: string) => {
  return Object.keys(MATH_MAP).some((func) => chars.trim().startsWith(func));
};

const splitExpression = (expression: string) => {
  const parts: string[] = [];
  let currentPart = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (isOperator(char)) {
      if ((i === 0 && char === '-') || (isOperator(parts[parts.length - 1]) && currentPart.trim() === '')) {
        currentPart += char;
        continue;
      }

      if (currentPart) {
        parts.push(currentPart);
        parts.push(char);
        currentPart = '';
        continue;
      }
    }

    currentPart += char;

    if (i === expression.length - 1) parts.push(currentPart);
  }

  let numberOfOpenBrackets = 0;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (isFunction(part)) {
      let j = i + 1;
      let currentPart = part;

      numberOfOpenBrackets += currentPart.split('(').length - 1;
      numberOfOpenBrackets -= currentPart.split(')').length - 1;

      if (numberOfOpenBrackets === 0) {
        continue;
      }

      while (j < parts.length) {
        const nextPart = parts[j];

        currentPart += nextPart;

        numberOfOpenBrackets += nextPart.split('(').length - 1;
        numberOfOpenBrackets -= nextPart.split(')').length - 1;

        if (numberOfOpenBrackets === 0) {
          parts[i] = currentPart;
          parts.splice(i + 1, j - i);
          i = 0;
          break;
        }

        j++;
      }
    }
  }

  return parts.map((part) => part.trim());
};

export const parseExpression = (expression: string): number => {
  const trimmedExpression = clearExpression(expression);

  const parts = splitExpression(trimmedExpression);

  const transformedParts = parts.map((part) => {
    if (isOperator(part)) return part;

    if (isFunction(part)) {
      const func = part.split('(')[0];
      const args = part.slice(func.length + 1, -1);

      const parsedArgs: number[] = [];
      let numberOfOpenBrackets = 0;
      let currentArg = '';
      for (let i = 0; i < args.length; i++) {
        const char = args[i];

        if (char === ',' && numberOfOpenBrackets === 0) {
          parsedArgs.push(parseExpression(currentArg));
          currentArg = '';
          continue;
        }

        currentArg += char;

        numberOfOpenBrackets += char === '(' ? 1 : 0;
        numberOfOpenBrackets -= char === ')' ? 1 : 0;
      }

      if (currentArg !== '') {
        parsedArgs.push(parseExpression(currentArg));
      }

      const isKeyOfMathMap = (key: string): key is keyof typeof MATH_MAP => key in MATH_MAP;

      const isZeroArg = (arr: number[]): arr is [] => arr.length === 0;
      const isSingleArg = (arr: number[]): arr is [number] => arr.length === 1;
      const isDoubleArg = (arr: number[]): arr is [number, number] => arr.length === 2;

      if (isKeyOfMathMap(func)) {
        const mappedFunc = MATH_MAP[func];

        if (isSingleArgumentFunction(mappedFunc) && isSingleArg(parsedArgs)) {
          return `${mappedFunc.apply(null, parsedArgs)}`;
        }

        if (isDoubleArgumentFunction(mappedFunc) && isDoubleArg(parsedArgs)) {
          return `${mappedFunc.apply(null, parsedArgs)}`;
        }

        if (isZeroArg(parsedArgs)) {
          return `${mappedFunc.apply(null, parsedArgs)}`;
        }

        console.error(`Function ${func} does not support ${parsedArgs.length} arguments.`);
        return NaN;
      }
    }

    return parseSingleMathValue(part);
  });

  // TODO why does it work with window.eval but not with eval?
  return window.eval(transformedParts.join(' '));
};

export const TestCssFunctions = () => {
  const elementsRef = useRef<HTMLDivElement | null>(null);
  const [measurements, setMeasurements] = useState<string[]>([]);

  const functions = [
    { func: 'sin', value: '30deg', type: 'number' },
    { func: 'sin', value: 'infinity', type: 'number' },
    { func: 'sin', value: 'asin(0.5)', type: 'number' },
    { func: 'cos', value: 'e / pi', type: 'number' },
    { func: 'tan', value: 'calc(0.3turn + 10009221420deg)', type: 'number' },
    { func: 'tan', value: '90deg', type: 'number' },
    { func: 'asin', value: '0.3', type: 'angle' },
    { func: 'asin', value: 'sin(33deg)', type: 'angle' },
    { func: 'acos', value: '-0.965', type: 'angle' },
    { func: 'atan', value: 'e / 2', type: 'angle' },
    { func: 'atan', value: 'infinity', type: 'angle' },
    { func: 'atan', value: 'tan(90deg)', type: 'angle' },
    { func: 'atan2', value: '7, -43', type: 'angle' },
    { func: 'atan2', value: 'infinity, infinity', type: 'angle' },
    { func: 'sin', value: 'cos(tan(cos(cos(sin(sin(cos(sin(cos(tan(tan(1 / cos(56deg))))))))))))', type: 'number' },
    { func: 'exp', value: 'pi', type: 'number' },
    { func: 'log', value: '8', type: 'number' },
    { func: 'pow', value: '0.3, 15', type: 'number' },
    { func: 'pow', value: '0, 0', type: 'number' },
    { func: 'pow', value: '-5, 0.3', type: 'number' },
    { func: 'pow', value: '1.000001, 200000', type: 'number' },
    { func: 'pow', value: '5, -3', type: 'number' },
    { func: 'pow', value: '0, -0', type: 'number' },
    { func: 'pow', value: '1, -1', type: 'number' },
    { func: 'pow', value: '-1, -1', type: 'number' },
    { func: 'pow', value: '0, 1', type: 'number' },
    { func: 'mod', value: '19rem, 5rem', type: 'number' },
    { func: 'rem', value: '18px, 5px', type: 'number' },
  ];

  useEffect(() => {
    const elementsWrapper = elementsRef.current;

    if (!elementsWrapper) return;

    const elements: ChildNode[] = [...elementsWrapper.childNodes];

    const data = elements.map((element, index) => {
      const computedStyle = window.getComputedStyle(element as Element);
      const angle = getRotationAngle(computedStyle.transform);
      const width = computedStyle.width;

      return angle !== 0 ? `${angle}deg` : width;
    });

    setMeasurements(data);
  }, []);

  return (
    <Section className={styles.cssFunctions} title="CSS functions">
      <div ref={elementsRef} className={styles.hiddenContainer}>
        {functions.map(({ func, type, value }, index) => {
          const expression = getExpression(func, value, type);
          const style = type === 'angle' ? { transform: expression } : { width: expression };

          return <div key={index} style={style} />;
        })}
      </div>
      <div className={styles.table}>
        <p>You can hover over expression to see it in full</p>
        <div className={styles.tableBody}>
          <span className={styles.tableHeaderCell}>Expression</span>
          <span className={styles.tableHeaderCell}>CSS value</span>
          <span className={styles.tableHeaderCell}>JS value</span>
          {functions.map(({ func, value, type }, index) => {
            const expression = getExpression(func, value, type);
            const jsResultNumerical = parseExpression(expression);

            const getJsResult = (res: number, type: string) => {
              if (Number.isNaN(res)) return 'NaN';
              if (type === 'angle') return `${(res * 180) / Math.PI}deg`;

              return `${res}px`;
            };

            const jsResult = getJsResult(jsResultNumerical, type);

            return (
              <Fragment key={index}>
                <span className={styles.expression} title={expression}>
                  {clearExpression(expression)}
                </span>
                <span>{measurements[index]}</span>
                <span>{jsResult}</span>
              </Fragment>
            );
          })}
        </div>
      </div>
    </Section>
  );
};
