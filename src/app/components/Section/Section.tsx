import { ReactNode } from 'react';
import { Collapse } from '@/app/components/Collapse/Collapse';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { DROPDOWN_STATE } from '@/utils/constants';
import { setDropdownState } from '@/app/redux/slices/settings';
import { getCollapseState, getPage } from '@/utils/utils';

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
  const { settings } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const page = getPage(title, settings);
  const collapseState = getCollapseState(title, page, settings);

  const handleChange = (open: boolean) => {
    dispatch(
      setDropdownState({
        page: page,
        name: title,
        dropdownState: open ? DROPDOWN_STATE.OPEN : DROPDOWN_STATE.CLOSED,
      }),
    );
  };

  console.log('Collapse state: ', collapseState);

  return (
    <section>
      <Collapse
        childrenClassName={className}
        headClassName={styles.head}
        head={<SectionHead title={title} info={info} />}
        title={title}
        unmountChildren
        open={collapseState === DROPDOWN_STATE.OPEN}
        onChange={handleChange}
      >
        {children}
      </Collapse>
    </section>
  );
};
