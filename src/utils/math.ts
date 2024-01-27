import { getArray, getErrorMessage, range, table } from '@utils';

export class QMath {
  static INDETERMINATE = NaN;

  static isInteger(n: number) {
    return Number.isInteger(n);
  }

  static isFloat(n: number) {
    return !Number.isInteger(n);
  }

  static isOdd(n: number) {
    if (!QMath.isInteger(n)) {
      throw new Error('Expected integer value for isOdd');
    }

    return n % 2 !== 0;
  }

  static isEven(n: number) {
    if (!QMath.isInteger(n)) {
      throw new Error('Expected integer value for isEven');
    }

    return n % 2 === 0;
  }

  static integerPart(n: number) {
    return Math.trunc(n);
  }

  static fractionalPart(n: number) {
    return n - QMath.integerPart(n);
  }

  static mod(n: number, m: number) {
    if (m === 0) {
      return QMath.INDETERMINATE;
    }

    return parseFloat((((n % m) + m) % m).toFixed(10));
  }

  static quotient(n: number, m: number) {
    if (n === 0 && m === 0) {
      return QMath.INDETERMINATE;
    }

    if (m === 0) {
      return Infinity;
    }

    return (n - this.mod(n, m)) / m;
  }

  static max(...args: number[] | number[][]) {
    return Math.max(...getArray(args));
  }

  static min(...args: number[] | number[][]) {
    return Math.min(...getArray(args));
  }

  static pow(base: number, exponent: number) {
    return base ** exponent;
  }

  static exp(n: number) {
    return Math.exp(n);
  }

  static sqrt(n: number) {
    return Math.sqrt(n);
  }

  static cbrt(n: number) {
    return Math.cbrt(n);
  }

  static root(base: number, root: number) {
    return base ** (1 / root);
  }

  static log(n: number) {
    return Math.log(n);
  }

  static ln(n: number) {
    return Math.log(n);
  }

  static log2(n: number) {
    return Math.log2(n);
  }

  static log10(n: number) {
    return Math.log10(n);
  }

  static abs(n: number) {
    return Math.abs(n);
  }

  static sign(n: number) {
    return Math.sign(n);
  }

  static ceil(n: number) {
    return Math.ceil(n);
  }

  static floor(n: number) {
    return Math.floor(n);
  }

  static round(n: number) {
    return Math.round(n);
  }

  static roundTo(n: number, decimals: number) {
    return Math.round(n * 10 ** decimals) / 10 ** decimals;
  }

  static trunc(n: number) {
    return Math.trunc(n);
  }

  static toFixed(n: number, decimals: number) {
    return n.toFixed(decimals);
  }

  static sin(n: number) {
    return Math.sin(n);
  }

  static cos(n: number) {
    return Math.cos(n);
  }

  static tan(n: number) {
    return Math.tan(n);
  }

  static cot(n: number) {
    return 1 / Math.tan(n);
  }

  static sec(n: number) {
    return 1 / Math.cos(n);
  }

  static csc(n: number) {
    return 1 / Math.sin(n);
  }

  static asin(n: number) {
    return Math.asin(n);
  }

  static acos(n: number) {
    return Math.acos(n);
  }

  static atan(n: number) {
    return Math.atan(n);
  }

  static acot(n: number) {
    return Math.atan(1 / n);
  }

  static asec(n: number) {
    return Math.acos(1 / n);
  }

  static acsc(n: number) {
    return Math.asin(1 / n);
  }

  static sinh(n: number) {
    return Math.sinh(n);
  }

  static cosh(n: number) {
    return Math.cosh(n);
  }

  static tanh(n: number) {
    return Math.tanh(n);
  }

  static coth(n: number) {
    return 1 / Math.tanh(n);
  }

  static sech(n: number) {
    return 1 / Math.cosh(n);
  }

  static csch(n: number) {
    return 1 / Math.sinh(n);
  }

  static asinh(n: number) {
    return Math.asinh(n);
  }

  static acosh(n: number) {
    return Math.acosh(n);
  }

  static atanh(n: number) {
    return Math.atanh(n);
  }

  static acoth(n: number) {
    return Math.atanh(1 / n);
  }

  static asech(n: number) {
    return Math.acosh(1 / n);
  }

  static acsch(n: number) {
    return Math.asinh(1 / n);
  }

  static sinc(n: number) {
    if (n === 0) {
      return 1;
    }

    return Math.sin(n) / n;
  }

  static factorial(n: number) {
    const round = Math.round(n);

    if (round !== n || n < 0) {
      throw new Error('Factorial can only be applied to positive integers');
    }

    let value = round;
    for (let i = round - 1; i > 0; i--) {
      value *= i;
    }

    return value;
  }

  static doubleFactorial(n: number) {
    const round = Math.round(n);

    if (round !== n || n < 0) {
      throw new Error('Double factorial can only be applied to positive integers');
    }

    let value = round;
    for (let i = round - 2; i > 0; i -= 2) {
      value *= i;
    }

    return value;
  }

  static gamma(n: number) {
    if (n < 0 && this.isInteger(n)) {
      throw new Error('Gamma function is not defined for negative integers');
    }

    if (n === 0) {
      return Infinity;
    }

    const p = [
      2.5066282746310002416, 4499733.2032111249864, -20736874.207921471447, 40593537.779470548034,
      -44051677.245361812413, 29022416.964741762727, -11961975.070984970778, 3069787.2236644583754,
      -474095.83171179273631, 41165.367438811706961, -1786.1766916579956614, 31.55330123961323352,
      -0.15439106284567441496, 8.935666376564255079e-5, -4.3653007044059417848e-10,
    ];

    const length = p.length;
    let result = p[0];

    for (let i = 1; i < length; i++) {
      result += p[i] / (n + i);
    }

    result *= this.exp(-(n + length)) * this.pow(n + length, n + 0.5);

    return result / n;
  }

  static pochhammer(x: number, n: number) {
    return this.gamma(x + n) / this.gamma(x);
  }

  static gcd(...args: number[]) {
    const gcd2 = (a: number, b: number): number => {
      if (a === 0) {
        return b;
      }

      if (b === 0) {
        return a;
      }

      return gcd2(b, a % b);
    };

    let result = args[0];

    for (let i = 1; i < args.length; i++) {
      result = gcd2(result, args[i]);
    }

    return result;
  }

  static lcm(...args: number[]) {
    const lcm2 = (a: number, b: number): number => {
      return (a * b) / this.gcd(a, b);
    };

    let result = args[0];

    for (let i = 1; i < args.length; i++) {
      result = lcm2(result, args[i]);
    }

    return result;
  }

  static erf(n: number) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = n < 0 ? -1 : 1;
    const x = this.abs(n);

    const t = 1 / (1 + p * x);
    const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * this.exp(-x * x);

    return sign * y;
  }

  static fibonacchi(n: number) {
    if (this.isInteger(n)) {
      const values = [0, 1];

      for (let i = 2; i <= n; i++) {
        values.push(values[i - 1] + values[i - 2]);
      }

      return values[n];
    }

    return (
      (this.pow((1 + this.sqrt(5)) / 2, n) - this.cos(n * Math.PI) * this.pow((1 - this.sqrt(5)) / 2, -n)) /
      this.sqrt(5)
    );
  }

  static lucas(n: number) {
    if (this.isInteger(n)) {
      const values = [2, 1];

      for (let i = 2; i <= n; i++) {
        values.push(values[i - 1] + values[i - 2]);
      }

      return values[n];
    }

    return this.pow((1 + this.sqrt(5)) / 2, n) + this.pow((1 - this.sqrt(5)) / 2, -n) * this.cos(n * Math.PI);
  }

  static factorInteger(n: number) {
    if (!this.isInteger(n)) {
      throw new Error('Expected integer value for factorInteger');
    }

    if (n === 0) return [];

    if (n === 1) return [1];

    const result = [];

    for (let i = 2; i <= n; i++) {
      while (n % i === 0) {
        result.push(i);
        n /= i;
      }
    }

    return result;
  }

  static mobiusMu(n: number) {
    if (n === 1) {
      return 1;
    }

    const factors = QMath.factorInteger(n);

    if (factors.some((factor) => factors.filter((f) => f === factor).length > 1)) {
      return 0;
    }

    return factors.length % 2 === 0 ? 1 : -1;
  }
}

// TODO move?
const diff = <T>(arr1: T[], arr2: T[]) => {
  if (arr1.length !== arr2.length) {
    return null;
  }

  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      result.push({ value1: arr1[i], value2: arr2[i] });
    }
  }

  return result;
};

export const testQMath = async () => {
  // Some default test inputs
  const DEFAULT_TEST_VALUES = {
    Infinity: [-Infinity, Infinity],
    NaN: [NaN],
    ZERO: [-0, 0],
    SPECIAL_MATH: [-Infinity, -0, 0, Infinity],
    SPECIAL_JS: [-Infinity, -0, 0, Infinity, NaN],
  };

  const testValues = await import('@data/qmathTestData.json');

  const tests = [
    {
      name: 'isInteger',
      fn: QMath.isInteger,
      values: range(-100, 100, 0.2),
      expected: range(-100, 100, 0.2).map((n) => Number.isInteger(n)),
    },
    {
      name: 'isFloat',
      fn: QMath.isFloat,
      values: range(-100, 100, 0.2),
      expected: range(-100, 100, 0.2).map((n) => !Number.isInteger(n)),
    },
    {
      name: 'isOdd',
      fn: QMath.isOdd,
      values: range(-100, 100, 0.2),
      expected: range(-100, 100, 0.2).map((n) => {
        if (!Number.isInteger(n)) {
          return 'Expected integer value for isOdd';
        }

        return n % 2 !== 0;
      }),
    },
    {
      name: 'isEven',
      fn: QMath.isEven,
      values: range(-100, 100, 0.2),
      expected: range(-100, 100, 0.2).map((n) => {
        if (!Number.isInteger(n)) {
          return 'Expected integer value for isEven';
        }

        return n % 2 === 0;
      }),
    },
    {
      name: 'integerPart',
      fn: QMath.integerPart,
      values: range(-100, 100, 0.2),
      expected: range(-100, 100, 0.2).map((n) => Math.trunc(n)),
    },
    {
      name: 'fractionalPart',
      fn: QMath.fractionalPart,
      values: range(-100, 100, 0.2),
      expected: range(-100, 100, 0.2).map((n) => n - Math.trunc(n)),
    },
    {
      name: 'mod',
      fn: QMath.mod,
      values: table(range(-10, 10, 0.2), range(-10, 10, 0.2)).flat(),
      expected: testValues.mod.map((n) => {
        if (n === 'Indeterminate') {
          return QMath.INDETERMINATE;
        }

        return n;
      }),
    },
    {
      name: 'quotient',
      fn: QMath.quotient,
      values: table(range(-10, 10, 0.2), range(-10, 10, 0.2)).flat(),
      expected: testValues.quotient.map((n) => {
        if (n === 'Indeterminate') {
          return QMath.INDETERMINATE;
        }

        if (n === 'Infinity') {
          return Infinity;
        }

        return n;
      }),
    },
  ];

  return;

  tests.forEach(({ name, fn, values, expected }) => {
    const actual = values.map((value) => {
      try {
        if (typeof value === 'number') {
          return fn(value);
        }

        return fn(value.x, value.y);
      } catch (e) {
        return getErrorMessage(e);
      }
    });
    const passed = actual.every((value, index) => value === expected[index]);

    console.log(`Test ${name} ${passed ? 'passed' : 'failed'}`);

    if (!passed) {
      console.log(diff(actual, expected));
    }
  });
};
