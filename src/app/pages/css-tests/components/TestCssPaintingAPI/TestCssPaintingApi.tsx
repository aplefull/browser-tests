import styles from './styles.module.scss';
import worklet from './worklets/painter?script';
import { useEffect } from 'react';
import classNames from 'classnames';

export const TestCssPaintingApi = () => {
  const isSupported = 'paintWorklet' in CSS;

  useEffect(() => {
    const init = async () => {
      if (!isSupported) return;

      await CSS.paintWorklet.addModule(worklet);
    };

    init().catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.dotsContainer}>
        <div className={styles.dots} />
      </div>
      <div className={styles.dotsContainer}>
        <div className={classNames(styles.dots, styles.fixedNumber)} />
      </div>
      <textarea
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias doloribus ea, et exercitationem fuga fugit
        incidunt magnam neque odit praesentium quas quos recusandae rem repellendus sequi sit voluptatem voluptatibus.
        Dolorem expedita hic id incidunt laboriosam mollitia officia officiis veniam? Ea fugit in modi natus, neque
        possimus quod sequLorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid cum, debitis deleniti
        iure magni modi mollitia necessitatibus nemo quo. A aliquam aliquid aut autem beatae consequatur dolor dolorem
        eos explicabo, fugiat hic libero maiores nisi, non nulla pariatur placeat quasi quis quo rem rerum sunt ullam
        vel velit voluptas."
        className={styles.gradientText}
      />
      <span className={styles.maskImage}>Hello!</span>
    </div>
  );
};
