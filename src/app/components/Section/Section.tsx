import { ReactNode } from 'react';
import { Collapse } from '@/app/components/Collapse/Collapse';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { DROPDOWN_STATE } from '@/utils/constants';
import { setDropdownState } from '@/app/redux/slices/settings';
import { getCollapseState, getPage } from '@/utils/utils';

type TSectionProps = {
  title: string;
  info?: string;
  className?: string;
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

export const Section = ({ title, info, className, children }: TSectionProps) => {
  const { pages } = useSelector((state: RootState) => state.settings.dropdowns);
  const dispatch = useDispatch<AppDispatch>();

  const page = getPage(title, pages);
  const collapseState = getCollapseState(title, page, pages);

  const handleChange = (open: boolean) => {
    dispatch(
      setDropdownState({
        page: page,
        name: title,
        dropdownState: open ? DROPDOWN_STATE.OPEN : DROPDOWN_STATE.CLOSED,
      }),
    );
  };

  return (
    <section>
      <Collapse
        childrenClassName={className}
        headClassName={styles.head}
        className={styles.sectionCollapse}
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
