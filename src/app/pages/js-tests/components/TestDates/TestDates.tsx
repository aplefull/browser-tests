import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import styles from './styles.module.scss';
import { Select } from '@/app/components/Select/Select';
import { useEffect, useState } from 'react';

const selectOptions = ['now', 'date 0'];

export const TestDates = () => {
  const [now, setNow] = useState(new Date());
  const [selectOption, setSelectOption] = useState(selectOptions[0]);

  const getTableData = (date: Date) => ({
    getDate: date.getDate(),
    getDay: date.getDay(),
    getFullYear: date.getFullYear(),
    getHours: date.getHours(),
    getMilliseconds: date.getMilliseconds(),
    getMinutes: date.getMinutes(),
    getMonth: date.getMonth(),
    getSeconds: date.getSeconds(),
    getTime: date.getTime(),
    getTimezoneOffset: date.getTimezoneOffset(),
    getUTCDate: date.getUTCDate(),
    getUTCDay: date.getUTCDay(),
    getUTCFullYear: date.getUTCFullYear(),
    getUTCHours: date.getUTCHours(),
    getUTCMilliseconds: date.getUTCMilliseconds(),
    getUTCMinutes: date.getUTCMinutes(),
    getUTCMonth: date.getUTCMonth(),
    getUTCSeconds: date.getUTCSeconds(),
    getYear: date.getFullYear(),
    toDateString: date.toDateString(),
    toISOString: date.toISOString(),
    toJSON: date.toJSON(),
    toLocaleDateString: date.toLocaleDateString(),
    toLocaleString: date.toLocaleString(),
    toLocaleTimeString: date.toLocaleTimeString(),
    toString: date.toString(),
    toTimeString: date.toTimeString(),
    toUTCString: date.toUTCString(),
    valueOf: date.valueOf(),
  });

  const formatDate = (date: Date) => {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const date = selectOption === 'now' ? now : new Date(-62167219200000);

  return (
    <div>
      <Select className={styles.select} options={selectOptions} onChange={setSelectOption} value={selectOption} />
      <div className={styles.json}>
        <Json data={getTableData(date)} />
      </div>
      <div className={styles.special}>
        <p>And some fun values (hover over the value to see what produced it):</p>
        <span>Max year:</span>
        <pre title="Formatted new Date(275760, 0)">{formatDate(new Date(275760, 0))}</pre>
        <span>Big bang:</span>
        <pre title="Formatted new Date(-62167219200000)">{formatDate(new Date(-62167229951000))}</pre>
        <pre title="new Date(-62167219200000).toUTCString()">{new Date(-62167219200000).toUTCString()}</pre>
        <pre title="new Date('0000-01-01').toUTCString()">{new Date('0000-01-01').toUTCString()}</pre>
        <pre title="new Date(-62167229951000).toString()">{new Date(-62167229951000).toString()}</pre>
      </div>
    </div>
  );
};
