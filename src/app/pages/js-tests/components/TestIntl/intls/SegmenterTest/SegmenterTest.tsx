import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import allLocales from '@assets/data/locales.json';
import { isOneOf, nextElement, prevElement } from '@/utils/utils';
import styles from '@/app/pages/js-tests/components/TestIntl/styles.module.scss';
import { Input } from '@/app/components/Input/Input';
import { Button } from '@/app/components/Button/Button';
import { Code } from '@/app/components/Code/Code';
import {
  createSelects,
  getSupportedLocales,
  getSupportedLocalesAsync,
  SelectsLayout,
} from '@/app/pages/js-tests/components/TestIntl/TestIntl';

const tests = [
  'Hey! This is a string to test how Intl segmenter works.',
  'There are some emojis here: ❤️✨🫠.',
  'وهنا بعض العربية.',
  'ある日本人。',
  'And some obscure text: ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็',
  '᚛ᚄᚓᚐᚋᚒᚄ ᚑᚄᚂᚑᚏᚅ᚜',
];
const defaultTestString = tests.join(' ');

export const SegmenterTest = () => {
  const [currentLocale, setCurrentLocale] = useState(new Intl.Segmenter().resolvedOptions().locale);
  const [supportedLocales, setSupportedLocales] = useState([currentLocale]);
  const [intlOptions, setIntlOptions] = useState<Intl.SegmenterOptions>({
    granularity: 'grapheme',
  });
  const [testString, setTestString] = useState(defaultTestString);

  const intl = new Intl.Segmenter(currentLocale, intlOptions);

  const values = {
    granularity: {
      label: 'Granularity',
      options: ['grapheme', 'word', 'sentence'] as const,
      value: intlOptions.granularity,
    },
  };

  const setGranularityOption = (granularity: string) => {
    if (isOneOf(granularity, values.granularity.options)) {
      setIntlOptions((options) => ({ ...options, granularity }));
    }
  };

  const handlers = {
    granularity: setGranularityOption,
  };

  const selects = createSelects(values, handlers);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const segmentsToArray = (segments: Intl.Segments | never[]) => {
    return Array.from(segments, ({ segment }) => {
      return segment;
    });
  };

  const handleTestStringChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTestString(event.target.value);
  };

  const handleReset = () => {
    setTestString(defaultTestString);
  };

  const getSegments = (string: string) => {
    try {
      return intl.segment(string);
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    getSupportedLocalesAsync(Intl.Segmenter).then(setSupportedLocales);
  }, []);

  return (
    <div className={styles.testContainer}>
      <h2>Segmenter</h2>
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
      <div className={styles.testStringInputContainer}>
        <Input value={testString} onChange={handleTestStringChange} />
        <Button text="Reset" onClick={handleReset} />
      </div>
      <div className={styles.segmentsContainer}>
        <div className={styles.segments}>
          {segmentsToArray(getSegments(testString)).map((segment, index) => {
            return (
              <Code key={index} className={styles.segment}>
                {segment}
              </Code>
            );
          })}
        </div>
      </div>
    </div>
  );
};
