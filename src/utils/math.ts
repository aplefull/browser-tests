import { getArray } from '@utils';

export class QMath {
  constructor() {
    const all = [
      QMath.isInteger,
      QMath.isFloat,
      QMath.isOdd,
      QMath.isEven,
      QMath.integerPart,
      QMath.fractionalPart,
      QMath.mod,
      QMath.quotient,
      QMath.max,
      QMath.min,
      QMath.random,
      QMath.randomInt,
      QMath.randomSample,
      QMath.sort,
      QMath.lerp,
      QMath.discreteDelta,
      QMath.kroneckerDelta,
      QMath.unitStep,
      QMath.isPrime,
      QMath.prime,
      QMath.primePi,
      QMath.divisors,
      QMath.sumOfSquares,
      QMath.sum,
      QMath.product,
      QMath.meanGeometric,
      QMath.mean,
      QMath.median,
      QMath.pow,
      QMath.exp,
      QMath.sqrt,
      QMath.cbrt,
      QMath.root,
      QMath.log,
      QMath.ln,
      QMath.log2,
      QMath.log10,
      QMath.abs,
      QMath.sign,
      QMath.ceil,
      QMath.floor,
      QMath.round,
      QMath.roundTo,
      QMath.trunc,
      QMath.toFixed,
      QMath.sin,
      QMath.cos,
      QMath.tan,
      QMath.cot,
      QMath.sec,
      QMath.csc,
      QMath.asin,
      QMath.acos,
      QMath.atan,
      QMath.acot,
      QMath.asec,
      QMath.acsc,
      QMath.sinh,
      QMath.cosh,
      QMath.tanh,
      QMath.coth,
      QMath.sech,
      QMath.csch,
      QMath.asinh,
      QMath.acosh,
      QMath.atanh,
      QMath.acoth,
      QMath.asech,
      QMath.acsch,
      QMath.sinc,
      QMath.factorial,
      QMath.doubleFactorial,
      QMath.gamma,
      QMath.beta,
      QMath.erf,
      QMath.pochhammer,
      QMath.gcd,
      QMath.lcm,
      QMath.fibonacci,
      QMath.lucas,
      QMath.factorInteger,
      QMath.moebiusMu,
    ];

    Object.assign(this, ...all);
  }

  static INDETERMINATE = NaN;

  static isInteger(n: number) {
    return Number.isInteger(n);
  }

  static chop(n: number) {
    const diff = n - parseFloat(n.toFixed(5));

    if (diff < 0.00001) {
      return parseFloat(n.toFixed(5));
    }

    return n;
  }

  static chopToInt = (n: number) => {
    if (Math.abs(n - Math.round(n)) < 0.00001) {
      return Math.round(n);
    }

    return n;
  };

  static isFloat(n: number) {
    if (Number.isNaN(n) || n === Infinity || n === -Infinity) {
      return false;
    }

    return !Number.isInteger(n);
  }

  static isOdd(n: number) {
    if (!QMath.isInteger(n)) {
      return false;
    }

    return n % 2 !== 0;
  }

  static isEven(n: number) {
    if (!QMath.isInteger(n)) {
      return false;
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

    if (Number.isNaN(n) || Number.isNaN(m)) {
      return QMath.INDETERMINATE;
    }

    const signN = n < 0 ? -1 : 1;
    const signM = m < 0 ? -1 : 1;
    const sign = signN * signM;

    if (m === 0) {
      return sign * Infinity;
    }

    return sign * QMath.integerPart(QMath.chopToInt(QMath.abs(n) / QMath.abs(m)));
  }

  static max(...args: number[] | number[][]) {
    return Math.max(...getArray(args));
  }

  static min(...args: number[] | number[][]) {
    return Math.min(...getArray(args));
  }

  static random(from?: number, to?: number, includeEnd?: boolean) {
    if (from === undefined) {
      return Math.random();
    }

    if (to === undefined) {
      return Math.random() * from;
    }

    if (includeEnd) {
      return Math.random() * (to - from + 1) + from;
    }

    return Math.random() * (to - from) + from;
  }

  static randomInt(from?: number, to?: number, includeEnd?: boolean) {
    return Math.round(QMath.random(from, to, includeEnd));
  }

  static randomSample<T>(array: T[], size: number = 1) {
    const result = [];

    for (let i = 0; i < size; i++) {
      result.push(array[Math.floor(Math.random() * array.length)]);
    }

    return result;
  }

  static sort(array: number[], order: 'asc' | 'desc' = 'asc') {
    return array.sort((a, b) => (order === 'asc' ? a - b : b - a));
  }

  static lerp(from: number, to: number, t: number) {
    return from + (to - from) * t;
  }

  static discreteDelta(...args: number[] | number[][]) {
    const array = getArray(args);

    if (array.some((value) => Number.isNaN(value))) return QMath.INDETERMINATE;

    if (array.length === 1) {
      return array[0] === 0 ? 1 : 0;
    }

    return array.every((value) => value === 0) ? 1 : 0;
  }

  static kroneckerDelta(...args: number[] | number[][]) {
    const array = getArray(args);

    if (array.some((value) => Number.isNaN(value))) return QMath.INDETERMINATE;

    if (array.length === 1) {
      return array[0] === 0 ? 1 : 0;
    }

    return array.every((value) => value === array[0]) ? 1 : 0;
  }

  static unitStep(...args: number[] | number[][]) {
    const array = getArray(args);

    if (array.length === 1) {
      return array[0] < 0 ? 0 : 1;
    }

    return array.every((value) => value < 0) ? 0 : 1;
  }

  static isPrime(n: number) {
    if (n < 2) {
      return false;
    }

    if (Number.isNaN(n) || n === Infinity || n === -Infinity) {
      return false;
    }

    for (let i = 2; i < n; i++) {
      if (n % i === 0) {
        return false;
      }
    }

    return true;
  }

  static prime(n: number) {
    if (n < 1) {
      return QMath.INDETERMINATE;
    }

    if (Number.isNaN(n) || n === Infinity || n === -Infinity) {
      return QMath.INDETERMINATE;
    }

    let count = 0;
    let i = 2;

    while (count < n) {
      if (QMath.isPrime(i)) {
        count++;
      }

      i++;
    }

    return i - 1;
  }

  static primePi(n: number) {
    if (n < 2) {
      return 0;
    }

    if (Number.isNaN(n) || n === Infinity || n === -Infinity) {
      return QMath.INDETERMINATE;
    }

    let count = 0;

    for (let i = 2; i <= n; i++) {
      if (QMath.isPrime(i)) {
        count++;
      }
    }

    return count;
  }

  static divisors(n: number) {
    const divisors = [];

    for (let i = 1; i <= n / 2; i++) {
      if (n % i === 0) {
        divisors.push(i);
      }
    }

    return divisors;
  }

  static sumOfSquares(...args: number[] | number[][]) {
    return getArray(args).reduce((acc, curr) => acc + curr ** 2, 0);
  }

  static sum(...args: number[] | number[][]) {
    return getArray(args).reduce((acc, curr) => acc + curr, 0);
  }

  static product(...args: number[] | number[][]) {
    return getArray(args).reduce((acc, curr) => acc * curr, 1);
  }

  static meanGeometric(...args: number[] | number[][]) {
    return QMath.product(...getArray(args)) ** (1 / getArray(args).length);
  }

  static mean(...args: number[] | number[][]) {
    return QMath.sum(...getArray(args)) / getArray(args).length;
  }

  static median(...args: number[] | number[][]) {
    const array = QMath.sort(getArray(args));
    const middle = Math.floor(array.length / 2);

    if (array.length % 2 === 0) {
      return (array[middle - 1] + array[middle]) / 2;
    }

    return array[middle];
  }

  static pow(base: number, exponent: number) {
    if (Number.isNaN(base) || Number.isNaN(exponent)) return QMath.INDETERMINATE;
    if (base === -Infinity && exponent === Infinity) return QMath.INDETERMINATE;

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

  static root(value: number, power: number) {
    if (power === 0) return QMath.INDETERMINATE;
    if (Number.isNaN(value) || Number.isNaN(power)) return QMath.INDETERMINATE;
    if (QMath.abs(value) === Infinity && QMath.abs(power) === Infinity) return QMath.INDETERMINATE;

    return value ** (1 / power);
  }

  static log(n: number, base: number = Math.E) {
    if (n === 0 && base === 1) return QMath.INDETERMINATE;
    if (n === 1 && base === Infinity) return QMath.INDETERMINATE;
    if (n === 1 && base === 0) return QMath.INDETERMINATE;

    return QMath.ln(n) / QMath.ln(base);
  }

  static ln(n: number) {
    if (n === 0) return -Infinity;
    if (n === 1) return 0;
    if (n === Infinity) return Infinity;
    if (n > 0 && n < 1) return -Infinity;

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
    if (!QMath.isInteger(decimals) || decimals < 0) {
      return QMath.INDETERMINATE;
    }

    return Math.round(n * 10 ** decimals) / 10 ** decimals;
  }

  static trunc(n: number) {
    return Math.trunc(n);
  }

  static toFixed(n: number, decimals: number) {
    if (!QMath.isInteger(decimals) || decimals < 0 || QMath.abs(decimals) === Infinity) {
      return QMath.INDETERMINATE.toString();
    }

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
    if (n === 0) {
      return QMath.INDETERMINATE;
    }

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
    if (n === 0) {
      return QMath.INDETERMINATE;
    }

    return Math.acosh(1 / n);
  }

  static acsch(n: number) {
    if (n === 0) {
      return QMath.INDETERMINATE;
    }

    return Math.asinh(1 / n);
  }

  static sinc(n: number) {
    if (n === 0) {
      return 1;
    }

    return Math.sin(n) / n;
  }

  static factorial(n: number) {
    if (n === Infinity) return Infinity;
    if (n === -Infinity) return QMath.INDETERMINATE;
    if (n === 0) return 1;

    if (n < 0 || !QMath.isInteger(n)) {
      return QMath.INDETERMINATE;
    }

    let value = n;
    for (let i = n - 1; i > 0; i--) {
      value *= i;
    }

    return value;
  }

  static doubleFactorial(n: number) {
    if (n === Infinity) return Infinity;
    if (n === -Infinity) return QMath.INDETERMINATE;
    if (n === 0) return 1;

    if (n < 0 || !QMath.isInteger(n)) {
      return QMath.INDETERMINATE;
    }

    let value = n;
    for (let i = n - 2; i > 0; i -= 2) {
      value *= i;
    }

    return value;
  }

  static gamma(n: number) {
    if (n === Infinity) return Infinity;
    if (n === -Infinity) return QMath.INDETERMINATE;
    if (n === 0) return QMath.INDETERMINATE;

    if (n < 0 && QMath.isInteger(n)) {
      return QMath.INDETERMINATE;
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

    result *= QMath.exp(-(n + length)) * QMath.pow(n + length, n + 0.5);

    return result / n;
  }

  static beta(x: number, y: number) {
    if (
      (x > 0 && y > 0) ||
      (!QMath.isInteger(y) && x > 0) ||
      (!QMath.isInteger(x) && y > 0) ||
      (!QMath.isInteger(x) && !QMath.isInteger(y))
    ) {
      if (QMath.isInteger(QMath.chop(x + y)) && x + y < 0) return 0;
      if (QMath.chop(x + y) === 0) return 0;

      return (QMath.gamma(x) * QMath.gamma(y)) / QMath.gamma(x + y);
    }

    return QMath.INDETERMINATE;
  }

  static erf(n: number) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = n < 0 ? -1 : 1;
    const x = QMath.abs(n);

    const t = 1 / (1 + p * x);
    const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * QMath.exp(-x * x);

    return sign * y;
  }

  static pochhammer(x: number, n: number) {
    if (x + n <= 0) return QMath.INDETERMINATE;

    return QMath.gamma(QMath.chop(x + n)) / QMath.gamma(QMath.chop(x));
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
      return (a * b) / QMath.gcd(a, b);
    };

    let result = args[0];

    for (let i = 1; i < args.length; i++) {
      result = lcm2(result, args[i]);
    }

    return result;
  }

  static fibonacci(n: number) {
    if (n === Infinity) return Infinity;
    if (n === -Infinity) return -Infinity;

    if (QMath.isInteger(n)) {
      if (n < 0) {
        const values = [0, 1];

        for (let i = -1; i >= n; i--) {
          values.unshift(values[1] - values[0]);
        }

        return values[0];
      }

      const values = [0, 1];

      for (let i = 2; i <= n; i++) {
        values.push(values[i - 1] + values[i - 2]);
      }

      return values[n];
    }

    return (
      (QMath.pow((1 + QMath.sqrt(5)) / 2, n) - QMath.cos(n * Math.PI) * QMath.pow((1 - QMath.sqrt(5)) / 2, -n)) /
      QMath.sqrt(5)
    );
  }

  static lucas(n: number) {
    if (QMath.isInteger(n)) {
      const values = [2, 1];

      for (let i = 2; i <= n; i++) {
        values.push(values[i - 1] + values[i - 2]);
      }

      return values[n];
    }

    return QMath.pow((1 + QMath.sqrt(5)) / 2, n) + QMath.pow((1 - QMath.sqrt(5)) / 2, -n) * QMath.cos(n * Math.PI);
  }

  static factorInteger(n: number) {
    if (!QMath.isInteger(n)) {
      return [];
    }

    const sign = n < 0 ? -1 : 1;
    n = QMath.abs(n);

    if (n === 0) return [0];
    if (n === 1) return [sign * 1];

    const result = [];

    for (let i = 2; i <= n; i++) {
      while (n % i === 0) {
        result.push(i);
        n /= i;
      }
    }

    return [sign * result[0], ...result.slice(1)];
  }

  static moebiusMu(n: number) {
    if (!QMath.isInteger(n)) {
      return QMath.INDETERMINATE;
    }

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
