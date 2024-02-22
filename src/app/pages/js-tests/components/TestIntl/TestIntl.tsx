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
    return allLocales.filter((locale) => {
      return intlFormat.supportedLocalesOf(locale).length > 0;
    });
  }

  return [];
};

export const createSelects = (
  values: Record<
    string,
    {
      label: string;
      options: readonly string[];
      value: string | number | boolean | undefined;
      disabled?: boolean;
    }
  >,
  handlers: Record<string, (value: string) => void>,
  clearOption?: (key: string) => () => void,
) => {
  return Object.entries(values).map(([key, value]) => {
    if (isKeyOf(key, handlers)) {
      return {
        ...value,
        onChange: handlers[key],
        onClear: clearOption ? clearOption(key) : undefined,
      };
    }

    console.warn(`Handler for ${key} is not defined`);
    return {
      ...value,
      onChange: noop,
      onClear: noop,
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
