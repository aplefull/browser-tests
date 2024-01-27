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

const limitNumberOptions = (arr: string[], limit?: number) => {
  if (!limit) return arr;

  return arr.filter((el) => {
    return parseFloat(el) <= limit;
  });
};

export const NumberFormatTest = () => {
  const [value, setValue] = useState(123456.789);
  const [currentLocale, setCurrentLocale] = useState(Intl.NumberFormat().resolvedOptions().locale);
  const [supportedLocales, setSupportedLocales] = useState([currentLocale]);
  const [intlOptions, setIntlOptions] = useState<Intl.NumberFormatOptions>({
    style: 'decimal',
    useGrouping: true,
  });

  const intl = new Intl.NumberFormat(currentLocale, intlOptions);

  const values = {
    style: {
      label: 'Style',
      options: ['decimal', 'percent', 'currency', 'unit'] as const,
      value: intlOptions.style,
    },
    currency: {
      label: 'Currency',
      options: Intl.supportedValuesOf('currency'),
      value: intlOptions.currency,
    },
    currencySign: {
      label: 'Currency sign',
      options: ['standard', 'accounting'] as const,
      value: intlOptions.currencySign,
    },
    currencyDisplay: {
      label: 'Currency display',
      options: ['symbol', 'narrowSymbol', 'code', 'name'] as const,
      value: intlOptions.currencyDisplay,
    },
    notation: {
      label: 'Notation',
      options: ['standard', 'scientific', 'engineering', 'compact'] as const,
      value: intlOptions.notation,
    },
    signDisplay: {
      label: 'Sign display',
      options: ['auto', 'always', 'never', 'exceptZero'] as const,
      value: intlOptions.signDisplay,
    },
    unitDisplay: {
      label: 'Unit display',
      options: ['short', 'long', 'narrow'] as const,
      value: intlOptions.unitDisplay,
    },
    useGrouping: {
      label: 'Use grouping',
      options: ['true', 'false'] as const,
      value: intlOptions.useGrouping,
    },
    minimumIntegerDigits: {
      label: 'Minimum integer digits',
      options: ['1', '2', '3', '5', '10', '20', '21'] as const,
      value: intlOptions.minimumIntegerDigits,
    },
    minimumFractionDigits: {
      label: 'Minimum fraction digits',
      options: ['0', '1', '2', '3', '5', '10', '50', '100'] as const,
      value: intlOptions.minimumFractionDigits,
    },
    maximumFractionDigits: {
      label: 'Maximum fraction digits',
      options: ['0', '1', '2', '3', '5', '10', '50', '100'] as const,
      value: intlOptions.maximumFractionDigits,
    },
    minimumSignificantDigits: {
      label: 'Minimum significant digits',
      options: ['1', '2', '3', '5', '10', '20', '21'] as const,
      value: intlOptions.minimumSignificantDigits,
    },
    maximumSignificantDigits: {
      label: 'Maximum significant digits',
      options: ['1', '2', '3', '5', '10', '20', '21'] as const,
      value: intlOptions.maximumSignificantDigits,
    },
  };

  const setStyleOption = (style: string) => {
    if (style === 'currency') {
      setCurrencyOption('USD');
    }

    setIntlOptions((options) => ({ ...options, style }));
  };

  const setCurrencyOption = (currency: string) => {
    setIntlOptions((options) => ({ ...options, currency }));
  };

  const setCurrencySignOption = (currencySign: string) => {
    setIntlOptions((options) => ({ ...options, currencySign }));
  };

  const setCurrencyDisplayOption = (currencyDisplay: string) => {
    setIntlOptions((options) => ({ ...options, currencyDisplay }));
  };

  const setNotationOption = (notation: string) => {
    if (isOneOf(notation, values.notation.options)) {
      setIntlOptions((options) => ({ ...options, notation }));
    }
  };

  const setSignDisplayOption = (signDisplay: string) => {
    if (isOneOf(signDisplay, values.signDisplay.options)) {
      setIntlOptions((options) => ({ ...options, signDisplay }));
    }
  };

  const setUnitDisplayOption = (unitDisplay: string) => {
    if (isOneOf(unitDisplay, values.unitDisplay.options)) {
      setIntlOptions((options) => ({ ...options, unitDisplay }));
    }
  };

  const setUseGroupingOption = (useGrouping: string) => {
    const value = useGrouping === 'true' ? true : useGrouping === 'false' ? false : undefined;

    setIntlOptions((options) => ({ ...options, useGrouping: value }));
  };

  const setMinimumIntegerDigitsOption = (minimumIntegerDigits: string) => {
    setIntlOptions((options) => ({ ...options, minimumIntegerDigits: parseFloat(minimumIntegerDigits) }));
  };

  const setMinimumFractionDigitsOption = (minimumFractionDigits: string) => {
    const maxFD = intlOptions.maximumFractionDigits;

    if (maxFD !== undefined && maxFD < parseFloat(minimumFractionDigits)) {
      setMaximumFractionDigitsOption(minimumFractionDigits);
    }

    setIntlOptions((options) => ({ ...options, minimumFractionDigits: parseFloat(minimumFractionDigits) }));
  };

  const setMaximumFractionDigitsOption = (maximumFractionDigits: string) => {
    const minFD = intlOptions.minimumFractionDigits;

    if (minFD !== undefined && minFD > parseFloat(maximumFractionDigits)) {
      setMinimumFractionDigitsOption(maximumFractionDigits);
    }

    setIntlOptions((options) => ({ ...options, maximumFractionDigits: parseFloat(maximumFractionDigits) }));
  };

  const setMinimumSignificantDigitsOption = (minimumSignificantDigits: string) => {
    const maxSD = intlOptions.maximumSignificantDigits;

    if (maxSD !== undefined && maxSD < parseFloat(minimumSignificantDigits)) {
      setMaximumSignificantDigitsOption(minimumSignificantDigits);
    }

    setIntlOptions((options) => ({ ...options, minimumSignificantDigits: parseFloat(minimumSignificantDigits) }));
  };

  const setMaximumSignificantDigitsOption = (maximumSignificantDigits: string) => {
    const minSD = intlOptions.minimumSignificantDigits;

    if (minSD !== undefined && minSD > parseFloat(maximumSignificantDigits)) {
      setMinimumSignificantDigitsOption(maximumSignificantDigits);
    }

    setIntlOptions((options) => ({ ...options, maximumSignificantDigits: parseFloat(maximumSignificantDigits) }));
  };

  const handlers = {
    style: setStyleOption,
    currency: setCurrencyOption,
    currencySign: setCurrencySignOption,
    currencyDisplay: setCurrencyDisplayOption,
    notation: setNotationOption,
    signDisplay: setSignDisplayOption,
    unitDisplay: setUnitDisplayOption,
    useGrouping: setUseGroupingOption,
    minimumIntegerDigits: setMinimumIntegerDigitsOption,
    minimumFractionDigits: setMinimumFractionDigitsOption,
    maximumFractionDigits: setMaximumFractionDigitsOption,
    minimumSignificantDigits: setMinimumSignificantDigitsOption,
    maximumSignificantDigits: setMaximumSignificantDigitsOption,
  };

  const selects = createSelects(values, handlers);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const getFormattedString = (value: number) => {
    try {
      return intl.format(value);
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  useEffect(() => {
    getSupportedLocalesAsync(Intl.DisplayNames).then(setSupportedLocales);
  }, []);

  return (
    <div className={styles.testContainer}>
      <h2>NumberFormat</h2>
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
