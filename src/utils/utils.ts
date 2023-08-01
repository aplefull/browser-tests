import { LOREM_TEXT } from './constants';

export const lorem = (n: number, start = 0) => {
  const sentences = LOREM_TEXT.split(/(?<=[.?!])\s+/);
  return sentences.slice(start, start + n).join(' ');
};

export const range = (n: number) => {
  return [...Array(n).keys()].map((i) => i + 1);
};

export const splitIntoChunks = <T>(arr: T[], chunkSize: number, noChunksOfSmallerSize: boolean = false) => {
  const chunks = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);

    if (noChunksOfSmallerSize && chunk.length < chunkSize) {
      chunks[chunks.length - 1].push(...chunk);
      break;
    }

    chunks.push(chunk);
  }

  return chunks;
};

export const getDataFromBlns = (blns: string) => {
  const lines = blns.split('\n').filter((line) => line !== '');

  const groupedLines = lines.reduce<string[][]>((acc, curr) => {
    if (acc.length === 0) {
      return [[curr]];
    }

    const isPrevDescription = acc[acc.length - 1][0].startsWith('#');
    const isCurrDescription = curr.startsWith('#');
    const areEqual = isPrevDescription === isCurrDescription;

    if (areEqual) {
      acc[acc.length - 1].push(curr);
      return acc;
    }

    acc.push([curr]);
    return acc;
  }, []);

  type TBlnsData = {
    description: string;
    strings: string[];
  };

  return groupedLines.reduce<TBlnsData[]>((acc, curr, index) => {
    if (index % 2 === 0) {
      acc.push({
        description: curr
          .map((d) => d.slice(1).trim())
          .join('\n')
          .trim(),
        strings: [],
      });
      return acc;
    }

    acc[acc.length - 1].strings = curr;
    return acc;
  }, []);
};

export const CSS = {
  px: (n: number) => `${n}px`,
  p: (n: number) => `${n}%`,
  em: (n: number) => `${n}em`,
  rem: (n: number) => `${n}rem`,
  scale: (n: number) => `scale(${n})`,
  translate: (x: number | string, y: number | string) => `translate(${x}, ${y})`,
  transform: (...transforms: string[]) => transforms.join(' '),
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getErrorMessage = (error: unknown, defaultError?: string) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Object && 'message' in error && typeof error.message === 'string' && error.message !== '') {
    return error.message;
  }

  return defaultError || 'Unknown error';
};

export const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
