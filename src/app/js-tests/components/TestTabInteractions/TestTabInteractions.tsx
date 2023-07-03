import styles from './styles.module.scss';

export default function TestTabInteractions() {
  const runTests = () => {
    const currentFavicon = document.querySelector('link[rel="icon"]');
    const currentFaviconHref = currentFavicon.getAttribute('href');

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
    <section className={styles.tabInteractions}>
      <h1>Interactions with tab</h1>
      <p>Click the button to run test and check if tab title and favicon has changed</p>
      <button onClick={runTests}>Run test</button>
    </section>
  );
}
