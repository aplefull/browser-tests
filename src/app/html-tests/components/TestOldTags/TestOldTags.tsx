import styles from './styles.module.scss';

export default function TestOldTags() {
  return (
    <section className={styles.oldTags}>
      <h1>Old Tags</h1>
      <div>
        <div>
          <pre>Marquee:</pre>
          <marquee>Hello from 1999!</marquee>
        </div>
        <div>
          <pre>Font:</pre>
          <font color="red">Lorem ipsum dolor sit amet.</font>
        </div>
        <div>
          <pre>Center:</pre>
          <center>Lorem ipsum dolor sit amet.</center>
        </div>
        <div>
          <pre>Strike:</pre>
          <strike>Lorem ipsum dolor sit amet.</strike>
        </div>
        <div>
          <pre>U:</pre>
          <u>Lorem ipsum dolor sit amet.</u>
        </div>
        <div>
          <pre>Big:</pre>
          <big>Lorem ipsum dolor sit amet.</big>
        </div>
        <div>
          <pre>Small:</pre>
          <small>Lorem ipsum dolor sit amet.</small>
        </div>
        <div>
          <pre>Dir:</pre>
          <dir>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </dir>
        </div>
      </div>
    </section>
  );
}
