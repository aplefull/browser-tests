import { TSubtleCryptoResult } from './TestCrypto';
import { getErrorMessage } from '@/utils/utils';

type CryptoTest = {
  name: string;
  method: (message: string) => Promise<unknown>;
};

export const runCryptoTests = async (
  tests: CryptoTest[],
  message: string,
  setResults: React.Dispatch<React.SetStateAction<TSubtleCryptoResult[]>>,
) => {
  const initialResults = tests.map((test) => ({
    text: test.name,
    type: 'waiting' as const,
  }));

  setResults(initialResults);

  tests.forEach(async (test, index) => {
    try {
      const startTime = performance.now();
      await test.method(message);
      const endTime = performance.now();
      const duration = endTime - startTime;

      setResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = { text: test.name, type: 'success', duration };
        return newResults;
      });
    } catch (error) {
      setResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = { text: getErrorMessage(error), type: 'error' };
        return newResults;
      });
    }
  });
};
