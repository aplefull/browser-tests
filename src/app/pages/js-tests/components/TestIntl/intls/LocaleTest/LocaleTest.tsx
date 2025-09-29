import styles from '@/app/pages/js-tests/components/TestIntl/styles.module.scss';
import { createSelects, getSupportedLocales, SelectsLayout } from '@/app/pages/js-tests/components/TestIntl/TestIntl';
import { useMemo, useState } from 'react';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import { isOneOf, nextElement, prevElement } from '@utils';
import scriptCodes from '@data/script-codes.json';
import regionCodes from '@data/region-codes.json';
import allLocales from '@assets/data/locales.json';
import languages from '@data/language-codes.json';

const getLocaleData = (intl: Intl.Locale) => {
  return {
    baseName: intl.baseName,
    calendar: intl.calendar,
    caseFirst: intl.caseFirst,
    collation: intl.collation,
    hourCycle: intl.hourCycle,
    language: intl.language,
    numberingSystem: intl.numberingSystem,
    numeric: intl.numeric,
    region: intl.region,
    script: intl.script,
    calendars: intl.getCalendars?.() || intl.calendars,
    collations: intl.getCollations?.() || intl.collations,
    hourCycles: intl.getHourCycles?.() || intl.hourCycles,
    numberingSystems: intl.getNumberingSystems?.() || intl.numberingSystems,
    textInfo: intl.getTextInfo?.() || intl.textInfo,
    timeZones: intl.getTimeZones?.() || intl.timeZones,
    weekInfo: intl.getWeekInfo?.() || intl.weekInfo,
    toString: intl.toString(),
  };
};

export const LocaleTest = () => {
  const [currentLocale, setCurrentLocale] = useState(Intl.NumberFormat().resolvedOptions().locale);
  const [intlOptions, setIntlOptions] = useState<Intl.LocaleOptions>({});

  const intl = new Intl.Locale(currentLocale, intlOptions);
  const generalIntl = new Intl.Locale(currentLocale);

  const supportedLocales = useMemo(getSupportedLocales(Intl.Locale), []);

  const values = {
    language: {
      label: 'Language',
      options: languages,
      value: intlOptions.language,
    },
    script: {
      label: 'Script',
      options: scriptCodes,
      value: intlOptions.script,
    },
    region: {
      label: 'Region',
      options: regionCodes,
      value: intlOptions.region,
    },
    calendar: {
      label: 'Calendar',
      options: generalIntl.getCalendars?.() || generalIntl.calendars || [],
      value: intlOptions.calendar,
    },
    collation: {
      label: 'Collation',
      options: generalIntl.getCollations?.() || generalIntl.collations || [],
      value: intlOptions.collation,
    },
    numberingSystem: {
      label: 'Numbering system',
      options: generalIntl.getNumberingSystems?.() || generalIntl.numberingSystems || [],
      value: intlOptions.numberingSystem,
    },
    caseFirst: {
      label: 'Case first',
      options: ['upper', 'lower', 'false'] as const,
      value: intlOptions.caseFirst,
    },
    hourCycle: {
      label: 'Hour cycle',
      options: ['h11', 'h12', 'h23', 'h24'] as const,
      value: intlOptions.hourCycle,
    },
    numeric: {
      label: 'Numeric',
      options: ['true', 'false'] as const,
      value: intlOptions.numeric,
    },
  };

  const setLanguageOption = (value: string) => {
    setIntlOptions((prev) => ({ ...prev, language: value }));
  };

  const setScriptOption = (value: string) => {
    setIntlOptions((prev) => ({ ...prev, script: value }));
  };

  const setRegionOption = (value: string) => {
    setIntlOptions((prev) => ({ ...prev, region: value }));
  };

  const setCalendarOption = (value: string) => {
    setIntlOptions((prev) => ({ ...prev, calendar: value }));
  };

  const setCollationOption = (value: string) => {
    setIntlOptions((prev) => ({ ...prev, collation: value }));
  };

  const setNumberingSystemOption = (value: string) => {
    setIntlOptions((prev) => ({ ...prev, numberingSystem: value }));
  };

  const setCaseFirstOption = (value: string) => {
    if (isOneOf(value, values.caseFirst.options)) {
      setIntlOptions((prev) => ({ ...prev, caseFirst: value }));
    }
  };

  const setHourCycleOption = (value: string) => {
    if (isOneOf(value, values.hourCycle.options)) {
      setIntlOptions((prev) => ({ ...prev, hourCycle: value }));
    }
  };

  const setNumericOption = (value: string) => {
    setIntlOptions((prev) => ({ ...prev, numeric: value === 'true' }));
  };

  const handlers = {
    language: setLanguageOption,
    script: setScriptOption,
    region: setRegionOption,
    calendar: setCalendarOption,
    collation: setCollationOption,
    numberingSystem: setNumberingSystemOption,
    caseFirst: setCaseFirstOption,
    hourCycle: setHourCycleOption,
    numeric: setNumericOption,
  };

  const clearOption = (key: string) => () => {
    setIntlOptions((prev) => ({ ...prev, [key]: undefined }));
  };

  const selects = createSelects(values, handlers, clearOption);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const data = {
    ...getLocaleData(intl),
    maximize: getLocaleData(intl.maximize()),
    minimize: getLocaleData(intl.minimize()),
  };

  return (
    <div className={styles.testContainer}>
      <h2>Locale</h2>
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
      {data && <Json data={data} settings={{ collapseLevel: 1 }} />}
    </div>
  );
};
