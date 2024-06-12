import { useEffect, useState } from 'react';
import textData from '@data/blns.txt?raw';
import gzippedData from '@data/blns-gzipped.txt?url';
import styles from './styles.module.scss';
import { Container } from '@/app/components/Container/Container';
import classNames from 'classnames';
import { getErrorMessage } from '@utils';

const readTextFromStream = async (stream: ReadableStream<Uint8Array>) => {
  const reader = stream.getReader();

  let result = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    result += new TextDecoder().decode(value);
  }

  reader.releaseLock();

  return result;
};

const testStreams = async (algorithm: 'gzip' | 'deflate' | 'deflate-raw') => {
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(textData);

  const readableStreamForReader = new ReadableStream({
    start(controller) {
      controller.enqueue(encodedText);
      controller.close();
    },
  });

  const readableStreamForResponse = new ReadableStream({
    start(controller) {
      controller.enqueue(encodedText);
      controller.close();
    },
  });

  const compressedStreamForReader = readableStreamForReader.pipeThrough(new CompressionStream(algorithm));
  const compressedStreamForResponse = readableStreamForResponse.pipeThrough(new CompressionStream(algorithm));
  const decompressedStreamForReader = compressedStreamForReader.pipeThrough(new DecompressionStream(algorithm));
  const decompressedStreamForResponse = compressedStreamForResponse.pipeThrough(new DecompressionStream(algorithm));

  const textFromStream = await readTextFromStream(decompressedStreamForReader);
  const text = await new Response(decompressedStreamForResponse).text();

  return text === textData && textFromStream === textData;
};

const testFileDecompression = async () => {
  const res = await fetch(gzippedData);
  const compressed = await res.arrayBuffer();
  const blob = new Blob([compressed]);
  const readableStream = blob.stream();
  const decompressedStream = readableStream.pipeThrough(new DecompressionStream('gzip'));

  const text = await new Response(decompressedStream).text();

  return textData === text;
};

type TTestResult = {
  name: string;
  success: boolean | null;
  errorMessage?: string;
};

export const CompressionStreams = () => {
  const [fileDecompressionResult, setFileDecompressionResult] = useState<TTestResult>({
    name: 'file',
    success: null,
  });
  const [streamDecompressionResult, setStreamDecompressionResult] = useState<TTestResult[]>([]);

  useEffect(() => {
    const test = async () => {
      setStreamDecompressionResult([]);
      setFileDecompressionResult({ name: 'file', success: null });

      (['gzip', 'deflate', 'deflate-raw'] as const).map(async (algorithm) => {
        try {
          const result = await testStreams(algorithm);
          setStreamDecompressionResult((prev) => [...prev, { name: algorithm, success: result }]);
        } catch (error) {
          setStreamDecompressionResult((prev) => [
            ...prev,
            { name: algorithm, success: false, errorMessage: getErrorMessage(error) },
          ]);
        }
      });

      try {
        const result = await testFileDecompression();

        setFileDecompressionResult({ name: 'file', success: result });
      } catch (error) {
        setFileDecompressionResult({ name: 'file', success: false, errorMessage: getErrorMessage(error) });
      }
    };

    test().catch(console.error);
  }, []);

  return (
    <Container gap={20} className={styles.container}>
      <div>
        <h2>Stream Decompression</h2>
        <div className={styles.results}>
          {streamDecompressionResult.map(({ name, errorMessage, success }) => (
            <div key={name} className={styles.resultRow}>
              <span>{name}:</span>
              <span className={classNames(styles.result, { [styles.success]: success, [styles.error]: !success })}>
                {success === null ? 'Pending' : success ? 'Success' : `Error: ${errorMessage}`}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>File Decompression</h2>
        <div className={styles.results}>
          <span
            className={classNames(styles.result, {
              [styles.success]: fileDecompressionResult.success,
              [styles.error]: !fileDecompressionResult.success,
            })}
          >
            {fileDecompressionResult.success === null
              ? 'Pending'
              : fileDecompressionResult.success
                ? 'Success'
                : `Error: ${fileDecompressionResult.errorMessage}`}
          </span>
        </div>
      </div>
    </Container>
  );
};
