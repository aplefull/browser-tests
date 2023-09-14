import styles from './styles.module.scss';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'tabler-icons-react';
import { createPortal } from 'react-dom';

type TSelectOption = {
  label: string;
  value: string;
};

type TSelectSeparator = {
  label?: string;
  type: string;
};

type WithSeparator<T> = T extends Array<infer U> ? (U | TSelectSeparator)[] : T;

type TSelectProps = {
  options: WithSeparator<string[]> | WithSeparator<readonly string[]> | WithSeparator<TSelectOption[]>;
  onChange: (value: string, entry: TSelectOption) => void;
  value: string | TSelectOption;
  placeholder?: string;
  className?: string;
  wrapWords?: boolean;
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
  value,
  placeholder = 'Select an option...',
  className,
  wrapWords = false,
}: TSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const handleChange = (option: TSelectOption) => () => {
    setIsOpen(false);

    onChange(option.value, option);
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
    height: 200,
    transform: `translate(${left}px, ${bottom + scrollY}px)`,
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const isNode = (target: EventTarget | null): target is Node => {
      return target instanceof Node;
    };

    const handleClickOutside = (event: MouseEvent) => {
      const { target } = event;

      if (ref.current && isNode(target) && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className={classNames(styles.selectContainer, className)}>
      <div
        className={classNames(styles.select, {
          [styles.open]: isOpen,
        })}
        onClick={handleClick}
      >
        <div className={styles.value}>{value ? getLabel(value) : placeholder}</div>
        <div className={classNames(styles.icon)}>
          <ChevronLeft size={20} />
        </div>
      </div>
      {isOpen &&
        createPortal(
          <div style={optionsStyle} className={styles.options}>
            <div className={styles.optionsInner}>
              {options.map((option, index) => {
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
                    key={option.value}
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
