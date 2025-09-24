import styles from './styles.module.scss';
import classNames from 'classnames';
import spaceCat from '@assets/images/cats/space-cat.jpg';
import flyingCat from '@assets/images/cats/flying-cat.png';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { useState } from 'react';

export const TestCssGrid = () => {
  const [animationEnabled, setAnimationEnabled] = useState(false);

  return (
    <div className={styles.cssGrid}>
      <div>
        <h2>Grid areas</h2>
        <div className={styles.gridTemplateAreas}>
          <div className={classNames(styles.gridItem, styles.a)}>
            <span>Item a</span>
          </div>
          <div className={classNames(styles.gridItem, styles.b)}>
            <span>Item b</span>
          </div>
          <div className={classNames(styles.gridItem, styles.c)}>
            <span>Item c</span>
          </div>
        </div>
      </div>
      <div>
        <h2>Auto-fit minmax</h2>
        <Checkbox checked={animationEnabled} onChange={setAnimationEnabled} label="Enable animation" />
        <div
          className={classNames(styles.gridAutoFitMinmax, {
            [styles.animated]: animationEnabled,
          })}
        >
          <div className={styles.gridItem}>1</div>
          <div className={styles.gridItem}>2</div>
          <div className={styles.gridItem}>3</div>
          <div className={styles.gridItem}>4</div>
          <div className={styles.gridItem}>5</div>
        </div>
      </div>
      <div>
        <h2>Subgrid columns</h2>
        <div className={styles.subgridColumns}>
          <div className={styles.subgridItem}>
            <h2>Lorem ipsum</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda recusandae maxime distinctio quos ullam
              incidunt.
            </p>
            <img src={flyingCat} alt="" />
          </div>
          <div className={styles.subgridItem}>
            <h2>Omnis, veritatis odio.</h2>
            <p>
              Enim molestiae recusandae ut dolor sit amet consectetur adipisicing. odit possimus eius inventore. Quasi
              illo unde neque? Itaque, deleniti adipisci?
            </p>
            <img src={spaceCat} alt="" />
          </div>
          <div className={styles.subgridItem}>
            <h2>Exercitationem, libero quam!</h2>
            <p>Error maiores culpa eaque. Quam quisquam quae nostrum ipsa dolorum atque aperiam fugit soluta error!</p>
            <img src={spaceCat} alt="" />
          </div>
          <div className={styles.subgridItem}>
            <h2>Quibusdam, recusandae odio.</h2>
            <p>
              Corporis laboriosam, neque est commodi architecto voluptatem, ipsam corrupti ullam similique eligendi hic
              qui natus?
            </p>
            <img src={spaceCat} alt="" />
          </div>
          <div className={styles.subgridItem}>
            <h2>Modi, exer citat ionem dicta.</h2>
            <p>
              Laboriosam, aliquam tempore minus dolorem ullam et veniam asperiores, eveniet vitae odit itaque eligendi
              ducimus?
            </p>
            <img src={flyingCat} alt="" />
          </div>
          <div className={styles.subgridItem}>
            <h2>Dolore.</h2>
            <p>
              Reprehenderit, labore. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt, aut. harum vitae
              voluptate alias saepe debitis quo perspiciatis, delectus fugiat modi eveniet.
            </p>
            <img src={flyingCat} alt="" />
          </div>
        </div>
      </div>
      <div>
        <h2>Subgrid rows</h2>
        <div className={styles.subgridRows}>
          <ul>
            <li>Lorem ipsum dolor sit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores?</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipisicing.</li>
            <li>Lorem ipsum dolor sit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipisicing.</li>
            <li>Lorem ipsum dolor.</li>
          </ul>
          <ul>
            <li>Lorem ipsum dolor sit.</li>
            <li>Lorem ipsum dolor sit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, molestiae.</li>
            <li>Lorem ipsum dolor.</li>
            <li>Lorem ipsum dolor.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum.</li>
            <li>Lorem ipsum.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
