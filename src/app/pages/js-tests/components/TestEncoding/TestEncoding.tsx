import { useEffect, useState } from 'react';
import { Container } from '@/app/components/Container/Container';
import { Table } from '@/app/components/Table/Table';
import { Badge } from '@/app/components/Badge/Badge';
import { runEncodingChecks, TCheckResult } from './checks';
import styles from './styles.module.scss';

type TResults = Awaited<ReturnType<typeof runEncodingChecks>>;

type TCheckTableProps = {
  title: string;
  nameHeader: string;
  inputHeader?: string;
  results: TCheckResult[];
};

const CheckTable = ({ title, nameHeader, inputHeader, results }: TCheckTableProps) => {
  const passed = results.filter((result) => result.passed).length;

  const columns = [
    { key: 'name', header: nameHeader, width: '160px' },
    ...(inputHeader ? [{ key: 'input', header: inputHeader, width: '120px' }] : []),
    { key: 'expected', header: 'Expected', width: '120px' },
    { key: 'actual', header: 'Actual', width: '120px' },
    { key: 'result', header: 'Result', width: '70px', align: 'center' as const },
  ];

  const data = results.map(({ name, input, expected, actual, passed }) => ({
    name,
    input,
    expected,
    actual,
    result: <Badge variant={passed ? 'success' : 'danger'}>{passed ? 'Pass' : 'Fail'}</Badge>,
  }));

  return (
    <div>
      <h2>{title}</h2>
      <span className={styles.summary}>
        Passed: {passed}/{results.length}
      </span>
      <Table columns={columns} data={data} maxHeight={300} compact />
    </div>
  );
};

export const TestEncoding = () => {
  const [results, setResults] = useState<TResults | null>(null);

  useEffect(() => {
    runEncodingChecks().then(setResults).catch(console.error);
  }, []);

  if (!results) return <Badge>Pending</Badge>;

  return (
    <Container gap={20} className={styles.encoding}>
      <CheckTable title="TextDecoder and TextEncoder" nameHeader="Case" inputHeader="Input" results={results.api} />
      <CheckTable title="Decoding" nameHeader="Encoding" inputHeader="Bytes" results={results.decoding} />
      <CheckTable title="Standard labels" nameHeader="Label" results={results.labels} />
      <CheckTable title="Non-standard labels" nameHeader="Label" results={results.nonStandardLabels} />
    </Container>
  );
};
