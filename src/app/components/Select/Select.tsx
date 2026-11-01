import styles from './styles.module.scss';
import classNames from 'classnames';
import { KeyboardEvent, MouseEvent, useCallback, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'tabler-icons-react';
import { TSelectOption } from '@/types';
import { Options, TSelectRow } from '@/app/components/Select/Options';
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

const MAX_LIST_HEIGHT = 300;
const MIN_LIST_HEIGHT = 96;
const SEARCH_HEIGHT = 33;
const ANCHOR_MARGIN = 4;
const POPOVER_OFFSET = ANCHOR_MARGIN + 10 + 2 + 8;

const getLabel = (value: string | TSelectOption) => {
  if (typeof value === 'string') {
    return value;
  }

  return value.label;
};

export const isGroup = (
  options: TSelectAcceptedOptions[] | readonly TSelectAcceptedOptions[],
): options is TSelectGroup[] => {
  return typeof options[0] === 'object' && 'group' in options[0];
};

export const toSelectOption = (value: string | number | boolean | TSelectOption | TSelectGroup): TSelectOption => {
  if (typeof value === 'string') {
    return { label: value, value };
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return { label: String(value), value };
  }

  if ('group' in value) {
    const item = value.items[0];

    if (typeof item === 'string') {
      return { label: item, value: item };
    }

    return item;
  }

  return value;
};

const toRows = (options: TSelectAcceptedOptions[] | readonly TSelectAcceptedOptions[]): TSelectRow[] => {
  const toOptionRow = (item: string | TSelectOption): TSelectRow => {
    const option = toSelectOption(item);
    return { type: 'option', option, search: option.label.toLowerCase() };
  };

  if (isGroup(options)) {
    return options.flatMap((group) => [
      { type: 'group', label: group.group } as const,
      ...group.items.map(toOptionRow),
    ]);
  }

  return options.map((option) => toOptionRow(option as string | TSelectOption));
};

const findSelected = (rows: TSelectRow[], value?: string | TSelectOption) => {
  if (value === undefined) return undefined;

  const target = typeof value === 'string' ? value : value.value;
  let byLabel: TSelectOption | undefined;

  for (const row of rows) {
    if (row.type !== 'option') continue;
    if (row.option.value === target) return row.option;
    if (!byLabel && typeof value === 'string' && row.option.label === value) byLabel = row.option;
  }

  return byLabel;
};

const toValueString = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  return String(value);
};

export function Select({
  options,
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
  const [width, setWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(MAX_LIST_HEIGHT);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  const rows = useMemo(() => toRows(options), [options]);
  const selected = useMemo(() => findSelected(rows, value), [rows, value]);

  const open = () => {
    if (disabled || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const space = Math.max(window.innerHeight - rect.bottom, rect.top) - POPOVER_OFFSET;
    const chrome = searchable ? SEARCH_HEIGHT : 0;

    setWidth(rect.width);
    setMaxHeight(Math.max(MIN_LIST_HEIGHT, Math.min(MAX_LIST_HEIGHT, space - chrome)));
    setIsOpen(true);
  };

  const close = useCallback((restoreFocus = false) => {
    setIsOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const closeOnOutsideClick = useCallback(() => close(), [close]);

  const handleSelect = useCallback(
    (option: TSelectOption) => {
      close(true);
      onChange(toValueString(option.value), option);
    },
    [close, onChange],
  );

  const handleClick = () => {
    if (isOpen) {
      close();
      return;
    }

    open();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isOpen || event.target !== triggerRef.current) return;

    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      open();
    }
  };

  const handleClear = (event: MouseEvent) => {
    event.stopPropagation();
    close();
    onClear?.();
  };

  const hasValue = value !== undefined;
  const buttonText = selected?.label ?? (hasValue ? getLabel(value) : placeholder);

  return (
    <div
      className={classNames(styles.selectContainer, className, {
        [styles.disabled]: disabled,
      })}
    >
      {label && <span className={styles.label}>{label}</span>}
      <Popover
        isOpen={isOpen}
        onClickOutside={closeOnOutsideClick}
        className={styles.popover}
        zIndex={100}
        anchorMargin={ANCHOR_MARGIN}
        closeWhenTriggerOutOfViewport={true}
        anchor={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        target={{
          horizontal: 'center',
          vertical: 'top',
        }}
        content={
          <Options
            id={listboxId}
            rows={rows}
            selected={selected}
            onSelect={handleSelect}
            onClose={close}
            width={width}
            maxHeight={maxHeight}
            wrapWords={wrapWords}
            searchable={searchable}
          />
        }
      >
        <div
          ref={triggerRef}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-disabled={disabled}
          aria-label={label}
          title={title}
          className={classNames(styles.select, {
            [styles.open]: isOpen,
          })}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <div className={classNames(styles.value, { [styles.placeholder]: !hasValue })}>{buttonText}</div>
          {clearable && value && (
            <div className={classNames(styles.icon, styles.clear)} onClick={handleClear} title="Clear">
              <X size={14} />
            </div>
          )}
          <div className={classNames(styles.icon, styles.chevron)}>
            <ChevronDown size={16} />
          </div>
        </div>
      </Popover>
    </div>
  );
}
