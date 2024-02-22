import { useEffect, useMemo, useState } from 'react';
import { isOneOf, nextElement, prevElement } from '@/utils/utils';
import allLocales from '@assets/data/locales.json';
import styles from './styles.module.scss';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { Code } from '@/app/components/Code/Code';
import classNames from 'classnames';
import { createSelects, getSupportedLocales, SelectsLayout } from '@/app/pages/js-tests/components/TestIntl/TestIntl';

export const DateTimeFormatTest = () => {
  const [now, setNow] = useState(new Date());
  const [currentLocale, setCurrentLocale] = useState(Intl.DateTimeFormat().resolvedOptions().locale);
  const [rtl, setRtl] = useState(false);
  const [intlOptions, setIntlOptions] = useState<Intl.DateTimeFormatOptions>({
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    dayPeriod: 'short',
    fractionalSecondDigits: 3,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: Intl.DateTimeFormat().resolvedOptions().hour12 || false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timeZoneName: 'long',
  });

  const intl = Intl.DateTimeFormat(currentLocale, intlOptions);

  const supportedLocales = useMemo(getSupportedLocales(Intl.DateTimeFormat), []);

  const values = {
    weekday: {
      label: 'Weekday',
      options: ['long', 'short', 'narrow'] as const,
      value: intlOptions.weekday,
    },
    era: {
      label: 'Era',
      options: ['long', 'short', 'narrow'] as const,
      value: intlOptions.era,
    },
    year: {
      label: 'Year',
      options: ['numeric', '2-digit'] as const,
      value: intlOptions.year,
    },
    month: {
      label: 'Month',
      options: ['numeric', '2-digit', 'long', 'short', 'narrow'] as const,
      value: intlOptions.month,
    },
    day: {
      label: 'Day',
      options: ['numeric', '2-digit'] as const,
      value: intlOptions.day,
    },
    hour: {
      label: 'Hour',
      options: ['numeric', '2-digit'] as const,
      value: intlOptions.hour,
    },
    minute: {
      label: 'Minute',
      options: ['numeric', '2-digit'] as const,
      value: intlOptions.minute,
    },
    second: {
      label: 'Second',
      options: ['numeric', '2-digit'] as const,
      value: intlOptions.second,
    },
    timeZoneName: {
      label: 'Time zone name',
      options: ['short', 'long', 'shortOffset', 'longOffset', 'shortGeneric', 'longGeneric'] as const,
      value: intlOptions.timeZoneName,
    },
    formatMatcher: {
      label: 'Format matcher',
      options: ['best fit', 'basic'] as const,
      value: intlOptions.formatMatcher,
    },
    hour12: {
      label: 'Hour12',
      options: ['true', 'false'] as const,
      value: intlOptions.hour12,
    },
    timeZone: {
      label: 'Time zone',
      options: Intl.supportedValuesOf('timeZone'),
      value: intlOptions.timeZone,
    },
    dateStyle: {
      label: 'Date style',
      options: ['full', 'long', 'medium', 'short'] as const,
      value: intlOptions.dateStyle,
      disabled: true,
    },
    timeStyle: {
      label: 'Time style',
      options: ['full', 'long', 'medium', 'short'] as const,
      value: intlOptions.timeStyle,
      disabled: true,
    },
    dayPeriod: {
      label: 'Day period',
      options: ['narrow', 'short', 'long'] as const,
      value: intlOptions.dayPeriod,
    },
    fractionalSecondDigits: {
      label: 'Fractional Seconds Digits',
      options: ['1', '2', '3'] as const,
      value: intlOptions.fractionalSecondDigits,
    },
    calendar: {
      label: 'Calendar',
      options: Intl.supportedValuesOf('calendar'),
      value: intlOptions.calendar,
    },
    numberingSystem: {
      label: 'Numbering system',
      options: Intl.supportedValuesOf('numberingSystem'),
      value: intlOptions.numberingSystem,
    },
    hourCycle: {
      label: 'Hour cycle',
      options: ['h11', 'h12', 'h23', 'h24'] as const,
      value: intlOptions.hourCycle,
    },
  };

  const setWeekdayOption = (weekday: string) => {
    if (isOneOf(weekday, values.weekday.options)) {
      setIntlOptions((options) => ({ ...options, weekday }));
    }
  };

  const setEraOption = (era: string) => {
    if (isOneOf(era, values.era.options)) {
      setIntlOptions((options) => ({ ...options, era }));
    }
  };

  const setYearOption = (year: string) => {
    if (isOneOf(year, values.year.options)) {
      setIntlOptions((options) => ({ ...options, year }));
    }
  };

  const setMonthOption = (month: string) => {
    if (isOneOf(month, values.month.options)) {
      setIntlOptions((options) => ({ ...options, month }));
    }
  };

  const setDayOption = (day: string) => {
    if (isOneOf(day, values.day.options)) {
      setIntlOptions((options) => ({ ...options, day }));
    }
  };

  const setHourOption = (hour: string) => {
    if (isOneOf(hour, values.hour.options)) {
      setIntlOptions((options) => ({ ...options, hour }));
    }
  };

  const setMinuteOption = (minute: string) => {
    if (isOneOf(minute, values.minute.options)) {
      setIntlOptions((options) => ({ ...options, minute }));
    }
  };

  const setSecondOption = (second: string) => {
    if (isOneOf(second, values.second.options)) {
      setIntlOptions((options) => ({ ...options, second }));
    }
  };

  const setTimeZoneNameOption = (timeZoneName: string) => {
    if (isOneOf(timeZoneName, values.timeZoneName.options)) {
      setIntlOptions((options) => ({ ...options, timeZoneName }));
    }
  };

  const setFormatMatcherOption = (formatMatcher: string) => {
    if (isOneOf(formatMatcher, values.formatMatcher.options)) {
      setIntlOptions((options) => ({ ...options, formatMatcher }));
    }
  };

  const setHour12Option = (hour12: string) => {
    const value = hour12 === 'true' ? true : hour12 === 'false' ? false : undefined;

    setIntlOptions((options) => ({ ...options, hour12: value }));
  };

  const setTimeZoneOption = (timeZone: string) => {
    setIntlOptions((options) => ({ ...options, timeZone }));
  };

  const setDateStyleOption = (dateStyle: string) => {
    if (isOneOf(dateStyle, values.dateStyle.options)) {
      setIntlOptions((options) => ({ ...options, dateStyle }));
    }
  };

  const setTimeStyleOption = (timeStyle: string) => {
    if (isOneOf(timeStyle, values.timeStyle.options)) {
      setIntlOptions((options) => ({ ...options, timeStyle }));
    }
  };

  const setDayPeriodOption = (dayPeriod: string) => {
    if (isOneOf(dayPeriod, values.dayPeriod.options)) {
      setIntlOptions((options) => ({ ...options, dayPeriod }));
    }
  };

  const setFractionalSecondDigitsOption = (fractionalSecondDigits: string) => {
    const value = isOneOf(fractionalSecondDigits, ['1', '2', '3']) ? parseInt(fractionalSecondDigits) : undefined;

    if (isOneOf(value, [1, 2, 3])) {
      setIntlOptions((options) => ({ ...options, fractionalSecondDigits: value }));
    }
  };

  const setCalendarOption = (calendar: string) => {
    setIntlOptions((options) => ({ ...options, calendar }));
  };

  const setNumberingSystemOption = (numberingSystem: string) => {
    setIntlOptions((options) => ({ ...options, numberingSystem }));
  };

  const setHourCycleOption = (hourCycle: string) => {
    if (isOneOf(hourCycle, values.hourCycle.options)) {
      setIntlOptions((options) => ({ ...options, hourCycle }));
    }
  };

  const handlers = {
    weekday: setWeekdayOption,
    era: setEraOption,
    year: setYearOption,
    month: setMonthOption,
    day: setDayOption,
    hour: setHourOption,
    minute: setMinuteOption,
    second: setSecondOption,
    timeZoneName: setTimeZoneNameOption,
    formatMatcher: setFormatMatcherOption,
    hour12: setHour12Option,
    timeZone: setTimeZoneOption,
    dateStyle: setDateStyleOption,
    timeStyle: setTimeStyleOption,
    dayPeriod: setDayPeriodOption,
    fractionalSecondDigits: setFractionalSecondDigitsOption,
    calendar: setCalendarOption,
    numberingSystem: setNumberingSystemOption,
    hourCycle: setHourCycleOption,
  };

  const selects = createSelects(values, handlers);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const dateFirst = new Date(0);
  const dateString = intl.format(now);
  const dateParts = intl.formatToParts(now);
  const dateRangeString = intl.formatRange(dateFirst, now);
  const dateRangeParts = intl.formatRangeToParts(dateFirst, now);

  const partsToString = (parts: Intl.DateTimeFormatPart[]) => parts.map((part) => part.value).join('');

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.testContainer}>
      <h2>DateTimeFormat</h2>
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
      <Checkbox checked={rtl} onChange={setRtl} label="Enable rtl direction" />
      <div className={styles.dates}>
        <span>Formatted string:</span>
        <Code
          className={classNames(styles.pre, {
            [styles.rtl]: rtl,
          })}
        >
          {dateString}
        </Code>
        {partsToString(dateParts) !== dateString && (
          <div className={styles.warning}>
            <span>Formatted parts do not match formatted string:</span>
            <Code
              className={classNames(styles.pre, {
                [styles.rtl]: rtl,
              })}
            >
              {partsToString(dateParts)}
            </Code>
          </div>
        )}
        <span>Formatted range string:</span>
        <Code
          className={classNames(styles.pre, {
            [styles.rtl]: rtl,
          })}
        >
          {dateRangeString}
        </Code>
        {partsToString(dateRangeParts) !== dateRangeString && (
          <div className={styles.warning}>
            <span>Formatted range parts do not match formatted range string:</span>
            <Code
              className={classNames(styles.pre, {
                [styles.rtl]: rtl,
              })}
            >
              {partsToString(dateRangeParts)}
            </Code>
          </div>
        )}
      </div>
    </div>
  );
};
