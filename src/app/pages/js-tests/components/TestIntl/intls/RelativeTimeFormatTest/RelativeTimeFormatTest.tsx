import { useEffect, useMemo, useState } from 'react';
import allLocales from '@assets/data/locales.json';
import { getErrorMessage, isOneOf, nextElement, prevElement } from '@/utils/utils';
import styles from '@/app/pages/js-tests/components/TestIntl/styles.module.scss';
import { NumberInput } from '@/app/components/NumberInput/NumberInput';
import { Code } from '@/app/components/Code/Code';
import {
  createSelects,
  getSupportedLocales,
  getSupportedLocalesAsync,
  SelectsLayout,
} from '@/app/pages/js-tests/components/TestIntl/TestIntl';

export const RelativeTimeFormatTest = () => {
  const [currentLocale, setCurrentLocale] = useState(new Intl.RelativeTimeFormat().resolvedOptions().locale);
  const [supportedLocales, setSupportedLocales] = useState([currentLocale]);
  const [intlOptions, setIntlOptions] = useState<Intl.RelativeTimeFormatOptions>({
    numeric: 'auto',
    style: 'long',
  });
  const [unit, setUnit] = useState<Intl.RelativeTimeFormatUnit>('day');
  const [value, setValue] = useState(10);

  const intl = new Intl.RelativeTimeFormat(currentLocale, intlOptions);

  const values = {
    numeric: {
      label: 'Numeric',
      options: ['auto', 'always'] as const,
      value: intlOptions.numeric,
    },
    style: {
      label: 'Style',
      options: ['long', 'short', 'narrow'] as const,
      value: intlOptions.style,
    },
    unit: {
      label: 'Unit',
      options: [
        'year',
        'years',
        'quarter',
        'quarters',
        'month',
        'months',
        'week',
        'weeks',
        'day',
        'days',
        'hour',
        'hours',
        'minute',
        'minutes',
        'second',
        'seconds',
      ] as const,
      value: unit,
    },
  };

  const setNumericOption = (numeric: string) => {
    if (isOneOf(numeric, values.numeric.options)) {
      setIntlOptions((options) => ({ ...options, numeric }));
    }
  };

  const setStyleOption = (style: string) => {
    if (isOneOf(style, values.style.options)) {
      setIntlOptions((options) => ({ ...options, style }));
    }
  };

  const setUnitOption = (unit: string) => {
    if (isOneOf(unit, values.unit.options)) {
      setUnit(unit);
    }
  };

  const handlers = {
    numeric: setNumericOption,
    style: setStyleOption,
    unit: setUnitOption,
  };

  const selects = createSelects(values, handlers);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const getFormattedString = (value: number) => {
    try {
      return intl.format(value || 0, unit);
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  useEffect(() => {
    getSupportedLocalesAsync(Intl.DisplayNames).then(setSupportedLocales);
  }, []);

  return (
    <div className={styles.testContainer}>
      <h2>RelativeTimeFormat</h2>
      <SelectsLayout
        totalLocales={allLocales.length}
        supportedLocales={supportedLocales.length}
        selects={selects}
        onNext={onNext}
        onPrev={onPrev}
        selectOptions={supportedLocales}
        selectValue={currentLocale}
        onSelectChange={setCurrentLocale}
      />
      <NumberInput className={styles.numberInput} onChange={setValue} value={value} />
      <div>
        <Code>{getFormattedString(value)}</Code>
      </div>
    </div>
  );
};
