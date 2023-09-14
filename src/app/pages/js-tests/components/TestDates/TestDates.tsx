import { Section } from '@/app/components/Section/Section';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

export const TestDates = () => {
  const now = new Date(-62167219200000);

  console.dir(now);

  const tableData = {
    getDate: now.getDate(),
    getDay: now.getDay(),
    getFullYear: now.getFullYear(),
    getHours: now.getHours(),
    getMilliseconds: now.getMilliseconds(),
    getMinutes: now.getMinutes(),
    getMonth: now.getMonth(),
    getSeconds: now.getSeconds(),
    getTime: now.getTime(),
    getTimezoneOffset: now.getTimezoneOffset(),
    getUTCDate: now.getUTCDate(),
    getUTCDay: now.getUTCDay(),
    getUTCFullYear: now.getUTCFullYear(),
    getUTCHours: now.getUTCHours(),
    getUTCMilliseconds: now.getUTCMilliseconds(),
    getUTCMinutes: now.getUTCMinutes(),
    getUTCMonth: now.getUTCMonth(),
    getUTCSeconds: now.getUTCSeconds(),
    getYear: now.getFullYear(),
    toDateString: now.toDateString(),
    toISOString: now.toISOString(),
    toJSON: now.toJSON(),
    toLocaleDateString: now.toLocaleDateString(),
    toLocaleString: now.toLocaleString(),
    toLocaleTimeString: now.toLocaleTimeString(),
    toString: now.toString(),
    toTimeString: now.toTimeString(),
    toUTCString: now.toUTCString(),
    valueOf: now.valueOf(),
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(2, '0');

    return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <Section title="Dates">
      <Json data={tableData} />
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <span>{new Date(-62167219200000).toUTCString()}</span>
        <span>{new Date(-62167229951000).toString()}</span>
        <span>{new Date(-62167219200000).getTimezoneOffset()}</span>
        <span>{(new Date('0001-01-01')).toUTCString()}</span>
        <span>{(new Date(275760, 0)).toString()}</span>
        <span>{new Date(275760, 0).toDateString()}</span>
        <span>{new Date(275760, 0).toUTCString()}</span>
        <span>{formatDate(new Date(275760, 0))}</span>
        <span>{formatDate(new Date(-62167229951000))}</span>
      </div>
    </Section>
  );
};
