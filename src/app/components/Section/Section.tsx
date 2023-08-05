import { ReactNode } from 'react';
import { Collapse } from '@/app/components/Collapse/Collapse';
import styles from './styles.module.scss';

type TSectionProps = {
  title: string;
  info?: string;
  className?: string;
  closedByDefault?: boolean;
  children: ReactNode;
};

const SectionHead = ({ title, info }: Pick<TSectionProps, 'title' | 'info'>) => {
  if (info) {
    return (
      <div>
        <h1>{title}</h1>
        <span>{info}</span>
      </div>
    );
  }

  return <h1>{title}</h1>;
};

export const Section = ({ title, info, className, closedByDefault, children }: TSectionProps) => {
  return (
    <section>
      <Collapse
        childrenClassName={className}
        headClassName={styles.head}
        head={<SectionHead title={title} info={info} />}
        title={title}
        unmountChildren
        defaultOpen={!closedByDefault}
      >
        {children}
      </Collapse>
    </section>
  );
};
