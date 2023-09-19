import styles from './styles.module.scss';
import classNames from 'classnames';

export const TestBlockStyleTag = () => {
  return (
    <style className={classNames('block-style', styles.style)} contentEditable suppressContentEditableWarning>
      {`
          .block-style {
            color: #3b8bd5;
          }
      `}
    </style>
  );
};
