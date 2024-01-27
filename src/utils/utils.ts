import { LOREM_TEXT, PAGES } from './constants';
import { RootState } from '@/app/redux/store';
import {
  TDoubleArgumentFunction,
  TNoArgumentFunction,
  TRawEmoji,
  TResolution,
  TSettingsPages,
  TSingleArgumentFunction,
} from '@/types';

export const lorem = (n: number, start = 0) => {
  const sentences = LOREM_TEXT.split(/(?<=[.?!])\s+/);
  return sentences.slice(start, start + n).join(' ');
};

export const range = (from: number, to?: number, step = 1) => {
  if ((to && to < from) || step <= 0) {
    return [];
  }

  if (to === undefined) {
    to = from;
    from = 0;
  }

  const isStepInteger = Number.isInteger(step);
  const values = [];
  for (let i = from; i <= to; i += step) {
    const value = isStepInteger ? i : parseFloat(i.toFixed(5));
    values.push(value);
  }

  return values;
};

export const table = (x: number[], y: number[]) => {
  const table: { x: number; y: number }[][] = [];

  for (let i = 0; i < x.length; i++) {
    const row: { x: number; y: number }[] = [];

    for (let j = 0; j < y.length; j++) {
      const result = {
        x: x[i],
        y: y[j],
      };

      row.push(result);
    }

    table.push(row);
  }

  return table;
};

export const splitIntoChunks = <T>(arr: T[], chunkSize: number, noChunksOfSmallerSize = false) => {
  const chunks: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  if (noChunksOfSmallerSize) {
    if (chunks.length === 1) return chunks;

    const lastChunk = chunks[chunks.length - 1];

    if (lastChunk.length < chunkSize) {
      chunks[chunks.length - 2].push(...lastChunk);
      chunks.pop();
    }
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

// same as object-fit: contain
export const fitToBox = (originalWidth: number, originalHeight: number, boxWidth: number, boxHeight: number) => {
  const originalAspectRatio = originalWidth / originalHeight;
  const boxAspectRatio = boxWidth / boxHeight;

  if (originalAspectRatio > boxAspectRatio) {
    return {
      width: boxWidth,
      height: boxWidth / originalAspectRatio,
    };
  }

  return {
    width: boxHeight * originalAspectRatio,
    height: boxHeight,
  };
};

export const getPage = (title: string, pages: RootState['settings']['dropdowns']['pages']): TSettingsPages | null => {
  const isPageType = (page: string): page is TSettingsPages => {
    for (const pageType of ['html', 'css', 'js', 'misc']) {
      if (pageType === page) return true;
    }

    return false;
  };

  const values = Object.values(pages);
  const entries = Object.entries(pages);

  // Check if all pages are 0 length. If so, data is not loaded yet.
  const allPagesEmpty = values.every((page) => page.length === 0);

  if (allPagesEmpty) return null;

  const page = entries.find(([_, sections]) => {
    return sections.find((section) => section.name === title);
  });

  if (!page || !isPageType(page[0])) {
    console.warn(`Page for title "${title}" not found in settings`);
    return null;
  }

  return page[0];
};

export const getCollapseState = (
  title: string,
  page: TSettingsPages,
  pages: RootState['settings']['dropdowns']['pages'],
) => {
  const state = pages[page].find((section) => {
    if (section.name === title) {
      return section.initialState;
    }
  });

  if (!state) {
    console.warn(`Section with title "${title}" is not found on page "${page}" in settings`);
    return null;
  }

  return state.initialState;
};

export const saveSectionsState = (sections: RootState['settings']['dropdowns']['pages']) => {
  localStorage.setItem('settings-sections-state', JSON.stringify(sections));
};

export const iteratorToArray = <T>(iterator: IterableIterator<T>) => {
  const arr: T[] = [];

  for (const item of iterator) {
    arr.push(item);
  }

  return arr;
};

export const clamp = (value: number, min?: number, max?: number) => {
  const localMin = min ?? -Infinity;
  const localMax = max ?? Infinity;

  return Math.min(Math.max(value, localMin), localMax);
};

export const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const clone = { ...obj };

  keys.forEach((key) => {
    delete clone[key];
  });

  return clone;
};

export const isZeroArgumentsFunction = (
  func: TSingleArgumentFunction | TDoubleArgumentFunction | TNoArgumentFunction,
): func is TNoArgumentFunction => func.length === 0;

export const isSingleArgumentFunction = (
  func: TSingleArgumentFunction | TDoubleArgumentFunction | TNoArgumentFunction,
): func is TSingleArgumentFunction => func.length === 1;

export const isDoubleArgumentFunction = (
  func: TSingleArgumentFunction | TDoubleArgumentFunction | TNoArgumentFunction,
): func is TDoubleArgumentFunction => func.length === 2;

export const requestEmojis = async () => {
  const emojiListUrl = 'https://unpkg.com/emoji.json@14.0.0/emoji.json';

  const response = await fetch(emojiListUrl);
  const data: TRawEmoji[] = await response.json();

  return data;
};

export const nextElement = <T>(elements: T[] | readonly T[], currentElement: T): T => {
  const currentIndex = elements.indexOf(currentElement);
  const nextIndex = currentIndex === elements.length - 1 ? 0 : currentIndex + 1;
  return elements[nextIndex];
};

export const prevElement = <T>(elements: T[], currentElement: T): T => {
  const currentIndex = elements.indexOf(currentElement);
  const prevIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
  return elements[prevIndex];
};

export const stringify = (data: unknown) => {
  if (typeof data === 'string') {
    return data;
  }

  if (typeof data === 'number') {
    return data.toString();
  }

  if (typeof data === 'boolean') {
    return data.toString();
  }

  if (typeof data === 'undefined') {
    return 'undefined';
  }

  if (data === null) {
    return 'null';
  }

  if (Number.isNaN(data)) {
    return 'NaN';
  }

  if (data === Infinity) {
    return 'Infinity';
  }

  if (data === -Infinity) {
    return '-Infinity';
  }

  if (typeof data === 'bigint') {
    return data.toString();
  }

  if (typeof data === 'symbol') {
    return data.toString();
  }

  return JSON.stringify(data, null, 2);
};

export const copy = async (text: unknown) => {
  try {
    await navigator.clipboard.writeText(stringify(text));
  } catch (error) {
    console.error(error);
  }
};

export const getVideoResolution = async (video: string) => {
  const videoElement = document.createElement('video');
  videoElement.src = video;
  videoElement.preload = 'metadata';

  return new Promise<TResolution>((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    };
  });
};

export const getCurrentPage = () => {
  const currentPage = window.location.pathname.split('/')[1];

  const values = Object.values(PAGES);

  for (const value of values) {
    if (value === currentPage) {
      return value;
    }
  }

  return PAGES.UNKNOWN;
};

export const generateRandomString = (length: number) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetUpper = alphabet.toUpperCase();
  const numbers = '0123456789';

  const pool = alphabet + alphabetUpper + numbers;

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result += pool[randomIndex];
  }

  return result;
};

export const calculateThumbPosition = (
  value: number,
  min: number,
  max: number,
  thumbWidth: number,
  containerWidth: number,
) => {
  const minPosition = (((thumbWidth || 0) / (containerWidth || 1)) * 100) / 2;
  const maxPosition = 100 - minPosition;
  return map(value, min, max, minPosition, maxPosition);
};

export const isSharedWorkerGlobalScope = (self: unknown): self is SharedWorkerGlobalScope => {
  return typeof self === 'object' && self !== null && 'onconnect' in self;
};

export const isServiceWorkerGlobalScope = (self: unknown): self is ServiceWorkerGlobalScope => {
  return typeof self === 'object' && self !== null && 'clients' in self;
};

export const isArrayOfArrays = <T>(array: T[] | T[][]): array is T[][] => {
  return Array.isArray(array[0]);
};

export const getArray = <T>(array: T[] | T[][]): T[] => {
  if (isArrayOfArrays(array)) {
    return array.flat();
  }

  return array;
};

export const isOneOf = <T extends string | boolean | number | undefined>(
  value: string | boolean | number | undefined,
  values: readonly T[],
): value is T => {
  for (const item of values) {
    if (item === value) {
      return true;
    }
  }

  return false;
};

export const isKeyOf = <T extends object>(value: string | number | symbol, obj: T): value is keyof T => {
  return value in obj;
};

export const isNode = (target: EventTarget | null): target is Node => {
  return target instanceof Node;
};

export const noop = () => {};

export const sleep = async (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const getImageBitmap = async (url: string) => {
  const image = new Image();
  image.src = url;
  await image.decode();

  return await createImageBitmap(image);
};
