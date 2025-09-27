import { useEffect, useRef, useState } from 'react';
import { Input } from '@/app/components/Input/Input';
import styles from './styles.module.scss';
import { useDoubleKeyPress } from '@/utils/hooks';
import classNames from 'classnames';
import { isActiveElementInput } from '@utils';

export const SectionSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLInputElement | null>(null);

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

      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      }, 0);

      return true;
    });
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

    window.scrollTo({
      top: firstMatch.getBoundingClientRect().top + window.scrollY,
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

  return (
    <div
      className={classNames(styles.container, {
        [styles.open]: isOpen,
      })}
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
