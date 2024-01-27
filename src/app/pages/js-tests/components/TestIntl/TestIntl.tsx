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
import { isKeyOf, noop } from '@/utils/utils';
import { SectionErrorBoundary } from '@/app/components/SectionErrorBoundary/SectionErrorBoundary';

export type TIntlFormats =
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

  return allLocales.filter((locale) => {
    return intlFormat.supportedLocalesOf(locale).length > 0;
  });
};

export const getSupportedLocalesAsync = async (intlFormat?: TIntlFormats) => {
  if (!intlFormat) return [];

  return allLocales.filter((locale) => {
    return intlFormat.supportedLocalesOf(locale).length > 0;
  });
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
) => {
  return Object.entries(values).map(([key, value]) => {
    if (isKeyOf(key, handlers)) {
      return {
        ...value,
        onChange: handlers[key],
      };
    }

    console.warn(`Handler for ${key} is not defined`);
    return {
      ...value,
      onChange: noop,
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
          <Select options={selectOptions} onChange={onSelectChange} value={selectValue} />
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
                value={select.value?.toString()}
                disabled={select.disabled}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

const components = [
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
