import styles from './styles.module.scss';

export default function TestCssDropdown() {
  return (
    <section className={styles.cssDropdown}>
      <h1>CSS-only collapse with transition to auto height</h1>
      <div className={styles.dropdown}>
        <input type="checkbox" id="dropdown-toggle" />
        <label htmlFor="dropdown-toggle">Click me</label>
        <div>
          <div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut commodi debitis delectus deleniti doloremque
              error, illum ipsa ipsum maiores molestias natus nisi odio veniam vero voluptatum! Facilis incidunt odit
              provident?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
