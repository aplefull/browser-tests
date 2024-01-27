import styles from './styles.module.scss';
import { MikuArt } from '@/app/pages/misc-tests/components/subcomponents/MikuArt/MikuArt';
import { Glow } from '@/app/pages/misc-tests/components/subcomponents/Glow/Glow';
import { CounterAnimation } from '@/app/pages/misc-tests/components/subcomponents/CounterAnimation/CounterAnimation';
import { SpriteVideo } from '@/app/pages/misc-tests/components/subcomponents/SpriteVideo/SpriteVideo';
import { Collapse } from '@/app/components/Collapse/Collapse';
import { useState } from 'react';

// TODO move
const Recursion = ({ n }: { n: number }) => {
  return n <= 0 ? null : (
    <div>
      <Recursion n={n - 1} />
    </div>
  );
};

export const TestMisc = () => {
  const [nestedDivsCollapse, setNestedDivsCollapse] = useState(false);
  const [spriteCollapse, setSpriteCollapse] = useState(false);

  const divsSelector = (n: number): string => {
    return n <= 1 ? 'div' : `div > ${divsSelector(n - 1)}`;
  };

  return (
    <div className={styles.misc}>
      <h2>Glow effect</h2>
      <div className={styles.glow}>
        <Glow brightness={50} />
      </div>
      <h2>CSS art</h2>
      <MikuArt />
      <h2>Counter-animation</h2>
      <CounterAnimation />
      <h2>Nested divs</h2>
      <Collapse
        title="Toggle"
        open={nestedDivsCollapse}
        onChange={setNestedDivsCollapse}
        childrenClassName={styles.nestedDivsContainer}
      >
        {/*TODO maybe move? and add ability to hide it*/}
        <div className={styles.nestedDivs}>
          <Recursion n={1000} />
          <style>{`${divsSelector(1000)} { outline: 1px solid red; };`}</style>
        </div>
      </Collapse>
      <h2>Sprite video</h2>
      <Collapse title="Video sprite" open={spriteCollapse} onChange={setSpriteCollapse}>
        <SpriteVideo />
      </Collapse>
      <h2>Some layouts that are bugged in Chrome/Firefox</h2>
      <div></div>
    </div>
  );
};
