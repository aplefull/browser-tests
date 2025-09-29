import { useEffect, useRef, useState } from 'react';
import { Input } from '@/app/components/Input/Input';
import styles from './styles.module.scss';
import { useDoubleKeyPress } from '@/utils/hooks';
import classNames from 'classnames';
import { isActiveElementInput } from '@utils';

export const SectionSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const ref = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const close = () => {
    setIsOpen(false);
    setInputValue('');
    ref.current?.blur();

    const sectionTitles = Array.from(document.querySelectorAll('section > div:first-of-type > span'));
    sectionTitles.forEach((section) => {
      section.classList.remove('search-highlight');
    });
  };

  const open = () => {
    if (isActiveElementInput()) return;

    setIsOpen((prev) => {
      if (prev) {
        close();
        return false;
      }

      setShouldRender(true);
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      }, 0);

      return true;
    });
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.target === containerRef.current && event.propertyName === 'translate') {
      if (!isOpen) {
        setShouldRender(false);
      }
    }
  };

  useDoubleKeyPress('f', open);

  useEffect(() => {
    // Yes, query selector in react. Fight me.
    const sectionTitles = Array.from(document.querySelectorAll('section > div:first-of-type > span'));

    sectionTitles.forEach((section) => {
      section.classList.remove('search-highlight');
    });

    if (!isOpen || !inputValue) return;

    const filteredSections = sectionTitles.filter((section) => {
      return section.textContent?.toLowerCase().includes(inputValue.toLowerCase());
    });

    filteredSections.forEach((section) => {
      section.classList.add('search-highlight');
    });

    if (!filteredSections.length) return;

    const firstMatch = filteredSections[0];
    const scrollOffset = 32;

    window.scrollTo({
      top: firstMatch.getBoundingClientRect().top + window.scrollY - scrollOffset,
      behavior: 'smooth',
    });
  }, [inputValue, isOpen]);

  useEffect(() => {
    const closeSearch = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      close();
    };

    if (ref.current) {
      ref.current.focus();
    }

    window.addEventListener('keydown', closeSearch);

    return () => {
      window.removeEventListener('keydown', closeSearch);
    };
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={classNames(styles.container, {
        [styles.open]: isOpen,
      })}
      onTransitionEnd={handleTransitionEnd}
    >
      <Input
        name="section-search"
        ref={ref}
        className={styles.input}
        placeholder="Search section name..."
        onChange={setInputValue}
        value={inputValue}
        tabIndex={isOpen ? 0 : -1}
        autoFocus={false}
      />
    </div>
  );
};
