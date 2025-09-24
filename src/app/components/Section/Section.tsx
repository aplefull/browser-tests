import { ReactNode, useState, useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { DROPDOWN_STATE } from '@/utils/constants';
import { setDropdownState } from '@/app/redux/slices/settings';
import { getCollapseState, getPage } from '@/utils/utils';
import { ChevronRight } from 'tabler-icons-react';
import classNames from 'classnames';

type TSectionProps = {
  title: string;
  children: ReactNode;
};

export const Section = ({ title, children }: TSectionProps) => {
  const { pages } = useSelector((state: RootState) => state.settings.dropdowns);
  const dispatch = useDispatch<AppDispatch>();
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const page = getPage(title, pages);

  const collapseState = page && getCollapseState(title, page, pages);
  const isOpen = collapseState === DROPDOWN_STATE.OPEN;

  useEffect(() => {
    const bodyElement = bodyRef.current;
    if (!bodyElement) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === bodyElement && event.propertyName === 'height') {
        if (!isOpen) {
          setShouldRenderChildren(false);
        }
      }
    };

    if (isOpen) {
      setShouldRenderChildren(true);
    }

    bodyElement.addEventListener('transitionend', handleTransitionEnd);
    return () => bodyElement.removeEventListener('transitionend', handleTransitionEnd);
  }, [isOpen]);

  useEffect(() => {
    setShouldRenderChildren(isOpen);
  }, []);

  if (!page) return null;

  const handleChange = (open: boolean) => {
    dispatch(
      setDropdownState({
        page: page,
        name: title,
        dropdownState: open ? DROPDOWN_STATE.OPEN : DROPDOWN_STATE.CLOSED,
      }),
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleChange(!isOpen);
    }
  };

  return (
    <section
      className={classNames(styles.section, { [styles.open]: isOpen })}
      aria-label={title}
      aria-expanded={isOpen}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.head} onClick={() => handleChange(!isOpen)}>
        <span>{title}</span>
        <ChevronRight size={18} className={styles.chevron} />
      </div>
      <div ref={bodyRef} className={styles.body}>
        {shouldRenderChildren && children}
      </div>
    </section>
  );
};
