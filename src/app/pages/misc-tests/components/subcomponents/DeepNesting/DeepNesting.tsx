import styles from './styles.module.scss';

type TRecursionProps = {
  n: number;
  total?: number;
};

const Recursion = ({ n, total }: TRecursionProps) => {
  total = total || n;
  const level = total - n + 1;

  return n <= 0 ? null : (
    <div data-level={level}>
      <Recursion n={n - 1} total={total} />
    </div>
  );
};

export const DeepNesting = () => {
  const divsSelector = (n: number): string => {
    return n <= 1 ? 'div' : `div > ${divsSelector(n - 1)}`;
  };

  return (
    <div className={styles.nestedDivs}>
      <Recursion n={1000} />
      <style>{`${divsSelector(1000)} { outline: 1px solid red; };`}</style>
    </div>
  );
};
