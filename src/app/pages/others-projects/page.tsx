import classNames from 'classnames';
import styles from './page.module.scss';
import { useState } from 'react';
import { Collapse } from '@/app/components/Collapse/Collapse';
import { ChevronRight } from 'tabler-icons-react';

type TIframeEntry = {
  name: string;
  title: string;
  url?: string;
};

type TProjectProps = TIframeEntry;

const Project = ({ name, url, title }: TProjectProps) => {
  const [open, setOpen] = useState(false);

  const baseUrl = 'https://projects-cdn.netlify.app/projects';
  const src = `${baseUrl}/${name}/index.html`;

  const collapseHead = (
    <div
      className={classNames(styles.headContent, {
        [styles.open]: open,
      })}
    >
      <ChevronRight className={styles.icon} size={24} />
      <span>{title}</span>
    </div>
  );

  return (
    <Collapse
      head={collapseHead}
      headClassName={styles.collapseHead}
      className={styles.collapse}
      open={open}
      onChange={setOpen}
      title={title}
    >
      <div className={classNames(styles.project, { [styles.withUrl]: !!url })}>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        )}
        <iframe src={src} loading="lazy" className={styles.iframe} />
      </div>
    </Collapse>
  );
};

export const OthersProjectsPage = () => {
  const otherUrls = [
    'https://www.ohne-makler.net/',
    'https://www.shadertoy.com/',
    'https://www.joshwcomeau.com/shadow-palette/',
    'https://editor.audio/',
    'https://icones.js.org/',
    'https://css-generators.com/custom-corners/',
    'https://katex.org/',
    'https://yqnn.github.io/svg-path-editor/',
    'https://www.yourworldoftext.com/',
  ];

  const iframes: TIframeEntry[] = [
    { name: 'rgb-cube', title: 'RGB Cube', url: 'https://codepen.io/roborich/pen/wRMKaK' },
    {
      name: 'cats-game',
      title: 'Game',
    },
    {
      name: 'css-art-nezuko',
      url: 'https://codepen.io/t_afif/pen/abEeMyY',
      title: 'CSS art',
    },
    {
      name: 'wavy-range-slider',
      url: 'https://codepen.io/t_afif/full/abQvjxP',
      title: 'Wavy range slider',
    },
    {
      name: 'blob-effect',
      url: 'https://codepen.io/t_afif/pen/OJpKeWa',
      title: 'CSS blob effect',
    },
    {
      name: 'css-game',
      url: 'https://codepen.io/ivorjetski/pen/OJXbvdL',
      title: 'Amazing CSS mini game',
    },
    {
      name: 'css-pixel-art',
      url: 'https://codepen.io/ivorjetski/pen/xxKBWBN',
      title: 'Zero divs CSS pixel art animation',
    },
    {
      name: 'css-painting-landscape',
      url: 'https://codepen.io/ivorjetski/pen/xxGYWQG',
      title: 'CSS painting',
    },
  ];

  return (
    <div className={styles.container}>
      <h1>This page contains other's people cool projects.</h1>
      <div className={styles.iframesContainer}>
        {iframes.map((data) => {
          return <Project key={data.name} {...data} />;
        })}
      </div>
      <h2>Other interesting pages to see</h2>
      <div className={styles.links}>
        {otherUrls.map((url) => (
          <a key={url} target="_blank" rel="noopener noreferrer" href={url}>
            {url}
          </a>
        ))}
      </div>
    </div>
  );
};
