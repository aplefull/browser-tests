import allLocales from '@assets/data/locales.json';
import regionCodes from '@data/region-codes.json';
import scriptCodes from '@data/script-codes.json';
import { useMemo, useState } from 'react';
import { getErrorMessage, isOneOf, nextElement, prevElement } from '@/utils/utils';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { Switcher } from '@/app/components/Switcher/Switcher';
import { Select } from '@/app/components/Select/Select';
import { Code } from '@/app/components/Code/Code';
import { createSelects, getSupportedLocales, SelectsLayout } from '@/app/pages/js-tests/components/TestIntl/TestIntl';

const testValues = {
  calendar: Intl.supportedValuesOf('calendar'),
  currency: Intl.supportedValuesOf('currency'),
  dateTimeField: [
    'era',
    'year',
    'quarter',
    'month',
    'weekOfYear',
    'weekday',
    'day',
    'dayPeriod',
    'hour',
    'minute',
    'second',
    'timeZoneName',
  ],
  language: allLocales,
  region: regionCodes,
  script: scriptCodes,
};

export const DisplayNamesTest = () => {
  const [currentLocale, setCurrentLocale] = useState(new Intl.DateTimeFormat().resolvedOptions().locale);
  const [intlOptions, setIntlOptions] = useState<Intl.DisplayNamesOptions>({
    type: 'region',
  });
  const [testValue, setTestValue] = useState(testValues[intlOptions.type][0]);

  const intl = new Intl.DisplayNames(currentLocale, intlOptions);

  const supportedLocales = useMemo(getSupportedLocales(Intl.DisplayNames), []);

  const values = {
    type: {
      label: 'Type',
      options: ['calendar', 'currency', 'dateTimeField', 'language', 'region', 'script'] as const,
      value: intlOptions.type,
    },
    style: {
      label: 'Style',
      options: ['long', 'short', 'narrow'] as const,
      value: intlOptions.style,
    },
    languageDisplay: {
      label: 'Language display',
      options: ['dialect', 'standard'] as const,
      value: intlOptions.languageDisplay,
    },
    fallback: {
      label: 'Fallback',
      options: ['code', 'none'] as const,
      value: intlOptions.fallback,
    },
  };

  const setTypeOption = (type: string) => {
    if (isOneOf(type, values.type.options)) {
      setTestValue(testValues[type][0]);
      setIntlOptions((options) => ({ ...options, type }));
    }
  };

  const setStyleOption = (style: string) => {
    if (isOneOf(style, values.style.options)) {
      setIntlOptions((options) => ({ ...options, style }));
    }
  };

  const setLanguageDisplayOption = (languageDisplay: string) => {
    if (isOneOf(languageDisplay, values.languageDisplay.options)) {
      setIntlOptions((options) => ({ ...options, languageDisplay }));
    }
  };

  const setFallbackOption = (fallback: string) => {
    if (isOneOf(fallback, values.fallback.options)) {
      setIntlOptions((options) => ({ ...options, fallback }));
    }
  };

  const handlers = {
    style: setStyleOption,
    type: setTypeOption,
    languageDisplay: setLanguageDisplayOption,
    fallback: setFallbackOption,
  };

  const selects = createSelects(values, handlers);

  const onNextLocale = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrevLocale = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const onNextValue = () => setTestValue(nextElement(testValues[intlOptions.type], testValue));
  const onPrevValue = () => setTestValue(prevElement(testValues[intlOptions.type], testValue));

  const getDisplayName = (value: string) => {
    try {
      return intl.of(value);
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  return (
    <div className={styles.testContainer}>
      <h2>DisplayNames</h2>
      <SelectsLayout
        totalLocales={allLocales.length}
        supportedLocales={supportedLocales.length}
        selects={selects}
        onNext={onNextLocale}
        onPrev={onPrevLocale}
        selectOptions={supportedLocales}
        selectValue={currentLocale}
        onSelectChange={setCurrentLocale}
      />
      <div className={classNames(styles.selectWithLabel, styles.select)}>
        <Switcher onNext={onNextValue} onPrev={onPrevValue}>
          <Select options={testValues[intlOptions.type]} onChange={setTestValue} value={testValue} />
        </Switcher>
      </div>
      <Code>{`Display name: ${getDisplayName(testValue)}`}</Code>
    </div>
  );
};
