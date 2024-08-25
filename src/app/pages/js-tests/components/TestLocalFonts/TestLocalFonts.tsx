import { Container } from '@/app/components/Container/Container';
import { Button } from '@/app/components/Button/Button';
import { useState } from 'react';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';
import { Switcher } from '@/app/components/Switcher/Switcher';
import { Select } from '@/app/components/Select/Select';
import { Input } from '@/app/components/Input/Input';
import styles from './styles.module.scss';
import { nextElement, prevElement } from '@utils';

export const LocalFonts = () => {
  const [fonts, setFonts] = useState<FontData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('Quick brown fox jumps over the lazy dog');
  const [currentFont, setCurrentFont] = useState<FontData | null>(null);

  const getLocalFonts = async () => {
    if (!('queryLocalFonts' in window)) {
      setErrorMessage('queryLocalFonts is not supported in this browser');

      return;
    }

    const fonts = await window.queryLocalFonts?.();
    if (fonts) {
      setFonts(fonts);
    } else {
      setErrorMessage('Failed to query local fonts');
    }
  };

  const setFont = async (font: FontData | null) => {
    if (!font) return;

    const blob = await font.blob();

    if (!blob || !(blob instanceof Blob)) {
      setErrorMessage('There is something wrong with the font blob');
    }

    setCurrentFont(font);
  };

  const handleFontChange = async (_: string, option: unknown) => {
    const font = fonts.find(
      (data) => option && typeof option === 'object' && 'label' in option && data.fullName === option.label,
    );

    if (font) {
      setFont(font).catch(console.error);
    }
  };

  const onNext = () => {
    setFont(nextElement(fonts, currentFont)).catch(console.error);
  };

  const onPrev = () => {
    setFont(prevElement(fonts, currentFont)).catch(console.error);
  };

  return (
    <Container direction="column" align="start" gap={20}>
      <Button text="Query local fonts" onClick={getLocalFonts} />
      <ErrorMessage message={errorMessage} />
      {fonts.length > 0 && (
        <>
          <div className={styles.select}>
            <Switcher onNext={onNext} onPrev={onPrev}>
              <Select
                searchable
                options={fonts.map((data) => {
                  return {
                    value: `${data.postscriptName} ${data.style}`,
                    label: data.fullName,
                  };
                })}
                value={currentFont ? `${currentFont.postscriptName} ${currentFont.style}` : undefined}
                onChange={handleFontChange}
              />
            </Switcher>
          </div>
          <Input value={inputValue} onChange={setInputValue} style={{ fontFamily: currentFont?.fullName }} />
        </>
      )}
    </Container>
  );
};
