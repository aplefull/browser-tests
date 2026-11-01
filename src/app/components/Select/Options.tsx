import styles from '@/app/components/Select/styles.module.scss';
import classNames from 'classnames';
import { ChangeEvent, KeyboardEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { TSelectOption } from '@/types';
import { Check, Search } from 'tabler-icons-react';

export type TSelectRow = { type: 'group'; label: string } | { type: 'option'; option: TSelectOption; search: string };

type TOptionsProps = {
  id: string;
  rows: TSelectRow[];
  selected?: TSelectOption;
  onSelect: (option: TSelectOption) => void;
  onClose: (restoreFocus?: boolean) => void;
  width: number;
  maxHeight: number;
  wrapWords?: boolean;
  searchable?: boolean;
};

const ROW_HEIGHT = 30;
const LIST_PADDING = 4;
const OVERSCAN = 8;
const TYPEAHEAD_TIMEOUT = 600;

const filterRows = (rows: TSelectRow[], query: string) => {
  const search = query.trim().toLowerCase();
  if (!search) return rows;

  const result: TSelectRow[] = [];
  let group: TSelectRow | null = null;

  for (const row of rows) {
    if (row.type === 'group') {
      group = row;
      continue;
    }

    if (!row.search.includes(search)) continue;

    if (group) {
      result.push(group);
      group = null;
    }

    result.push(row);
  }

  return result;
};

const findOption = (rows: TSelectRow[], from: number, direction: 1 | -1) => {
  for (let index = from; index >= 0 && index < rows.length; index += direction) {
    if (rows[index].type === 'option') return index;
  }

  return -1;
};

const getInitialActive = (rows: TSelectRow[], selected?: TSelectOption) => {
  const selectedIndex = selected ? rows.findIndex((row) => row.type === 'option' && row.option === selected) : -1;

  return selectedIndex === -1 ? findOption(rows, 0, 1) : selectedIndex;
};

export const Options = ({
  id,
  rows,
  selected,
  onSelect,
  onClose,
  width,
  maxHeight,
  wrapWords,
  searchable,
}: TOptionsProps) => {
  const pageSize = Math.max(1, Math.floor(maxHeight / ROW_HEIGHT) - 1);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(() => getInitialActive(rows, selected));
  const [scrollTop, setScrollTop] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typeaheadRef = useRef({ value: '', time: 0 });

  const filtered = useMemo(() => filterRows(rows, query), [rows, query]);
  const virtual = !wrapWords;
  const activeIndex = filtered[active]?.type === 'option' ? active : -1;
  const optionCount = useMemo(() => filtered.filter((row) => row.type === 'option').length, [filtered]);

  const scrollToRow = (index: number, center = false) => {
    const list = listRef.current;
    if (!list || index < 0) return;

    const element = virtual ? null : list.querySelector<HTMLElement>(`[data-index="${index}"]`);
    const headerIndex = index > 0 && filtered[index - 1].type === 'group' ? index - 1 : index;
    const header = virtual ? null : list.querySelector<HTMLElement>(`[data-index="${headerIndex}"]`);

    const top = virtual ? LIST_PADDING + headerIndex * ROW_HEIGHT : (header?.offsetTop ?? 0);
    const bottom = virtual
      ? LIST_PADDING + (index + 1) * ROW_HEIGHT
      : element
        ? element.offsetTop + element.offsetHeight
        : 0;

    if (center) {
      list.scrollTop = top - (list.clientHeight - (bottom - top)) / 2;
    } else if (top < list.scrollTop) {
      list.scrollTop = top;
    } else if (bottom > list.scrollTop + list.clientHeight) {
      list.scrollTop = bottom - list.clientHeight;
    }

    setScrollTop(list.scrollTop);
  };

  const moveTo = (index: number) => {
    if (index === -1) return;

    setActive(index);
    scrollToRow(index);
  };

  useLayoutEffect(() => {
    (inputRef.current ?? listRef.current)?.focus({ preventScroll: true });
    scrollToRow(activeIndex, true);
  }, []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value;
    const nextRows = filterRows(rows, nextQuery);

    setQuery(nextQuery);
    setActive(nextQuery.trim() ? findOption(nextRows, 0, 1) : getInitialActive(nextRows, selected));

    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }

    setScrollTop(0);
  };

  const typeahead = (key: string) => {
    const now = Date.now();
    const state = typeaheadRef.current;
    const value = now - state.time > TYPEAHEAD_TIMEOUT ? key.toLowerCase() : state.value + key.toLowerCase();

    typeaheadRef.current = { value, time: now };

    const start = value.length === 1 ? activeIndex + 1 : Math.max(activeIndex, 0);
    const ordered = [...filtered.slice(start), ...filtered.slice(0, start)];
    const match = ordered.findIndex((row) => row.type === 'option' && row.search.startsWith(value));

    if (match !== -1) {
      moveTo((match + start) % filtered.length);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const inInput = event.target === inputRef.current;
    let handled = true;

    switch (event.key) {
      case 'ArrowDown':
        moveTo(activeIndex === -1 ? findOption(filtered, 0, 1) : findOption(filtered, activeIndex + 1, 1));
        break;
      case 'ArrowUp':
        moveTo(
          activeIndex === -1
            ? findOption(filtered, filtered.length - 1, -1)
            : findOption(filtered, activeIndex - 1, -1),
        );
        break;
      case 'PageDown':
        moveTo(findOption(filtered, Math.min(activeIndex + pageSize, filtered.length - 1), -1));
        break;
      case 'PageUp':
        moveTo(findOption(filtered, Math.max(activeIndex - pageSize, 0), 1));
        break;
      case 'Home':
        if (inInput) handled = false;
        else moveTo(findOption(filtered, 0, 1));
        break;
      case 'End':
        if (inInput) handled = false;
        else moveTo(findOption(filtered, filtered.length - 1, -1));
        break;
      case 'Enter': {
        const row = filtered[activeIndex];
        if (row?.type === 'option') onSelect(row.option);
        break;
      }
      case 'Escape':
        onClose(true);
        break;
      case 'Tab':
        onClose(true);
        return;
      default:
        handled = false;
    }

    if (!handled && !inInput && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const row = filtered[activeIndex];

      if (event.key === ' ' && !typeaheadRef.current.value && row?.type === 'option') {
        onSelect(row.option);
      } else {
        typeahead(event.key);
      }

      handled = true;
    }

    if (handled) {
      event.preventDefault();
    }

    event.stopPropagation();
  };

  const renderRow = (row: TSelectRow, index: number) => {
    if (row.type === 'group') {
      return (
        <div
          key={`group-${index}`}
          data-index={index}
          role="presentation"
          className={styles.group}
          style={virtual ? { top: LIST_PADDING + index * ROW_HEIGHT } : undefined}
        >
          <span>{row.label}</span>
        </div>
      );
    }

    const isSelected = row.option === selected;

    return (
      <div
        key={index}
        id={`${id}-${index}`}
        data-index={index}
        role="option"
        aria-selected={isSelected}
        title={wrapWords ? undefined : row.option.label}
        className={classNames(styles.option, {
          [styles.selected]: isSelected,
          [styles.active]: index === activeIndex,
          [styles.wrap]: wrapWords,
        })}
        style={virtual ? { top: LIST_PADDING + index * ROW_HEIGHT } : undefined}
        onMouseMove={() => {
          if (index !== activeIndex) setActive(index);
        }}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(row.option)}
      >
        <span className={styles.text}>{row.option.label}</span>
        <Check size={14} className={styles.check} />
      </div>
    );
  };

  const renderList = () => {
    if (!virtual) {
      return filtered.map(renderRow);
    }

    const total = filtered.length ? filtered.length * ROW_HEIGHT + LIST_PADDING * 2 : 0;
    const height = Math.min(maxHeight, total);
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
    const end = Math.min(filtered.length, Math.ceil((scrollTop + height) / ROW_HEIGHT) + OVERSCAN);
    const visible = [];

    for (let index = start; index < end; index++) {
      visible.push(renderRow(filtered[index], index));
    }

    return <div style={{ height: total }}>{visible}</div>;
  };

  const isEmpty = filtered.length === 0;

  return (
    <div className={styles.options} style={{ width }} onKeyDown={handleKeyDown}>
      {searchable && (
        <div className={styles.search}>
          <Search size={14} className={styles.searchIcon} />
          <input
            ref={inputRef}
            value={query}
            onChange={handleQueryChange}
            placeholder="Search"
            role="searchbox"
            aria-controls={id}
            aria-activedescendant={activeIndex === -1 ? undefined : `${id}-${activeIndex}`}
            autoComplete="off"
            spellCheck={false}
          />
          {query && <span className={styles.count}>{optionCount}</span>}
        </div>
      )}
      {isEmpty && <div className={styles.empty}>No results</div>}
      <div
        ref={listRef}
        id={id}
        role="listbox"
        tabIndex={-1}
        aria-activedescendant={activeIndex === -1 ? undefined : `${id}-${activeIndex}`}
        className={classNames(styles.list, { [styles.virtual]: virtual })}
        style={{ maxHeight }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        {renderList()}
      </div>
    </div>
  );
};
