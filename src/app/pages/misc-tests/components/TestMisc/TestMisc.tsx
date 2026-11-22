import { SpriteVideo } from '@/app/pages/misc-tests/components/subcomponents/SpriteVideo/SpriteVideo';
import { Collapse } from '@/app/components/Collapse/Collapse';
import { DeepNesting } from '@/app/pages/misc-tests/components/subcomponents/DeepNesting/DeepNesting';
import { ReactNode, useState } from 'react';
import styles from './styles.module.scss';

const Subsection = ({ title, children }: { title: string; children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapse className={styles.collapse} title={title} open={open} onChange={setOpen}>
      <div className={styles.collapseContent}>{children}</div>
    </Collapse>
  );
};

export const TestMisc = () => {
  return (
    <div className={styles.misc}>
      <Subsection title="A lot of nested divs">
        <DeepNesting />
      </Subsection>
      <Subsection title="Sprite video">
        <SpriteVideo />
      </Subsection>
      <Subsection title="Iframe referencing current page">
        <iframe src={window.location.href} className={styles.iframe} />
      </Subsection>
    </div>
  );
};
