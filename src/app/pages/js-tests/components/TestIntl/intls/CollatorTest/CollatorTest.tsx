import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react';
import { isOneOf, nextElement, prevElement } from '@/utils/utils';
import allLocales from '@assets/data/locales.json';
import styles from '@/app/pages/js-tests/components/TestIntl/styles.module.scss';
import classNames from 'classnames';
import { Code } from '@/app/components/Code/Code';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { Input } from '@/app/components/Input/Input';
import { Button } from '@/app/components/Button/Button';
import {
  createSelects,
  getSupportedLocales,
  getSupportedLocalesAsync,
  SelectsLayout,
} from '@/app/pages/js-tests/components/TestIntl/TestIntl';

export const CollatorTest = () => {
  const [currentLocale, setCurrentLocale] = useState(Intl.Collator().resolvedOptions().locale);
  const [supportedLocales, setSupportedLocales] = useState([currentLocale]);
  const [intlOptions, setIntlOptions] = useState<Intl.CollatorOptions>({});
  const [testString, setTestString] = useState('');
  const [trim, setTrim] = useState(true);
  const [separator, setSeparator] = useState(' ');

  const intl = new Intl.Collator(currentLocale, intlOptions);

  const values = {
    usage: {
      label: 'Usage',
      options: ['sort', 'search'] as const,
      value: intlOptions.usage,
    },
    numeric: {
      label: 'Numeric',
      options: ['true', 'false'] as const,
      value: intlOptions.numeric,
    },
    caseFirst: {
      label: 'Case first',
      options: ['upper', 'lower', 'false'] as const,
      value: intlOptions.caseFirst,
    },
    sensitivity: {
      label: 'Sensitivity',
      options: ['base', 'accent', 'case', 'variant'] as const,
      value: intlOptions.sensitivity,
    },
    collation: {
      label: 'Collation',
      options: Intl.supportedValuesOf('collation'),
      value: intlOptions.collation,
    },
    ignorePunctuation: {
      label: 'Ignore punctuation',
      options: ['true', 'false'] as const,
      value: intlOptions.ignorePunctuation,
    },
  };

  const setUsageOption = (usage: string) => {
    if (isOneOf(usage, values.usage.options)) {
      setIntlOptions((options) => ({ ...options, usage }));
    }
  };

  const setNumericOption = (numeric: string) => {
    const value = numeric === 'true' ? true : numeric === 'false' ? false : undefined;

    setIntlOptions((options) => ({ ...options, numeric: value }));
  };

  const setCaseFirstOption = (caseFirst: string) => {
    if (isOneOf(caseFirst, values.caseFirst.options)) {
      setIntlOptions((options) => ({ ...options, caseFirst }));
    }
  };

  const setSensitivityOption = (sensitivity: string) => {
    if (isOneOf(sensitivity, values.sensitivity.options)) {
      setIntlOptions((options) => ({ ...options, sensitivity }));
    }
  };

  const setCollationOption = (collation: string) => {
    if (
      isOneOf(collation, [
        'big5han',
        'compat',
        'dict',
        'direct',
        'ducet',
        'emoji',
        'eor',
        'gb2312',
        'phonebk',
        'phonetic',
        'pinyin',
        'reformed',
        'searchjl',
        'stroke',
        'trad',
        'unihan',
        'zhuyin',
      ])
    ) {
      setIntlOptions((options) => ({ ...options, collation }));
    }
  };

  const setIgnorePunctuationOption = (ignorePunctuation: string) => {
    const value = ignorePunctuation === 'true' ? true : ignorePunctuation === 'false' ? false : undefined;

    setIntlOptions((options) => ({ ...options, ignorePunctuation: value }));
  };

  const handlers = {
    usage: setUsageOption,
    numeric: setNumericOption,
    caseFirst: setCaseFirstOption,
    sensitivity: setSensitivityOption,
    collation: setCollationOption,
    ignorePunctuation: setIgnorePunctuationOption,
  };

  const selects = createSelects(values, handlers);

  const onNext = () => setCurrentLocale(nextElement(supportedLocales, currentLocale));
  const onPrev = () => setCurrentLocale(prevElement(supportedLocales, currentLocale));

  const handleTestStringChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTestString(event.target.value);
  };

  const tests = [
    {
      input: ['Offenbach', 'Österreich', 'Odenwald'],
      expected: ['Odenwald', 'Österreich', 'Offenbach'],
      intl: new Intl.Collator('de-u-co-phonebk', { usage: 'sort', sensitivity: 'base', numeric: true }),
    },
    {
      input: ['10', '9e6', 'title_02', 'title_01', 'title_100', 'title_11', 'title'],
      expected: ['9e6', '10', 'title', 'title_01', 'title_02', 'title_11', 'title_100'],
      intl: new Intl.Collator('en-u-co-search', { usage: 'sort', numeric: true }),
    },
    {
      input: ['🙊', '🙉', '🙈', '3⃣', '1️⃣', '2⃣', '0️⃣'],
      expected: ['🙈', '🙉', '🙊', '0️⃣', '1️⃣', '2⃣', '3⃣'],
      intl: new Intl.Collator('ar-u-co-emoji', { usage: 'sort', numeric: true }),
    },
    {
      input: ['AbE', 'ABC'],
      expected: ['ABC', 'AbE'],
      intl: new Intl.Collator('en'),
    },
    {
      input: ['ABD Ã', 'AbE'],
      expected: ['ABD Ã', 'AbE'],
      intl: new Intl.Collator('en'),
    },
    {
      input: ['AB - AS Foobar', 'AB - AS Pulheim KÃƒÂ¤ther'],
      expected: ['AB - AS Foobar', 'AB - AS Pulheim KÃƒÂ¤ther'],
      intl: new Intl.Collator('en'),
    },
    {
      input: ['AE', '\u00C4'],
      expected: ['\u00C4', 'AE'],
      intl: new Intl.Collator('de', { usage: 'sort', sensitivity: 'base' }),
    },
    {
      input: ['AE', '\u00C4'],
      expected: ['AE', '\u00C4'],
      intl: new Intl.Collator('de', { usage: 'search' }),
    },
    {
      input: ['A\u0327\u030a', '\u212b\u0327'],
      expected: ['A\u0327\u030a', '\u212b\u0327'],
      intl: new Intl.Collator('en'),
    },
    {
      input: ['ä', 'x'],
      expected: ['ä', 'x'],
      intl: new Intl.Collator('en'),
    },
    {
      input: ['a', 'ⓐ'],
      expected: ['a', 'ⓐ'],
      intl: new Intl.Collator('en', { sensitivity: 'accent' }),
    },
    {
      input: ['ab', 'a,b'],
      expected: ['ab', 'a,b'],
      intl: new Intl.Collator('en', { ignorePunctuation: true }),
    },
  ];

  const sortWithIntl = (array: string[]) => {
    return [...array].sort(intl.compare);
  };

  const splitString = (string: string) => {
    const separatorRegex = new RegExp(separator, 'g');
    return string.split(separatorRegex).map((str) => (trim ? str.trim() : str));
  };

  useEffect(() => {
    getSupportedLocalesAsync(Intl.Collator).then(setSupportedLocales);
  }, []);

  return (
    <div className={styles.testContainer}>
      <h2>Collator</h2>
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
      <div className={styles.collator}>
        <span className={styles.description}>
          Default tests. They are not affected by the options above. Hover over the result to see the options used.
        </span>
        <div className={styles.collatorTest}>
          {tests.map((test, index) => {
            const expectedString = test.expected.join(', ');
            const actualString = [...test.input].sort(test.intl.compare).join(', ');
            const pass = expectedString === actualString;
            const title = JSON.stringify(test.intl.resolvedOptions(), null, 2);

            return (
              <Fragment key={index}>
                <span
                  title={title}
                  className={classNames({
                    [styles.pass]: pass,
                    [styles.fail]: !pass,
                  })}
                >
                  {pass ? 'Pass' : 'Fail'}
                </span>
                <Code title={title}>{`${test.input.join(', ')} => ${actualString}`}</Code>
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className={styles.collator}>
        <span className={styles.description}>
          Custom test string that will be separated by a specified separator (space by default) and sorted using the
          collator with the options above. Funny thing: space is considered punctuation, so things like 'ab' and 'a b'
          are affected by the ignorePunctuation option.
        </span>
        <div className={styles.testSettings}>
          <span>Separator:</span>
          <Input onChange={(e) => setSeparator(e.target.value)} value={separator} />
          <Checkbox checked={trim} onChange={setTrim} label="Trim" />
        </div>
        <div className={styles.testStringInput}>
          <Input value={testString} onChange={handleTestStringChange} />
          <Button onClick={() => setTestString('')} text="Clear" />
        </div>
      </div>

      <div className={styles.testStringOutput}>
        {sortWithIntl(splitString(testString))
          .filter((str) => str.length > 0)
          .map((str, index) => (
            <Code key={`${index}-str`}>{str}</Code>
          ))}
      </div>
    </div>
  );
};
