import styles from './styles.module.scss';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, X } from 'tabler-icons-react';
import { TSelectOption } from '@/types';
import { Options } from '@/app/components/Select/Options';
import { Popover } from '@/app/components/Popover/Popover';

export type TSelectGroup = {
  group: string;
  items: (string | TSelectOption)[];
};

type TSelectAcceptedOptions = string | TSelectOption | TSelectGroup;

type TSelectProps = {
  options: TSelectAcceptedOptions[] | readonly TSelectAcceptedOptions[];
  onChange: (value: string, option: TSelectOption) => void;
  onClear?: () => void;
  value?: string | TSelectOption;
  title?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  wrapWords?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  disabled?: boolean;
};

const getLabel = (value: string | TSelectOption) => {
  if (typeof value === 'string') {
    return value;
  }

  return value.label;
};

export const isGroup = (options: TSelectAcceptedOptions[]): options is TSelectGroup[] => {
  return typeof options[0] === 'object' && 'group' in options[0];
};

export const toSelectOption = (value: string | number | boolean | TSelectOption): TSelectOption => {
  if (typeof value === 'string') {
    return { label: value, value };
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return { label: String(value), value };
  }

  return value;
};

export function Select({
  options: initialOptions,
  onChange,
  onClear,
  value,
  placeholder = 'Select an option...',
  label,
  title,
  className,
  wrapWords = false,
  clearable = false,
  searchable = false,
  disabled,
}: TSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectWidth, setSelectWidth] = useState(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    if (disabled) return;

    setIsOpen((isOpen) => !isOpen);
  };

  const handleChange = (option: TSelectOption) => {
    setIsOpen(false);

    onChange(option.value, option);
  };

  const getButtonText = () => {
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }

      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        if (!isOpen && document.activeElement === ref.current) {
          event.preventDefault();
          setIsOpen(true);
        }
      }
    };

    if (isOpen && value) {
      scrollToOption(value);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!ref.current) return;

    const onResize = (entries: ResizeObserverEntry[]) => {
      const { width } = entries[0].contentRect;
      setSelectWidth(width);
    };

    const observer = new ResizeObserver(onResize);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const options = isGroup(initialOptions) ? initialOptions : initialOptions.map(toSelectOption);

  const optionsStyle = {
    width: `${selectWidth}px`,
  };

  return (
    <Popover
      isOpen={isOpen}
      onClickOutside={() => setIsOpen(false)}
      className={styles.popover}
      zIndex={100}
      content={
        <Options
          ref={optionsRef}
          options={options}
          onSelect={handleChange}
          value={value === undefined ? undefined : toSelectOption(value)}
          style={optionsStyle}
          wrapWords={wrapWords}
          searchable={searchable}
        />
      }
    >
      <div
        ref={ref}
        tabIndex={0}
        role="button"
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
          {clearable && value && (
            <div className={classNames(styles.icon, styles.static)} onClick={onClear}>
              <X size={20} />
            </div>
          )}
          <div className={styles.icon}>
            <ChevronLeft size={20} />
          </div>
        </div>
      </div>
    </Popover>
  );
}
