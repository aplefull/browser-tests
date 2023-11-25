import { LOREM_TEXT } from './constants';
import { RootState } from '@/app/redux/store';
import { TDoubleArgumentFunction, TNoArgumentFunction, TResolution, TSingleArgumentFunction } from '@/types';
import { TRawEmoji } from '@/types';

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

    chunks.push(chunk);
  }

  if (noChunksOfSmallerSize) {
    if (chunks.length === 1) return chunks;

    const lastChunk = chunks[chunks.length - 1];

    if (lastChunk.length < chunkSize) {
      chunks[chunks.length - 2] = [...chunks[chunks.length - 2], ...lastChunk];
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

export const getPage = (title: string, pages: RootState['settings']['dropdowns']['pages']) => {
  const page = Object.entries(pages).find(([pageName, sections]) => {
    return sections.find((section) => section.name === title);
  }) as ['html' | 'css' | 'js' | 'misc', (typeof pages)['html']] | undefined;

  if (!page) {
    console.warn(`Page for title "${title}" not found in settings`);
    return 'html';
  }

  return page[0];
};

export const getCollapseState = (
  title: string,
  page: 'html' | 'css' | 'js' | 'misc',
  pages: RootState['settings']['dropdowns']['pages'],
) => {
  const state = pages[page].find((section) => {
    if (section.name === title) {
      return section.initialState;
    }
  });

  if (!state) {
    console.warn(`Section title "${title}" not found in settings`);
    return null;
  }

  return state.initialState;
};

export const saveSectionsState = (sections: RootState['settings']['dropdowns']['pages']) => {
  localStorage.setItem('settings-sections-state', JSON.stringify(sections));
};

export const getSectionsState = () => {
  const sectionsState = localStorage.getItem('settings-sections-state');
  return sectionsState
    ? JSON.parse(sectionsState)
    : {
        html: [],
        css: [],
        js: [],
        misc: [],
      };
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

export const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
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
