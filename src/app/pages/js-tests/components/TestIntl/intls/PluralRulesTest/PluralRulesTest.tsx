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

export const PluralRulesTest = () => {
  const [testNumber, setTestNumber] = useState(10);
  const [currentLocale, setCurrentLocale] = useState(new Intl.PluralRules().resolvedOptions().locale);
  const [supportedLocales, setSupportedLocales] = useState([currentLocale]);
  const [intlOptions, setIntlOptions] = useState<Intl.PluralRulesOptions>({
    type: 'cardinal',
  });

  const intl = new Intl.PluralRules(currentLocale, intlOptions);

  const values = {
    type: {
      label: 'Type',
      options: ['cardinal', 'ordinal'] as const,
      value: intlOptions.type,
    },
  };

  const setTypeOption = (type: string) => {
    if (isOneOf(type, values.type.options)) {
      setIntlOptions((options) => ({ ...options, type }));
    }
  };

  const handlers = {
    type: setTypeOption,
  };

  const selects = createSelects(values, handlers);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const formatString = (value: number) => {
    try {
      const suffixes = new Map([
        ['zero', 'th'],
        ['one', 'st'],
        ['two', 'nd'],
        ['few', 'rd'],
        ['many', 'th'],
        ['other', 'th'],
      ]);

      const select = intl.select(value);
      const suffix = suffixes.get(select);
      const example =
        value === Infinity || value === -Infinity || Number.isNaN(value) ? '' : `(Example: ${value}${suffix})`;

      return `${value} -> ${select} ${example}`;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  useEffect(() => {
    getSupportedLocalesAsync(Intl.DisplayNames).then(setSupportedLocales);
  }, []);

  return (
    <div className={styles.testContainer}>
      <h2>PluralRules</h2>
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
      <NumberInput className={styles.numberInput} onChange={setTestNumber} value={testNumber} />
      <div className={styles.pluralRules}>
        <Code className={styles.pluralRulesCode}>{formatString(-Infinity)}</Code>
        <Code className={styles.pluralRulesCode}>{formatString(testNumber)}</Code>
        <Code className={styles.pluralRulesCode}>{formatString(Infinity)}</Code>
      </div>
    </div>
  );
};
