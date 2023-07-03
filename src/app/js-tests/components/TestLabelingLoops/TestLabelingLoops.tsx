import { useEffect, useState } from 'react';

import styles from './styles.module.scss';

export default function TestLabelingLoops() {
  const [testLabeledLoopBreakResult, setTestLabeledLoopBreakResult] = useState<boolean | null>(null);

  const testLabeledLoopBreak = () => {
    let i = 0;
    let test = 0;
    outer: for (; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        test++;
        if (j === 1 && i === 2) {
          break outer;
        }
      }
    }

    if (test === 8) {
      setTestLabeledLoopBreakResult(true);
    } else {
      setTestLabeledLoopBreakResult(false);
    }
  };

  const getResultText = (result) => {
    if (result === null) {
      return 'Waiting...';
    }

    return result ? (
      <span className={styles.passed}>Test passed</span>
    ) : (
      <span className={styles.failed}>Test failed</span>
    );
  };

  useEffect(() => {
    testLabeledLoopBreak();
  }, []);

  return (
    <section>
      <h1>JS labels</h1>
      <div className={styles.testResult}>
        <span>Labeled loop break:</span>
        {getResultText(testLabeledLoopBreakResult)}
      </div>
    </section>
  );
}
