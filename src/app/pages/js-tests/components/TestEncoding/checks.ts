import { ENCODINGS, NON_STANDARD_LABELS } from './data';

type TCheck = {
  name: string;
  input?: string;
  expected: string;
  run: () => string | Promise<string>;
};

export type TCheckResult = Omit<TCheck, 'run'> & {
  actual: string;
  passed: boolean;
};

const errorName = (error: unknown) => (error instanceof Error ? error.name : String(error));

const show = (value: string) =>
  value.replace(/\p{C}/gu, (char) => `\\u{${char.codePointAt(0)?.toString(16).toUpperCase()}}`);

const hex = (bytes: Iterable<number>) =>
  Array.from(bytes, (byte) => byte.toString(16).toUpperCase().padStart(2, '0')).join(' ');

const decode = (label: string, bytes: number[], options?: TextDecoderOptions) =>
  show(new TextDecoder(label, options).decode(Uint8Array.from(bytes)));

const readAll = async <T>(stream: ReadableStream<T>) => {
  const chunks: T[] = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return chunks;
};

const toStream = <T>(chunks: T[]) =>
  new ReadableStream<T>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
      controller.close();
    },
  });

const decodeStream = async (label: string, chunks: number[][]) => {
  const stream = toStream(chunks.map((chunk) => Uint8Array.from(chunk))).pipeThrough(new TextDecoderStream(label));

  return show((await readAll(stream)).join(''));
};

const encodeStream = async (chunks: string[]) => {
  const stream = toStream(chunks).pipeThrough(new TextEncoderStream());

  return hex((await readAll(stream)).flatMap((chunk) => Array.from(chunk)));
};

const encodeInto = (text: string, size: number) => {
  const { read, written } = new TextEncoder().encodeInto(text, new Uint8Array(size));

  return `read: ${read}, written: ${written}`;
};

const labelChecks = (): TCheck[] =>
  ENCODINGS.flatMap(({ name, labels }) =>
    labels.map((label) => ({
      name: label,
      expected: name === 'replacement' ? 'RangeError' : name.toLowerCase(),
      run: () => new TextDecoder(label).encoding,
    })),
  );

const nonStandardLabelChecks = (): TCheck[] =>
  NON_STANDARD_LABELS.map((label) => ({
    name: label,
    expected: 'RangeError',
    run: () => new TextDecoder(label).encoding,
  }));

const DECODING_SAMPLES: [string, number[], string][] = [
  ['UTF-8', [0xe2, 0x82, 0xac], '€'],
  ['IBM866', [0x80], 'А'],
  ['ISO-8859-2', [0xa1], 'Ą'],
  ['ISO-8859-3', [0xa1], 'Ħ'],
  ['ISO-8859-4', [0xa1], 'Ą'],
  ['ISO-8859-5', [0xb0], 'А'],
  ['ISO-8859-6', [0xc7], 'ا'],
  ['ISO-8859-7', [0xc1], 'Α'],
  ['ISO-8859-8', [0xe0], 'א'],
  ['ISO-8859-8-I', [0xe0], 'א'],
  ['ISO-8859-10', [0xa1], 'Ą'],
  ['ISO-8859-13', [0xa1], '”'],
  ['ISO-8859-14', [0xa1], 'Ḃ'],
  ['ISO-8859-15', [0xa4], '€'],
  ['ISO-8859-16', [0xa1], 'Ą'],
  ['KOI8-R', [0xc1], 'а'],
  ['KOI8-U', [0xa4], 'є'],
  ['macintosh', [0x80], 'Ä'],
  ['windows-874', [0xa1], 'ก'],
  ['windows-1250', [0x8a], 'Š'],
  ['windows-1251', [0xc0], 'А'],
  ['windows-1252', [0x80], '€'],
  ['windows-1253', [0xc1], 'Α'],
  ['windows-1254', [0xd0], 'Ğ'],
  ['windows-1255', [0xe0], 'א'],
  ['windows-1256', [0xc7], 'ا'],
  ['windows-1257', [0xc0], 'Ą'],
  ['windows-1258', [0xc3], 'Ă'],
  ['x-mac-cyrillic', [0x80], 'А'],
  ['GBK', [0xc4, 0xe3], '你'],
  ['gb18030', [0x81, 0x30, 0x81, 0x30], '\\u{80}'],
  ['Big5', [0xa4, 0x40], '一'],
  ['EUC-JP', [0xc6, 0xfc], '日'],
  ['ISO-2022-JP', [0x1b, 0x24, 0x42, 0x46, 0x7c, 0x1b, 0x28, 0x42], '日'],
  ['Shift_JIS', [0x93, 0xfa], '日'],
  ['EUC-KR', [0xc7, 0xd1], '한'],
  ['UTF-16BE', [0x00, 0x41], 'A'],
  ['UTF-16LE', [0x41, 0x00], 'A'],
  ['x-user-defined', [0x80], '\\u{F780}'],
];

const decodingChecks = (): TCheck[] =>
  DECODING_SAMPLES.map(([label, bytes, expected]) => ({
    name: label,
    input: hex(bytes),
    expected,
    run: () => decode(label, bytes),
  }));

const apiChecks = (): TCheck[] => [
  { name: 'Default encoding', input: '', expected: 'utf-8', run: () => new TextDecoder().encoding },
  {
    name: 'Label trimming',
    input: '\\t UTF-8 \\n',
    expected: 'utf-8',
    run: () => new TextDecoder('\t UTF-8 \n').encoding,
  },
  {
    name: 'Non-ASCII whitespace',
    input: '\\u{A0}utf-8',
    expected: 'RangeError',
    run: () => new TextDecoder(' utf-8').encoding,
  },
  { name: 'Invalid byte', input: 'FF', expected: '�', run: () => decode('utf-8', [0xff]) },
  { name: 'Truncated sequence', input: 'E2 82', expected: '�', run: () => decode('utf-8', [0xe2, 0x82]) },
  {
    name: 'fatal',
    input: 'FF',
    expected: 'TypeError',
    run: () => decode('utf-8', [0xff], { fatal: true }),
  },
  { name: 'UTF-8 BOM', input: 'EF BB BF 41', expected: 'A', run: () => decode('utf-8', [0xef, 0xbb, 0xbf, 0x41]) },
  {
    name: 'ignoreBOM',
    input: 'EF BB BF 41',
    expected: '\\u{FEFF}A',
    run: () => decode('utf-8', [0xef, 0xbb, 0xbf, 0x41], { ignoreBOM: true }),
  },
  {
    name: 'UTF-16LE BOM',
    input: 'FF FE 41 00',
    expected: 'A',
    run: () => decode('utf-16le', [0xff, 0xfe, 0x41, 0x00]),
  },
  {
    name: 'No BOM sniffing',
    input: 'FF FE 41 00',
    expected: '��A\\u{0}',
    run: () => decode('utf-8', [0xff, 0xfe, 0x41, 0x00]),
  },
  {
    name: 'stream option',
    input: 'E2 82 | AC',
    expected: '€',
    run: () => {
      const decoder = new TextDecoder();

      return decoder.decode(Uint8Array.from([0xe2, 0x82]), { stream: true }) + decoder.decode(Uint8Array.from([0xac]));
    },
  },
  { name: 'TextEncoder encoding', input: '', expected: 'utf-8', run: () => new TextEncoder().encoding },
  { name: 'encode', input: '€', expected: 'E2 82 AC', run: () => hex(new TextEncoder().encode('€')) },
  {
    name: 'encode lone surrogate',
    input: '\\u{D800}',
    expected: 'EF BF BD',
    run: () => hex(new TextEncoder().encode('\ud800')),
  },
  { name: 'encodeInto', input: "'a€', 4 bytes", expected: 'read: 2, written: 4', run: () => encodeInto('a€', 4) },
  {
    name: 'encodeInto, no room',
    input: "'€', 2 bytes",
    expected: 'read: 0, written: 0',
    run: () => encodeInto('€', 2),
  },
  {
    name: 'encodeInto, surrogate pair',
    input: "'😀', 4 bytes",
    expected: 'read: 2, written: 4',
    run: () => encodeInto('😀', 4),
  },
  {
    name: 'TextDecoderStream',
    input: 'E2 82 | AC',
    expected: '€',
    run: () => decodeStream('utf-8', [[0xe2, 0x82], [0xac]]),
  },
  {
    name: 'TextDecoderStream, Shift_JIS',
    input: '93 | FA',
    expected: '日',
    run: () => decodeStream('shift_jis', [[0x93], [0xfa]]),
  },
  {
    name: 'TextEncoderStream',
    input: '\\u{D83D} | \\u{DE00}',
    expected: 'F0 9F 98 80',
    run: () => encodeStream(['\ud83d', '\ude00']),
  },
];

const runChecks = (checks: TCheck[]) =>
  Promise.all(
    checks.map(async ({ run, ...check }): Promise<TCheckResult> => {
      let actual: string;

      try {
        actual = await run();
      } catch (error) {
        actual = errorName(error);
      }

      return { ...check, actual, passed: actual === check.expected };
    }),
  );

export const runEncodingChecks = async () => ({
  labels: await runChecks(labelChecks()),
  nonStandardLabels: await runChecks(nonStandardLabelChecks()),
  decoding: await runChecks(decodingChecks()),
  api: await runChecks(apiChecks()),
});
