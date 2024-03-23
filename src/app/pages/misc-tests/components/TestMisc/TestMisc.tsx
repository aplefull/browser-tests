import { MikuArt } from '@/app/pages/misc-tests/components/subcomponents/MikuArt/MikuArt';
import { Glow } from '@/app/pages/misc-tests/components/subcomponents/Glow/Glow';
import { CounterAnimation } from '@/app/pages/misc-tests/components/subcomponents/CounterAnimation/CounterAnimation';
import { SpriteVideo } from '@/app/pages/misc-tests/components/subcomponents/SpriteVideo/SpriteVideo';
import { Collapse } from '@/app/components/Collapse/Collapse';
import { DeepNesting } from '@/app/pages/misc-tests/components/TestDeepNesting/TestDeepNesting';
import { Container } from '@/app/components/Container/Container';
import React, { ReactNode, useEffect, useState } from 'react';
import styles from './styles.module.scss';

const Subsection = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapse unmountChildren className={styles.collapse} title={title} open={open} onChange={setOpen}>
      {children}
    </Collapse>
  );
};

export const TestMisc = () => {
  const [testLabeledLoopBreakResult, setTestLabeledLoopBreakResult] = useState<number | null>(null);

  const testLabeledLoopBreak = () => {
    let test = 0;
    outer: for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          test++;

          if (i === 2 && j === 1 && k === 2) {
            break outer;
          }
        }
      }
    }

    setTestLabeledLoopBreakResult(test);
  };

  useEffect(() => {
    testLabeledLoopBreak();
  }, []);

  return (
    <div className={styles.misc}>
      <Subsection title="Glow effect">
        <div className={styles.glow}>
          <Glow brightness={50} />
        </div>
      </Subsection>
      <Subsection title="CSS art">
        <MikuArt />
      </Subsection>
      <Subsection title="Counter-animation">
        <CounterAnimation />
      </Subsection>
      <Subsection title="A lot of nested divs">
        <DeepNesting />
      </Subsection>
      <Subsection title="Sprite video">
        <SpriteVideo />
      </Subsection>
      <Subsection title="Iframe referencing current page">
        <iframe src={window.location.href} className={styles.iframe} />
      </Subsection>
      <Subsection title="Labeled loop break statement">
        <Container direction="row" gap={10}>
          <span>Labeled loop break:</span>
          {testLabeledLoopBreakResult === 24 ? (
            <span className={styles.pass}>Test passed</span>
          ) : (
            <span className={styles.fail}>Test failed</span>
          )}
        </Container>
      </Subsection>
      <Subsection title="Some layouts that are bugged in Chrome/Firefox">
        <div>TODO</div>
      </Subsection>
    </div>
  );
};
