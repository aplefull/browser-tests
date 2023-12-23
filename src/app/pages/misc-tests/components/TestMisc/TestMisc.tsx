import styles from './styles.module.scss';
import { MikuArt } from '@/app/pages/misc-tests/components/subcomponents/MikuArt/MikuArt';
import { Glow } from '@/app/pages/misc-tests/components/subcomponents/Glow/Glow';
import { CounterAnimation } from '@/app/pages/misc-tests/components/subcomponents/CounterAnimation/CounterAnimation';
import { SpriteVideo } from '@/app/pages/misc-tests/components/subcomponents/SpriteVideo/SpriteVideo';

export const TestMisc = () => {
  const divs = (n: number) => {
    return n === 0 ? null : <div>{divs(n - 1)}</div>;
  };

  const divsSelector = (n: number): string => {
    return n === 1 ? 'div' : `div > ${divsSelector(n - 1)}`;
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
      {/*TODO maybe move? and add ability to hide it*/}
      {/*      <div className={styles.nestedDivs}>
        <style>{`${divsSelector(1000)} { background-color: green; };`}</style>
        {divs(1000)}
      </div>*/}
      <h2>Sprite video</h2>
      <SpriteVideo />
    </div>
  );
};
