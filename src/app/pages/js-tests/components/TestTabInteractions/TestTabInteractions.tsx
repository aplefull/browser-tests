import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';

export const TestTabInteractions = () => {
  const runTests = () => {
    const currentFavicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
    if (currentFavicon.getAttribute('rel') !== 'icon') {
      currentFavicon.setAttribute('rel', 'icon');
    }

    document.head.appendChild(currentFavicon);

    const currentFaviconHref = currentFavicon.getAttribute('href') || '';

    currentFavicon.setAttribute('href', 'https://www.google.com/favicon.ico');

    let i = 5;
    const currentTitle = document.title;
    document.title = `Hi hello 🐞 (${i}s)`;

    const id = setInterval(() => {
      i--;
      document.title = `Hi hello 🐞 (${i}s)`;
    }, 1000);

    setTimeout(() => {
      currentFavicon.setAttribute('href', currentFaviconHref);
      document.title = currentTitle;
      clearInterval(id);
    }, 5000);
  };

  return (
    <div className={styles.tabInteractions}>
      <p>Click the button to run test and check if tab title and favicon has changed</p>
      <Button onClick={runTests} text="Run test" />
    </div>
  );
};
