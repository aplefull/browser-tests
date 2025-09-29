import { Header } from '@/app/components/Header/Header';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';
import { ColorPreview } from '@/app/components/ColorPreview/ColorPreview';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import styles from './styles.module.scss';

export const DevDemoPage = () => {
  const mockError = {
    message: 'Test error message',
    stack: `Error: Test error message
    at Object.throwError (/path/to/file.js:123:45)
    at handleClick (/path/to/component.tsx:67:89)
    at onClick (/path/to/button.tsx:12:34)
    at HTMLButtonElement.click (native)`,
  };

  const jsonData = {
    longString:
      'This is a very long string that should be truncated to test the maxStringLength feature. It contains lots of text to demonstrate how the component handles lengthy content gracefully.',
    emptyString: '',
    number: 42,
    float: 3.14159,
    boolean: true,
    nullValue: null,
    undefinedValue: undefined,
    nanValue: NaN,
    infinity: -Infinity,
    function: function example() {
      return 'This is a function';
    },
    arrowFunction: () => 'arrow function',
    date: new Date('2024-01-01T12:00:00Z'),
    regex: /ab+c/i,
    array: [1, 'two', { three: 3 }, [4, 5]],
    object: {
      nestedString: 'Nested Hello',
      nestedNumber: 100,
      nestedArray: [true, false, null],
      nestedObject: {
        deepKey: 'Deep Value',
      },
    },
    emptyArray: [],
    emptyObject: {},
    symbol: Symbol('sym'),
    bigInt: BigInt('12345678901234567890'),
    map: new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ]),
    set: new Set([{ c: new Date() }]),
    weakMap: new WeakMap([[{}, 'value']]),
    weakSet: new WeakSet(),
    error: new Error('This is an error'),
    promise: new Promise((resolve) => resolve('Resolved')),
    typedArray: new Uint8Array([1, 2, 3, 4, 5]),
    arrayBuffer: new ArrayBuffer(8),
    dataView: new DataView(new ArrayBuffer(16)),
    int8Array: new Int8Array([-128, 0, 127]),
    uint8Array: new Uint8Array([0, 255]),
    int16Array: new Int16Array([-32768, 0, 32767]),
    uint16Array: new Uint16Array([0, 65535]),
    int32Array: new Int32Array([-2147483648, 0, 2147483647]),
    uint32Array: new Uint32Array([0, 4294967295]),
    float32Array: new Float32Array([1.5, 2.5, 3.5]),
    float64Array: new Float64Array([1.123456789, 2.987654321]),
    deepArray: [[[[[[[[[[[[[[['Value']]]]]]]]]]]]]]],
    deepObject: { a: { b: { c: { d: { e: { f: { g: { h: { i: { j: 'Value' } } } } } } } } } },
    complex: [
      [
        [
          {
            a: function test() {
              return 'function in object';
            },
          },
          {
            a: [
              {
                value: [
                  1,
                  2,
                  3,
                  null,
                  true,
                  false,
                  'string',
                  function () {},
                  {
                    a: { b: {} },
                  },
                ],
              },
            ],
          },
        ],
      ],
      [],
      [[], [[]]],
      [
        [
          {
            a: [
              {
                b: [
                  null,
                  {
                    c: { e: [] },
                    d: { f: [{}, function () {}, 123, [{}, { a: 'a' }], [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]] },
                  },
                ],
              },
            ],
          },
        ],
      ],
    ],
  };

  const jsonSettings = {
    maxStringLength: 100,
    collapseLevel: 3,
  };

  return (
    <div className={styles.demoPage}>
      <div className={styles.section}>
        <h2>Header Component</h2>
        <div className={styles.demo}>
          <Header />
        </div>
      </div>

      <div className={styles.section}>
        <h2>ErrorMessage Component</h2>
        <div className={styles.demo}>
          <ErrorMessage message="This is a sample error message" />
        </div>
        <div className={styles.demo}>
          <ErrorMessage message="Another error with a longer message that shows how it handles text wrapping" />
        </div>
        <div className={styles.demo}>
          <ErrorMessage />
        </div>
      </div>

      <div className={styles.section}>
        <h2>Error Component</h2>
        <div className={styles.demo}>
          <div className={styles.errorContainer}>
            <div className={styles.errorDemo}>
              <h1>Ooops, something went so bad that entire page crashed...</h1>
              <h2>
                A thing happened: <span>Test error message</span>
              </h2>
              <pre>{mockError.stack}</pre>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Color System</h2>
        <div className={styles.demo}>
          <ColorPreview />
        </div>
      </div>

      <div className={styles.section}>
        <h2>JSON Component</h2>
        <div className={styles.demo}>
          <Json data={jsonData} settings={jsonSettings} />
        </div>
      </div>
    </div>
  );
};
