import styles from '@/app/pages/misc-tests/components/TestMisc/styles.module.scss';
import sprite from '@assets/images/bad-apple-sprite.png';

export const SpriteVideo = () => {
  const spriteFps = 30;
  const framesCount = 6572;

  return (
    <div>
      <div className={styles.spriteContainer}>
        <div className={styles.spriteWindow}>
          <img
            style={{
              animationDuration: `${framesCount / spriteFps}s`,
              animationTimingFunction: `steps(${framesCount})`,
            }}
            src={sprite}
            alt=""
            className={styles.sprite}
          />
        </div>
      </div>
    </div>
  );
};
