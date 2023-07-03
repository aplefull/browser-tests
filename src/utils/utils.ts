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

export const CSS = {
  px: (n: number) => `${n}px`,
  p: (n: number) => `${n}%`,
  em: (n: number) => `${n}em`,
  rem: (n: number) => `${n}rem`,
  scale: (n: number) => `scale(${n})`,
  translate: (x: number | string, y: number | string) => `translate(${x}, ${y})`,
  transform: (...transforms: string[]) => transforms.join(' '),
};
