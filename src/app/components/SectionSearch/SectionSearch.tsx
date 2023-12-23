import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from '@/app/components/Input/Input';
import styles from './styles.module.scss';
import { useDoubleKeyPress } from '@/utils/hooks';

export const SectionSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useDoubleKeyPress('o', () => setOpen((prev) => !prev));

  useEffect(() => {
    // Yes, query selector in react. Fight me.
    const sectionTitles = Array.from(document.querySelectorAll('section > div > div > h1'));

    const filteredSections = sectionTitles.filter((section) => {
      return section.textContent?.toLowerCase().includes(inputValue.toLowerCase());
    });

    if (!filteredSections.length) return;

    const firstMatch = filteredSections[0];

    window.scrollTo({
      top: firstMatch.getBoundingClientRect().top + window.scrollY,
      behavior: 'smooth',
    });
  }, [inputValue]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div>
        <Input onChange={handleInputChange} value={inputValue} />
      </div>
    </div>
  );
};
