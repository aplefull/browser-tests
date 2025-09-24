import allLocales from '@assets/data/locales.json';
import styles from './styles.module.scss';
import { Select } from '@/app/components/Select/Select';
import { Switcher } from '@/app/components/Switcher/Switcher';
import { DisplayNamesTest } from '@/app/pages/js-tests/components/TestIntl/intls/DisplayNamesTest/DisplayNamesTest';
import { CollatorTest } from '@/app/pages/js-tests/components/TestIntl/intls/CollatorTest/CollatorTest';
import { DateTimeFormatTest } from '@/app/pages/js-tests/components/TestIntl/intls/DateTimeFormatTest/DateTimeFormatTest';
import { ListFormatTest } from '@/app/pages/js-tests/components/TestIntl/intls/ListFormatTest/ListFormatTest';
import { NumberFormatTest } from '@/app/pages/js-tests/components/TestIntl/intls/NumberFormatTest/NumberFormatTest';
import { RelativeTimeFormatTest } from '@/app/pages/js-tests/components/TestIntl/intls/RelativeTimeFormatTest/RelativeTimeFormatTest';
import { SegmenterTest } from '@/app/pages/js-tests/components/TestIntl/intls/SegmenterTest/SegmenterTest';
import { PluralRulesTest } from '@/app/pages/js-tests/components/TestIntl/intls/PluralRulesTest/PluralRulesTest';
import { isKeyOf, isNotPartOf, noop } from '@/utils/utils';
import { SectionErrorBoundary } from '@/app/components/SectionErrorBoundary/SectionErrorBoundary';
import { LocaleTest } from '@/app/pages/js-tests/components/TestIntl/intls/LocaleTest/LocaleTest';

export type TIntlFormats =
  | typeof Intl.Locale
  | typeof Intl.DateTimeFormat
  | typeof Intl.RelativeTimeFormat
  | typeof Intl.ListFormat
  | typeof Intl.NumberFormat
  | typeof Intl.PluralRules
  | typeof Intl.Segmenter
  | typeof Intl.Collator
  | typeof Intl.DisplayNames;

const getSupportedLocalesOf = (
  intlFormat: Omit<TIntlFormats, keyof Intl.Locale>,
): typeof Intl.NumberFormat.supportedLocalesOf | null => {
  if ('supportedLocalesOf' in intlFormat && typeof intlFormat.supportedLocalesOf === 'function') {
    return intlFormat.supportedLocalesOf.bind(intlFormat);
  }

  return null;
};

export const getSupportedLocales = (intlFormat?: TIntlFormats) => () => {
  if (!intlFormat) return [];

  if (intlFormat === Intl.Locale) {
    return allLocales.filter((locale) => {
      try {
        new Intl.Locale(locale);
        return true;
      } catch {
        return false;
      }
    });
  }

  if (isNotPartOf<TIntlFormats, typeof Intl.Locale>(intlFormat, Intl.Locale)) {
    const supportedLocalesOf = getSupportedLocalesOf(intlFormat);

    if (!supportedLocalesOf) return [];

    return allLocales.filter((locale) => {
      try {
        return supportedLocalesOf(locale).length > 0;
      } catch {
        return false;
      }
    });
  }

  return [];
};

export const createSelects = <THandlers extends Record<string, (value: any) => void>>(
  values: Record<
    keyof THandlers & string,
    {
      label: string;
      options: readonly string[];
      value: string | number | boolean | undefined;
      disabled?: boolean;
    }
  >,
  handlers: THandlers,
  clearOption?: (key: keyof THandlers & string) => () => void,
) => {
  return Object.entries(values).map(([key, value]) => {
    if (key in handlers) {
      return {
        ...value,
        onChange: handlers[key as keyof THandlers],
        onClear: clearOption ? clearOption(key as keyof THandlers & string) : undefined,
      };
    }

    console.warn(`Handler for ${key} is not defined`);
    return {
      ...value,
      onChange: () => {},
      onClear: () => {},
    };
  });
};

type TSelectsLayoutProps = {
  totalLocales: number;
  supportedLocales: number;
  selects: ReturnType<typeof createSelects>;
  onNext: () => void;
  onPrev: () => void;
  selectOptions: string[];
  selectValue: string;
  onSelectChange: (value: string) => void;
};

export const SelectsLayout = ({
  totalLocales,
  supportedLocales,
  selects,
  onNext,
  onPrev,
  selectOptions,
  selectValue,
  onSelectChange,
}: TSelectsLayoutProps) => {
  return (
    <>
      <span>{`Supported locales: ${supportedLocales} out of ${totalLocales} tested`}</span>
      <div className={styles.select}>
        <Switcher onNext={onNext} onPrev={onPrev}>
          <Select options={selectOptions} onChange={onSelectChange} value={selectValue} searchable />
        </Switcher>
      </div>
      <div className={styles.selectsGrid}>
        {selects.map((select) => {
          return (
            <div key={select.label} className={styles.selectWithLabel}>
              <span>{select.label}</span>
              <Select
                options={select.options}
                onChange={select.onChange}
                onClear={select.onClear}
                value={select.value?.toString()}
                disabled={select.disabled}
                clearable
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

const components = [
  LocaleTest,
  CollatorTest,
  DateTimeFormatTest,
  ListFormatTest,
  NumberFormatTest,
  RelativeTimeFormatTest,
  PluralRulesTest,
  SegmenterTest,
  DisplayNamesTest,
];

export const TestIntl = () => {
  return (
    <div className={styles.container}>
      {components.map((Component) => {
        return (
          <SectionErrorBoundary key={Component.name}>
            <Component />
          </SectionErrorBoundary>
        );
      })}
    </div>
  );
};
