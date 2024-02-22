import styles from './styles.module.scss';
import { MathMlf1 } from '@/app/pages/misc-tests/components/subcomponents/MathMLF1/MathMLF1';
import { MathMlf2 } from '@/app/pages/misc-tests/components/subcomponents/MathMLF2/MathMLF2';
import classNames from 'classnames';
import { ContextMenu } from '@/app/components/ContextMenu/ContextMenu';
import { copy } from '@/utils/utils';

const pi = '\\pi';
const e = '\\textrm e';
const tau = '\\tau';

const nl = '\n';

const floor = (children: string) => `\\left\\lfloor ${children} \\right\\rfloor`;
const ceil = (children: string) => `\\left\\lceil ${children} \\right\\rceil`;
const abs = (children: string) => `\\abs{${children}}`;
const sqrt = (children: string, base?: string) => (base ? `\\sqrt[${base}]{${children}}` : `\\sqrt{${children}}`);
const erf = (children: string) => `\\erf(${children})`;
const sum = (from: string, to: string, children: string) => `\\sum_{${from}}^{${to}} ${children}`;
const prod = (from: string, to: string, children: string) => `\\prod_{${from}}^{${to}} ${children}`;
const int = (from: string, to: string, children: string) => `\\int_{${from}}^{${to}} ${children}`;
const comb = (n: string, k: string) => `\\mathrm{C}_{${n}}^{${k}}`;
const frac = (numerator: string, denominator: string) => `\\frac{${numerator}}{${denominator}}`;
const pow = (base: string, exponent: string) => `${base}^{${exponent}}`;
const sin = (children: string) => `\\sin(${children})`;
const csc = (children: string) => `\\csc(${children})`;
const ln = (children: string) => `\\ln(${children})`;
const min = (a: string, b: string) => `\\min(${a}, ${b})`;
const argsinh = (children: string) => `\\textrm{argsinh}(${children})`;
const gamma = (children: string) => `\\Gamma(${children})`;
const space = (...children: string[]) => children.join(' ');
const eq = (a: string, b: string) => `${a} = ${b}`;
const matrix = (type: 'vmatrix' | 'pmatrix', children: string[]) => {
  const size = Math.sqrt(children.length);

  if (size !== Math.floor(size)) {
    return 'Invalid matrix size';
  }

  const rows = [];

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(children[i * size + j]);
    }
    rows.push(row.join(' & '));
  }

  return `${nl} \\begin{${type}} ${nl} ${rows.join(' \\\\ ' + nl)} ${nl} \\end{${type}}`;
};
const vmatrix = (children: string[]) => matrix('vmatrix', children);
const pmatrix = (children: string[]) => matrix('pmatrix', children);

const F1_SUM_UPPER_BOUND = ceil(gamma(sum('k=1', ceil(pow('x', space('3', pi))), sin('x'))));
const F1_SUM_LOWER_BOUND = eq(
  'n',
  floor(
    prod(
      'k=0',
      floor(pow('x', '2')),
      frac(space(pi, sqrt(pow('x', tau))), int('0', space('3', sqrt(space(abs('x'), tau))), erf(csc('k*x')))),
    ),
  ),
);

const F1_INT_UPPER_BOUND = comb('n', min('n', abs(erf(argsinh('n')))));
const F1_INT_LOWER_BOUND = int('x', 'n', frac('x', gamma('x')));
const F1_INT_INTEGRAND = vmatrix([
  pi,
  tau,
  sqrt(pow(e, 'n')),
  'n',
  pow('n', ln('x')),
  pi,
  '8',
  frac('n', int('0', 'n', sqrt('x', 'n'))),
  vmatrix(['n', 'x', sqrt('n', int('x', pow('x', '2'), sin('x'))), pi]),
]);

const MATH_ML_LATEX_EQUIV = {
  F1: `f_1(x) = ${sum(F1_SUM_LOWER_BOUND, F1_SUM_UPPER_BOUND, sqrt(int(F1_INT_LOWER_BOUND, F1_INT_UPPER_BOUND, F1_INT_INTEGRAND)))}`,
  F2: ` ${pmatrix(Array.from({ length: 30 * 30 }).map((_, i) => pow('x', (i + 1).toString())))}`,
};

const CopyButton = ({ text }: { text: string }) => {
  const handleCopy = () => {
    copy(text);
  };

  return (
    <div className={styles.contextMenu}>
      <button onClick={handleCopy}>Copy</button>
    </div>
  );
};

export const TestMathMl = () => {
  return (
    <div className={styles.mathMl}>
      <ContextMenu content={<CopyButton text={MATH_ML_LATEX_EQUIV.F1} />}>
        <div className={classNames(styles.content, styles.f1)} title={MATH_ML_LATEX_EQUIV.F1}>
          <MathMlf1 />
        </div>
      </ContextMenu>
      <ContextMenu content={<CopyButton text={MATH_ML_LATEX_EQUIV.F2} />}>
        <div className={classNames(styles.content, styles.matrix)} title={MATH_ML_LATEX_EQUIV.F2}>
          <MathMlf2 />
        </div>
      </ContextMenu>
    </div>
  );
};
