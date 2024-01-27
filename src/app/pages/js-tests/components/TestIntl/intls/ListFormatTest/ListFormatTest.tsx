import { useEffect, useMemo, useState } from 'react';
import allLocales from '@assets/data/locales.json';
import { getErrorMessage, isOneOf, nextElement, prevElement } from '@/utils/utils';
import styles from '@/app/pages/js-tests/components/TestIntl/styles.module.scss';
import { Code } from '@/app/components/Code/Code';
import {
  createSelects,
  getSupportedLocales,
  getSupportedLocalesAsync,
  SelectsLayout,
} from '@/app/pages/js-tests/components/TestIntl/TestIntl';

const tests = [['Apple, Banana'], ['Apple', 'Banana', 'Cherry']];

export const ListFormatTest = () => {
  const [currentLocale, setCurrentLocale] = useState(new Intl.ListFormat().resolvedOptions().locale);
  const [supportedLocales, setSupportedLocales] = useState([currentLocale]);
  const [intlOptions, setIntlOptions] = useState<Intl.ListFormatOptions>({
    style: 'long',
    type: 'conjunction',
  });

  const intl = new Intl.ListFormat(currentLocale, intlOptions);

  const values = {
    style: {
      label: 'Style',
      options: ['long', 'short', 'narrow'] as const,
      value: intlOptions.style,
    },
    type: {
      label: 'Type',
      options: ['conjunction', 'disjunction', 'unit'] as const,
      value: intlOptions.type,
    },
  };

  const setStyleOption = (style: string) => {
    if (isOneOf(style, values.style.options)) {
      setIntlOptions((options) => ({ ...options, style }));
    }
  };

  const setTypeOption = (type: string) => {
    if (isOneOf(type, values.type.options)) {
      setIntlOptions((options) => ({ ...options, type }));
    }
  };

  const handlers = {
    style: setStyleOption,
    type: setTypeOption,
  };

  const selects = createSelects(values, handlers);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const getFormattedString = (test: string[]) => {
    try {
      return intl.format(test);
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  useEffect(() => {
    getSupportedLocalesAsync(Intl.DisplayNames).then(setSupportedLocales);
  }, []);

  return (
    <div className={styles.testContainer}>
      <h2>ListFormat</h2>
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
      <div className={styles.listFormat}>
        {tests.map((test, index) => {
          return (
            <div key={index}>
              <Code>{getFormattedString(test)}</Code>
            </div>
          );
        })}
      </div>
    </div>
  );
};
