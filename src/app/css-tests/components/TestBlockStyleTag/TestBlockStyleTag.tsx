import styles from './styles.module.scss';

export default function TestBlockStyleTag() {
  return (
    <section className={styles.blockStyleTag}>
      <h1>Block style tag and contenteditable attribute</h1>
      <style className="block-style" contentEditable suppressContentEditableWarning>
        {`
          .block-style {
            color: #45dec5;
          }
        `}
      </style>
    </section>
  );
}
