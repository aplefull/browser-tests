import { ReactNode, useState } from 'react';
import styles from './styles.module.scss';
import { ChevronDown } from 'tabler-icons-react';
import classNames from 'classnames';
import { Wrapper } from '@/app/components/Wrapper/Wrapper';

type TPrimitive = string | number | boolean | null | undefined;

const isPrimitive = (value: unknown): value is TPrimitive => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  );
};

const prepareValue = (value: TPrimitive, settings?: TJsonSettings) => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (value === '') return '""';

  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();

  const maxLength = settings?.maxStringLength;
  const cutValue = maxLength && value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

  return `"${cutValue}"`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

type TBracketsProps = {
  children: ReactNode;
  type: 'curly' | 'square';
  collapsible?: boolean;
  propertyKey?: string;
  defaultOpen?: boolean;
};

const Brackets = ({ children, type, collapsible, propertyKey, defaultOpen = true }: TBracketsProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const openBracket = type === 'curly' ? '{' : '[';
  const closeBracket = type === 'curly' ? '}' : ']';

  const isEmpty = Array.isArray(children) && children.length === 0;

  const toggleOpen = () => setIsOpen((prevState) => !prevState);

  const handleClassName = classNames(styles.collapsibleHandle, {
    [styles.open]: isOpen,
  });

  return (
    <>
      <div className={styles.topRow}>
        {collapsible && (
          <div className={handleClassName} onClick={toggleOpen}>
            <ChevronDown className={styles.icon} size={13} />
          </div>
        )}

        {propertyKey && <Key onClick={toggleOpen} value={propertyKey} disabled={!collapsible || isEmpty} />}

        <div className={styles.textDark}>{openBracket}</div>

        {!isOpen && (
          <>
            {!isEmpty && <span className={styles.textDark}>...</span>}
            <span className={styles.textDark}>{closeBracket}</span>
          </>
        )}
      </div>

      {isOpen && (
        <>
          <div className={styles.leftOffset}>{children}</div>
          <span className={styles.textDark}>{closeBracket}</span>
        </>
      )}
    </>
  );
};

type TCurlyBracesProps = {
  children: ReactNode;
  collapsible?: boolean;
  propertyKey?: string;
  defaultOpen?: boolean;
};

type TSquareBracketsProps = {
  children: ReactNode;
  collapsible?: boolean;
  propertyKey?: string;
  defaultOpen?: boolean;
};

const SquareBrackets = ({ children, collapsible, propertyKey, defaultOpen }: TCurlyBracesProps) => {
  return (
    <Brackets collapsible={collapsible} propertyKey={propertyKey} defaultOpen={defaultOpen} type="square">
      {children}
    </Brackets>
  );
};

const CurlyBraces = ({ children, collapsible, propertyKey, defaultOpen }: TSquareBracketsProps) => {
  return (
    <Brackets collapsible={collapsible} propertyKey={propertyKey} defaultOpen={defaultOpen} type="curly">
      {children}
    </Brackets>
  );
};

const Comma = () => {
  return <span className={styles.textDark}>,</span>;
};

type TKeyProps = { value: string; onClick?: () => void; disabled?: boolean };

const Key = ({ value, onClick, disabled }: TKeyProps) => {
  const maxLength = 40;
  const cutValue = value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;

  return (
    <span title={value} className={styles.key} onClick={disabled ? undefined : onClick}>
      {cutValue}:
    </span>
  );
};

type TValueProps = { value: TPrimitive; propertyKey?: string; settings?: TJsonSettings };

const Value = ({ value, propertyKey, settings }: TValueProps) => {
  const preparedValue = prepareValue(value, settings);

  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      {
        <span title={value?.toString()} className={styles.textLight}>
          {preparedValue}
        </span>
      }
    </div>
  );
};

type TObjectProps = {
  value: Record<string, unknown>;
  parentKey?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  level: number;
  settings?: TJsonSettings;
};

const JObject = ({ value, parentKey, collapsible, defaultOpen = true, level, settings }: TObjectProps) => {
  const entries = Object.entries(value);

  const isEmpty = entries.length === 0;
  const isDefaultOpen = settings?.collapseLevel ? level < settings.collapseLevel : defaultOpen;

  return (
    <Wrapper as="div" wrap={level === 0}>
      <CurlyBraces
        defaultOpen={isDefaultOpen && !isEmpty}
        collapsible={collapsible && !isEmpty}
        propertyKey={parentKey}
      >
        {entries.map(([key, value]) => {
          return <Json key={key} parentKey={key} data={value} level={level + 1} settings={settings} />;
        })}
      </CurlyBraces>
    </Wrapper>
  );
};

type TArrayProps = {
  value: unknown[];
  parentKey?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  level: number;
  settings?: TJsonSettings;
};

const JArray = ({ value, parentKey, collapsible, defaultOpen = true, level, settings }: TArrayProps) => {
  const isEmpty = value.length === 0;
  const isDefaultOpen = settings?.collapseLevel ? level < settings.collapseLevel : defaultOpen;

  return (
    <div className={styles.arrayWrapper}>
      <SquareBrackets
        defaultOpen={isDefaultOpen && !isEmpty}
        collapsible={collapsible && !isEmpty}
        propertyKey={parentKey}
      >
        {value.map((item: unknown, index) => {
          return (
            <div key={index}>
              <Json parentKey={index.toString()} data={item} level={level + 1} settings={settings} />
              {isPrimitive(item) && <Comma />}
            </div>
          );
        })}
      </SquareBrackets>
    </div>
  );
};

const Function = ({ value }: { value: Function }) => {
  return <span className={styles.textLight}>{value.toString()}</span>;
};

type TJsonSettings = {
  maxStringLength?: number;
  collapseLevel?: number;
};

type TJsonProps = {
  data: unknown;
  collapsible?: boolean;
  parentKey?: string;
  level?: number;
  settings?: TJsonSettings;
};

export const Json = ({ data, collapsible = true, parentKey, level = 0, settings }: TJsonProps) => {
  if (isPrimitive(data)) {
    return <Value propertyKey={parentKey} value={data} settings={settings} />;
  }

  const isArray = Array.isArray(data);

  if (isArray) {
    return <JArray value={data} parentKey={parentKey} collapsible={collapsible} level={level} settings={settings} />;
  }

  if (isRecord(data)) {
    return <JObject value={data} parentKey={parentKey} collapsible={collapsible} level={level} settings={settings} />;
  }

  if (typeof data === 'function') {
    return <Function value={data} />;
  }

  console.warn('Unknown type', data);
  return null;
};
