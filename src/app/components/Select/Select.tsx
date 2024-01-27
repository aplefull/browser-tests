import styles from './styles.module.scss';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'tabler-icons-react';
import { createPortal } from 'react-dom';
import { TSelectOption } from '@/types';
import { isNode } from '@/utils/utils';

type TSelectSeparator = {
  label?: string;
  type: string;
};

type WithSeparator<T> = T extends Array<infer U> ? (U | TSelectSeparator)[] : T;

type TSelectProps = {
  options: WithSeparator<string[]> | WithSeparator<readonly string[]> | WithSeparator<TSelectOption[]>;
  onChange: (value: string, entry: TSelectOption) => void;
  onDeselect?: () => void;
  value?: string | TSelectOption;
  title?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  wrapWords?: boolean;
  allowDeselect?: boolean;
  disabled?: boolean;
};

const getLabel = (value: string | TSelectOption) => {
  if (typeof value === 'string') {
    return value;
  }

  return value.label;
};

export function Select({
  options: initialOptions,
  onChange,
  onDeselect,
  value,
  placeholder = 'Select an option...',
  label,
  title,
  className,
  wrapWords = false,
  allowDeselect = false,
  disabled,
}: TSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterString, setFilterString] = useState('');

  const ref = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    if (disabled) return;

    setIsOpen((isOpen) => !isOpen);
  };

  const handleChange = (option: TSelectOption) => () => {
    setIsOpen(false);

    onChange(String(option.value), option);
  };

  const getButtonText = () => {
    if (isOpen && filterString) {
      return filterString;
    }

    if (value) {
      return getLabel(value);
    }

    return placeholder;
  };

  const scrollToOption = (option: TSelectOption | string) => {
    const selectedOptionIndex = options.findIndex((element) => {
      if (!('value' in element)) return false;

      return element.value === option;
    });

    if (selectedOptionIndex === -1) return;

    const optionElement = optionsRef.current?.children[0].children[selectedOptionIndex];

    if (optionElement) {
      optionElement.scrollIntoView({ block: 'nearest' });
    }
  };

  const options = initialOptions.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    } else {
      return option;
    }
  });

  const { width = 0, left = 0, bottom = 0 } = ref.current?.getBoundingClientRect() || {};
  const scrollY = window.scrollY;

  const optionsStyle = {
    width: width,
    transform: `translate(${left}px, ${bottom + scrollY}px)`,
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }

      if (isOpen) {
        setFilterString((filterString) => {
          if (event.key === 'Backspace') {
            return filterString.slice(0, -1);
          }

          if (event.key.length === 1) {
            return filterString + event.key;
          }

          return filterString;
        });
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const { target } = event;

      if (ref.current && isNode(target) && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen && value) {
      scrollToOption(value);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);

      setFilterString('');
    };
  }, [isOpen]);

  return (
    <div
      ref={ref}
      title={title}
      className={classNames(styles.selectContainer, className, {
        [styles.disabled]: disabled,
      })}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={classNames(styles.select, {
          [styles.open]: isOpen,
        })}
        onClick={handleClick}
      >
        <div className={styles.value}>{getButtonText()}</div>
        <div className={classNames(styles.icon)}>
          <ChevronLeft size={20} />
        </div>
      </div>
      {isOpen &&
        createPortal(
          <div ref={optionsRef} style={optionsStyle} className={styles.options}>
            <div className={styles.optionsInner}>
              {allowDeselect && (
                <div
                  className={classNames(styles.option, styles.deselect, {
                    [styles.selected]: !value,
                  })}
                  onClick={() => {
                    setIsOpen(false);

                    if (onDeselect) {
                      onDeselect();
                    }
                  }}
                >
                  Deselect
                </div>
              )}
              {options
                .filter((element) => {
                  if (!('value' in element)) return true;

                  const label = element.label.toLowerCase();

                  return label.includes(filterString.toLowerCase());
                })
                .map((option, index) => {
                  const isSeparator = 'type' in option && option.type === 'separator';

                  if (isSeparator) {
                    return (
                      <div key={index} className={styles.separator}>
                        {option.label}
                      </div>
                    );
                  }

                  if (!('value' in option)) return null;

                  const isSelected = option.value === value;

                  return (
                    <div
                      key={index}
                      className={classNames(styles.option, {
                        [styles.selected]: isSelected,
                        [styles.wrap]: wrapWords,
                        [styles.ellipsis]: !wrapWords,
                      })}
                      onClick={handleChange(option)}
                    >
                      {option.label}
                    </div>
                  );
                })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
