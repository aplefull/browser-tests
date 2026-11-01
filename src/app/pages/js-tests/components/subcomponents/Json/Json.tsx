import { ReactNode, useState } from 'react';
import styles from './styles.module.scss';
import { ChevronRight } from 'tabler-icons-react';
import classNames from 'classnames';

type TJsonSettings = {
  maxStringLength?: number;
  collapseLevel?: number;
};

type TJsonProps = {
  data: unknown;
  collapsible?: boolean;
  settings?: TJsonSettings;
  className?: string;
};

type TTone = 'string' | 'number' | 'boolean' | 'empty' | 'special';

type TLeaf = {
  kind: 'leaf';
  text: string;
  tone: TTone;
  title?: string;
};

type TBranch = {
  kind: 'branch';
  brackets: 'curly' | 'square';
  label?: string;
  entries: [string, unknown][];
};

type TEntryProps = {
  name?: string;
  value: unknown;
  level: number;
  last: boolean;
  ancestors: unknown[];
  settings?: TJsonSettings;
  collapsible?: boolean;
};

const BUCKET_SIZE = 100;
const MAX_KEY_LENGTH = 40;

const isTypedArray = (
  value: unknown,
): value is
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array => {
  return ArrayBuffer.isView(value) && !(value instanceof DataView);
};

const formatString = (value: string, settings?: TJsonSettings) => {
  const maxLength = settings?.maxStringLength;
  const cutValue = maxLength && value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

  return `"${cutValue}"`;
};

const formatKey = (key: unknown) => {
  if (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') {
    return key.toString();
  }

  return `[${typeof key}]`;
};

const getObjectEntries = (value: object): [string, unknown][] => {
  const entries = Object.entries(value);
  const prototype = Object.getPrototypeOf(value);

  if (entries.length > 0 || prototype === Object.prototype || prototype === null) {
    return entries;
  }

  const inherited: [string, unknown][] = [];

  for (const key in value) {
    try {
      const property = (value as Record<string, unknown>)[key];
      if (typeof property !== 'function') inherited.push([key, property]);
    } catch {}
  }

  return inherited;
};

const describe = (value: unknown, settings?: TJsonSettings): TLeaf | TBranch => {
  if (value === null) return { kind: 'leaf', text: 'null', tone: 'empty' };
  if (value === undefined) return { kind: 'leaf', text: 'undefined', tone: 'empty' };

  switch (typeof value) {
    case 'string':
      return { kind: 'leaf', text: formatString(value, settings), tone: 'string', title: value };
    case 'number':
      return { kind: 'leaf', text: Object.is(value, -0) ? '-0' : String(value), tone: 'number' };
    case 'bigint':
      return { kind: 'leaf', text: `${value}n`, tone: 'number' };
    case 'boolean':
      return { kind: 'leaf', text: String(value), tone: 'boolean' };
    case 'symbol':
    case 'function':
      return { kind: 'leaf', text: value.toString(), tone: 'special' };
  }

  if (Array.isArray(value)) {
    return { kind: 'branch', brackets: 'square', entries: value.map((item, index) => [String(index), item]) };
  }

  if (isTypedArray(value)) {
    const items = Array.from(value as ArrayLike<number | bigint>);

    return {
      kind: 'branch',
      brackets: 'square',
      label: `${value.constructor.name}(${items.length})`,
      entries: items.map((item, index) => [String(index), item]),
    };
  }

  if (value instanceof DataView) return { kind: 'leaf', text: `DataView(${value.byteLength})`, tone: 'special' };
  if (value instanceof ArrayBuffer) return { kind: 'leaf', text: `ArrayBuffer(${value.byteLength})`, tone: 'special' };
  if (value instanceof RegExp) return { kind: 'leaf', text: value.toString(), tone: 'special' };
  if (value instanceof Promise) return { kind: 'leaf', text: 'Promise {}', tone: 'special' };
  if (value instanceof WeakMap) return { kind: 'leaf', text: 'WeakMap {}', tone: 'special' };
  if (value instanceof WeakSet) return { kind: 'leaf', text: 'WeakSet {}', tone: 'special' };

  if (value instanceof Date) {
    const text = Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString();
    return { kind: 'leaf', text, tone: 'special' };
  }

  if (value instanceof Map) {
    return {
      kind: 'branch',
      brackets: 'curly',
      label: `Map(${value.size})`,
      entries: Array.from(value.entries(), ([key, item]) => [formatKey(key), item]),
    };
  }

  if (value instanceof Set) {
    return {
      kind: 'branch',
      brackets: 'square',
      label: `Set(${value.size})`,
      entries: Array.from(value.values(), (item, index) => [String(index), item]),
    };
  }

  if (value instanceof Error) {
    const entries: [string, unknown][] = [
      ['name', value.name],
      ['message', value.message],
    ];

    if (value.stack) entries.push(['stack', value.stack]);

    return { kind: 'branch', brackets: 'curly', label: value.name || 'Error', entries };
  }

  if (typeof value === 'object') {
    return { kind: 'branch', brackets: 'curly', entries: getObjectEntries(value) };
  }

  console.warn('Unknown type', value);
  return { kind: 'leaf', text: String(value), tone: 'special' };
};

const Key = ({ name, onClick }: { name: string; onClick?: () => void }) => {
  const cutName = name.length > MAX_KEY_LENGTH ? `${name.slice(0, MAX_KEY_LENGTH)}...` : name;

  return (
    <span title={name} className={classNames(styles.key, { [styles.clickable]: onClick })} onClick={onClick}>
      {cutName}
      <span className={styles.punctuation}>: </span>
    </span>
  );
};

const Toggle = ({ open, onClick }: { open: boolean; onClick: () => void }) => {
  return (
    <button
      type="button"
      className={classNames(styles.toggle, { [styles.open]: open })}
      aria-expanded={open}
      aria-label={open ? 'Collapse' : 'Expand'}
      onClick={onClick}
    >
      <ChevronRight size={12} />
    </button>
  );
};

const Comma = ({ last }: { last: boolean }) => {
  return last ? null : <span className={styles.punctuation}>,</span>;
};

type TBucketProps = {
  start: number;
  entries: [string, unknown][];
  level: number;
  last: boolean;
  ancestors: unknown[];
  settings?: TJsonSettings;
};

const Bucket = ({ start, entries, level, last, ancestors, settings }: TBucketProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((open) => !open);

  return (
    <div className={styles.entry}>
      <div className={styles.row}>
        <Toggle open={open} onClick={toggle} />
        <span className={classNames(styles.punctuation, styles.clickable)} onClick={toggle}>
          [{start} … {start + entries.length - 1}]
        </span>
      </div>
      {open && (
        <div className={styles.children}>
          {entries.map(([key, item], index) => (
            <Entry
              key={key}
              name={key}
              value={item}
              level={level}
              last={last && index === entries.length - 1}
              ancestors={ancestors}
              settings={settings}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const renderChildren = (
  entries: [string, unknown][],
  level: number,
  ancestors: unknown[],
  settings?: TJsonSettings,
) => {
  if (entries.length <= BUCKET_SIZE) {
    return entries.map(([key, item], index) => (
      <Entry
        key={key + index}
        name={key}
        value={item}
        level={level}
        last={index === entries.length - 1}
        ancestors={ancestors}
        settings={settings}
      />
    ));
  }

  const buckets: ReactNode[] = [];

  for (let start = 0; start < entries.length; start += BUCKET_SIZE) {
    buckets.push(
      <Bucket
        key={start}
        start={start}
        entries={entries.slice(start, start + BUCKET_SIZE)}
        level={level}
        last={start + BUCKET_SIZE >= entries.length}
        ancestors={ancestors}
        settings={settings}
      />,
    );
  }

  return buckets;
};

const Branch = ({
  name,
  description,
  value,
  level,
  last,
  ancestors,
  settings,
  collapsible = true,
}: Omit<TEntryProps, 'value'> & { description: TBranch; value: unknown }) => {
  const { entries, label, brackets } = description;
  const isEmpty = entries.length === 0;
  const isDefaultOpen = settings?.collapseLevel ? level < settings.collapseLevel : true;

  const [open, setOpen] = useState(isDefaultOpen);

  const canToggle = collapsible && !isEmpty;
  const isOpen = !isEmpty && (open || !collapsible);
  const toggle = canToggle ? () => setOpen((open) => !open) : undefined;

  const [openBracket, closeBracket] = brackets === 'curly' ? ['{', '}'] : ['[', ']'];
  const unit = brackets === 'curly' ? 'key' : 'item';
  const countLabel = `${entries.length} ${unit}${entries.length === 1 ? '' : 's'}`;

  return (
    <div className={styles.entry}>
      <div className={styles.row}>
        {toggle && <Toggle open={isOpen} onClick={toggle} />}
        {name !== undefined && <Key name={name} onClick={toggle} />}
        {label && <span className={styles.label}>{label} </span>}
        <span className={styles.punctuation}>{openBracket}</span>
        {!isOpen && (
          <>
            {!isEmpty && (
              <span className={styles.ellipsis} onClick={toggle}>
                …
              </span>
            )}
            <span className={styles.punctuation}>{closeBracket}</span>
            <Comma last={last} />
            {!isEmpty && !label && <span className={styles.count}>{countLabel}</span>}
          </>
        )}
      </div>
      {isOpen && (
        <>
          <div className={styles.children}>{renderChildren(entries, level + 1, [...ancestors, value], settings)}</div>
          <div className={styles.row}>
            <span className={styles.punctuation}>{closeBracket}</span>
            <Comma last={last} />
          </div>
        </>
      )}
    </div>
  );
};

const Entry = ({ name, value, level, last, ancestors, settings, collapsible }: TEntryProps) => {
  if (typeof value === 'object' && value !== null && ancestors.includes(value)) {
    return (
      <div className={styles.row}>
        {name !== undefined && <Key name={name} />}
        <span className={styles.special}>[Circular]</span>
        <Comma last={last} />
      </div>
    );
  }

  const description = describe(value, settings);

  if (description.kind === 'branch') {
    return (
      <Branch
        name={name}
        description={description}
        value={value}
        level={level}
        last={last}
        ancestors={ancestors}
        settings={settings}
        collapsible={collapsible}
      />
    );
  }

  return (
    <div className={styles.row}>
      {name !== undefined && <Key name={name} />}
      <span title={description.title} className={styles[description.tone]}>
        {description.text}
      </span>
      <Comma last={last} />
    </div>
  );
};

export const Json = ({ data, collapsible = true, settings, className }: TJsonProps) => {
  return (
    <div className={classNames(styles.json, className)}>
      <Entry value={data} level={0} last ancestors={[]} settings={settings} collapsible={collapsible} />
    </div>
  );
};
