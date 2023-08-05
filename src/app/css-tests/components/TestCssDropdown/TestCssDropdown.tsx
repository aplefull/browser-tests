import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestCssDropdown = () => {
  return (
    <Section className={styles.cssDropdown} title="CSS-only collapse with transition to auto height">
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
    </Section>
  );
};
