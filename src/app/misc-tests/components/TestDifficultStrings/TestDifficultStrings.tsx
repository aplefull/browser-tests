import styles from './styles.module.scss';
import textFile from '@/assets/data/blns.txt?raw';

export default function TestDifficultStrings() {
  const data = textFile.split('\n');
  const strings = data.filter((string: string) => !string.startsWith('#') && string.length > 0);

  return (
    <section className={styles.testDifficultStrings}>
      <h1>Difficult strings</h1>
      <div className={styles.stringsContainer}>
        {strings.map((string: string, index: number) => {
          return <span key={index}>{string}</span>;
        })}
      </div>
    </section>
  );
}
