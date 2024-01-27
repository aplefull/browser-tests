import classNames from 'classnames';
import styles from './styles.module.scss';
import { useEffect } from 'react';
import { isKeyOf } from '@utils';

export const MikuArt = () => {
  const className = 'miku-art-component';

  useEffect(() => {
    const init = async () => {
      const stylesData = await import('@/assets/data/miku-art-styles.json');

      const str = stylesData.data.map((el, i) => {
        const bgc = `background-color: rgb(${el.c});`;
        const clp = `clip-path: polygon(${el.p
          .split(',')
          .map((el) => {
            const points = el.split(' ');
            const replacedPoints = points.map((point) => {
              if (isKeyOf(point, stylesData.dict)) return stylesData.dict[point];
              return point;
            });
            return replacedPoints.join(' ');
          })
          .join(', ')});`;

        return `.${className}-${i} { ${bgc} ${clp} }`;
      });

      const css = str.join('\n');

      const style = document.createElement('style');
      style.innerHTML = css;
      document.head.appendChild(style);
    };

    init().catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      {Array.from({ length: 3186 }, (_, i) => i).map((i) => (
        <div className={classNames(styles.component, `${className}-${i}`)} key={i} />
      ))}
    </div>
  );
};
