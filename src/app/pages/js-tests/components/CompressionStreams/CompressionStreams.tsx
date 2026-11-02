import { useEffect, useState } from 'react';
import textData from '@data/blns.txt?raw';
import gzippedData from '@data/blns-gzipped.bin?url';
import styles from './styles.module.scss';
import { Container } from '@/app/components/Container/Container';
import { Badge } from '@/app/components/Badge/Badge';
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

  const renderResult = (success: boolean | null, errorMessage?: string) => {
    if (success === null) return <Badge>Pending</Badge>;
    if (success) return <Badge variant="success">Pass</Badge>;

    return (
      <>
        <Badge variant="danger">Fail</Badge>
        {errorMessage && <span className={styles.error}>{errorMessage}</span>}
      </>
    );
  };

  return (
    <Container gap={20} className={styles.container}>
      <div>
        <h2>Stream Decompression</h2>
        <div className={styles.results}>
          {streamDecompressionResult.map(({ name, errorMessage, success }) => (
            <div key={name}>
              <span>{name}</span>
              {renderResult(success, errorMessage)}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2>File Decompression</h2>
        <div className={styles.results}>
          <div>
            <span>gzip file</span>
            {renderResult(fileDecompressionResult.success, fileDecompressionResult.errorMessage)}
          </div>
        </div>
      </div>
    </Container>
  );
};
