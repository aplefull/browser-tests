import styles from '@/app/components/Select/styles.module.scss';
import classNames from 'classnames';
import { forwardRef, useEffect, useState, CSSProperties, Fragment } from 'react';
import { TSelectOption } from '@/types';
import { isGroup, toSelectOption, TSelectGroup } from '@/app/components/Select/Select';
import { Check, Search } from 'tabler-icons-react';
import { Input } from '@/app/components/Input/Input';

type TOptionsProps = {
  style: CSSProperties;
  options: TSelectOption[] | TSelectGroup[];
  value?: TSelectOption;
  onSelect: (value: TSelectOption) => void;
  wrapWords?: boolean;
  searchable?: boolean;
};

export const Options = forwardRef<HTMLDivElement, TOptionsProps>(
  ({ options, onSelect, style, wrapWords, value, searchable }, ref) => {
    const [pseudoSelectedIndex, setPseudoSelectedIndex] = useState<number | null>(null);
    const [filterString, setFilterString] = useState('');

    const filterFn = (option: TSelectOption) => {
      if (!filterString) return true;

      return option.label.includes(filterString.toLowerCase());
    };

    const renderOptions = (options: TSelectOption[]) => {
      return options.filter(filterFn).map((option, index) => {
        const isSelected = value && option.value === value.value;

        return (
          <div
            key={index}
            className={classNames(styles.option, {
              [styles.selected]: isSelected,
              [styles.pseudoSelected]: pseudoSelectedIndex === index,
              [styles.wrap]: wrapWords,
              [styles.ellipsis]: !wrapWords,
            })}
            onClick={() => {
              onSelect(option);
            }}
          >
            <Check
              size={14}
              className={classNames(styles.check, {
                [styles.selected]: isSelected,
              })}
            />
            <span>{option.label}</span>
          </div>
        );
      });
    };

    useEffect(() => {
      const optionsList = isGroup(options) ? options.flatMap((group) => group.items) : options;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();

          if (pseudoSelectedIndex === null) {
            setPseudoSelectedIndex(0);
          } else {
            setPseudoSelectedIndex((pseudoSelectedIndex + 1) % optionsList.length);
          }
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();

          if (pseudoSelectedIndex === null) {
            setPseudoSelectedIndex(optionsList.length - 1);
          } else {
            setPseudoSelectedIndex((pseudoSelectedIndex - 1 + optionsList.length) % optionsList.length);
          }
        }

        if (event.key === 'Enter' && pseudoSelectedIndex !== null) {
          const option = optionsList[pseudoSelectedIndex];
          if (!option) return;

          onSelect(toSelectOption(option));
        }
      };

      document.addEventListener('keydown', onKeyDown);

      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }, [pseudoSelectedIndex, options, onSelect]);

    const optionsList = isGroup(options) ? options.flatMap((group) => group.items) : options;
    const isEmpty = optionsList.map(toSelectOption).filter(filterFn).length === 0;

    return (
      <div ref={ref} className={styles.options} style={style}>
        {searchable && (
          <div>
            <Input
              onChange={setFilterString}
              value={filterString}
              leftSlot={<Search className={styles.searchIcon} />}
            />
          </div>
        )}
        {isEmpty && (
          <div className={styles.empty}>
            <span>No items</span>
          </div>
        )}
        {!isEmpty && (
          <div className={styles.optionsInner}>
            {isGroup(options)
              ? options.map((group, index) => {
                  if (group.items.map(toSelectOption).filter(filterFn).length === 0) return null;

                  return (
                    <Fragment key={`${group.group}-${index}`}>
                      <div key={index} className={styles.separator}>
                        <span>{group.group}</span>
                        <div />
                      </div>
                      {renderOptions(group.items.map(toSelectOption))}
                    </Fragment>
                  );
                })
              : renderOptions(options)}
          </div>
        )}
      </div>
    );
  },
);
