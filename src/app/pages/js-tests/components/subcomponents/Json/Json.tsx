import { ReactNode, useState } from 'react';
import styles from './styles.module.scss';
import { ChevronDown } from 'tabler-icons-react';
import classNames from 'classnames';
import { Wrapper } from '@/app/components/Wrapper/Wrapper';
import { Container } from '@/app/components/Container/Container';

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

function isCallable(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

const isDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

const isRegExp = (value: unknown): value is RegExp => {
  return value instanceof RegExp;
};

const isBigInt = (value: unknown): value is bigint => {
  return typeof value === 'bigint';
};

const isSymbol = (value: unknown): value is symbol => {
  return typeof value === 'symbol';
};

const isMap = (value: unknown): value is Map<unknown, unknown> => {
  return value instanceof Map;
};

const isSet = (value: unknown): value is Set<unknown> => {
  return value instanceof Set;
};

const isWeakMap = (value: unknown): value is WeakMap<object, unknown> => {
  return value instanceof WeakMap;
};

const isWeakSet = (value: unknown): value is WeakSet<object> => {
  return value instanceof WeakSet;
};

const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

const isPromise = (value: unknown): value is Promise<unknown> => {
  return value instanceof Promise;
};

const isArrayBuffer = (value: unknown): value is ArrayBuffer => {
  return value instanceof ArrayBuffer;
};

const isDataView = (value: unknown): value is DataView => {
  return value instanceof DataView;
};

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
  return (
    value instanceof Int8Array ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Int16Array ||
    value instanceof Uint16Array ||
    value instanceof Int32Array ||
    value instanceof Uint32Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof BigInt64Array ||
    value instanceof BigUint64Array
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
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp) &&
    !(value instanceof Map) &&
    !(value instanceof Set) &&
    !(value instanceof WeakMap) &&
    !(value instanceof WeakSet) &&
    !(value instanceof Error) &&
    !(value instanceof Promise) &&
    !(value instanceof ArrayBuffer) &&
    !(value instanceof DataView) &&
    !isTypedArray(value)
  );
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
            {!isEmpty && (
              <span className={styles.threeDots} onClick={toggleOpen}>
                ...
              </span>
            )}
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
          const direction = isPrimitive(item) ? 'row' : 'column';
          return (
            <Container direction={direction} key={index}>
              <Json parentKey={index.toString()} data={item} level={level + 1} settings={settings} />
              {isPrimitive(item) && <Comma />}
            </Container>
          );
        })}
      </SquareBrackets>
    </div>
  );
};

const Function = ({ value, propertyKey }: { value: (...args: unknown[]) => unknown; propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>{value.toString()}</span>
    </div>
  );
};

const DateValue = ({ value, propertyKey }: { value: Date; propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>{value.toISOString()}</span>
    </div>
  );
};

const RegExpValue = ({ value, propertyKey }: { value: RegExp; propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>{value.toString()}</span>
    </div>
  );
};

const BigIntValue = ({ value, propertyKey }: { value: bigint; propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>{value.toString()}n</span>
    </div>
  );
};

const SymbolValue = ({ value, propertyKey }: { value: symbol; propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>{value.toString()}</span>
    </div>
  );
};

const MapValue = ({
  value,
  propertyKey,
  level,
  settings,
}: {
  value: Map<unknown, unknown>;
  propertyKey?: string;
  level: number;
  settings?: TJsonSettings;
}) => {
  const entries = Array.from(value.entries());
  const isEmpty = entries.length === 0;
  const isDefaultOpen = settings?.collapseLevel ? level < settings.collapseLevel : true;

  return (
    <div className={styles.keyValue}>
      <CurlyBraces
        defaultOpen={isDefaultOpen && !isEmpty}
        collapsible={!isEmpty}
        propertyKey={propertyKey ? `${propertyKey} (Map)` : 'Map'}
      >
        {entries.map(([key, val], index) => {
          const keyString =
            typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol'
              ? key.toString()
              : `[${typeof key}]`;
          return <Json key={index} parentKey={keyString} data={val} level={level + 1} settings={settings} />;
        })}
      </CurlyBraces>
    </div>
  );
};

const SetValue = ({
  value,
  propertyKey,
  level,
  settings,
}: {
  value: Set<unknown>;
  propertyKey?: string;
  level: number;
  settings?: TJsonSettings;
}) => {
  const values = Array.from(value.values());
  const isEmpty = values.length === 0;
  const isDefaultOpen = settings?.collapseLevel ? level < settings.collapseLevel : true;

  return (
    <div className={styles.keyValue}>
      <SquareBrackets
        defaultOpen={isDefaultOpen && !isEmpty}
        collapsible={!isEmpty}
        propertyKey={propertyKey ? `${propertyKey} (Set)` : 'Set'}
      >
        {values.map((val, index) => {
          return <Json key={index} parentKey={index.toString()} data={val} level={level + 1} settings={settings} />;
        })}
      </SquareBrackets>
    </div>
  );
};

const WeakMapValue = ({ propertyKey }: { propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>WeakMap {}</span>
    </div>
  );
};

const WeakSetValue = ({ propertyKey }: { propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>WeakSet {}</span>
    </div>
  );
};

const ErrorValue = ({
  value,
  propertyKey,
  level,
  settings,
}: {
  value: Error;
  propertyKey?: string;
  level: number;
  settings?: TJsonSettings;
}) => {
  const errorObj = {
    name: value.name,
    message: value.message,
    ...(value.stack && { stack: value.stack }),
  };
  const isDefaultOpen = settings?.collapseLevel ? level < settings.collapseLevel : true;

  return (
    <div className={styles.keyValue}>
      <CurlyBraces
        defaultOpen={isDefaultOpen}
        collapsible={true}
        propertyKey={propertyKey ? `${propertyKey} (Error)` : 'Error'}
      >
        {Object.entries(errorObj).map(([key, val]) => {
          return <Json key={key} parentKey={key} data={val} level={level + 1} settings={settings} />;
        })}
      </CurlyBraces>
    </div>
  );
};

const PromiseValue = ({ propertyKey }: { propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>Promise {'{}'}</span>
    </div>
  );
};

const ArrayBufferValue = ({ value, propertyKey }: { value: ArrayBuffer; propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>ArrayBuffer({value.byteLength})</span>
    </div>
  );
};

const DataViewValue = ({ value, propertyKey }: { value: DataView; propertyKey?: string }) => {
  return (
    <div className={styles.keyValue}>
      {propertyKey && <Key value={propertyKey} />}
      <span className={styles.textLight}>DataView({value.byteLength})</span>
    </div>
  );
};

const TypedArrayValue = ({
  value,
  propertyKey,
  level,
  settings,
}: {
  value:
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
    | BigUint64Array;
  propertyKey?: string;
  level: number;
  settings?: TJsonSettings;
}) => {
  // Handle BigInt arrays differently since they can't be directly Array.from'd to numbers
  const arrayValues =
    value instanceof BigInt64Array || value instanceof BigUint64Array
      ? Array.from(value, (val) => val) // Keep as BigInt
      : Array.from(value as ArrayLike<number>);

  const typeName = value.constructor.name;
  const isEmpty = arrayValues.length === 0;
  const isDefaultOpen = settings?.collapseLevel ? level < settings.collapseLevel : true;

  return (
    <div className={styles.keyValue}>
      <SquareBrackets
        defaultOpen={isDefaultOpen && !isEmpty}
        collapsible={!isEmpty}
        propertyKey={propertyKey ? `${propertyKey} (${typeName})` : typeName}
      >
        {arrayValues.map((val, index) => {
          return <Json key={index} parentKey={index.toString()} data={val} level={level + 1} settings={settings} />;
        })}
      </SquareBrackets>
    </div>
  );
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

  if (isBigInt(data)) {
    return <BigIntValue value={data} propertyKey={parentKey} />;
  }

  if (isSymbol(data)) {
    return <SymbolValue value={data} propertyKey={parentKey} />;
  }

  const isArray = Array.isArray(data);

  if (isArray) {
    return <JArray value={data} parentKey={parentKey} collapsible={collapsible} level={level} settings={settings} />;
  }

  if (isTypedArray(data)) {
    return <TypedArrayValue value={data} propertyKey={parentKey} level={level} settings={settings} />;
  }

  if (isArrayBuffer(data)) {
    return <ArrayBufferValue value={data} propertyKey={parentKey} />;
  }

  if (isDataView(data)) {
    return <DataViewValue value={data} propertyKey={parentKey} />;
  }

  if (isDate(data)) {
    return <DateValue value={data} propertyKey={parentKey} />;
  }

  if (isRegExp(data)) {
    return <RegExpValue value={data} propertyKey={parentKey} />;
  }

  if (isError(data)) {
    return <ErrorValue value={data} propertyKey={parentKey} level={level} settings={settings} />;
  }

  if (isPromise(data)) {
    return <PromiseValue propertyKey={parentKey} />;
  }

  if (isMap(data)) {
    return <MapValue value={data} propertyKey={parentKey} level={level} settings={settings} />;
  }

  if (isSet(data)) {
    return <SetValue value={data} propertyKey={parentKey} level={level} settings={settings} />;
  }

  if (isWeakMap(data)) {
    return <WeakMapValue propertyKey={parentKey} />;
  }

  if (isWeakSet(data)) {
    return <WeakSetValue propertyKey={parentKey} />;
  }

  if (isRecord(data)) {
    return <JObject value={data} parentKey={parentKey} collapsible={collapsible} level={level} settings={settings} />;
  }

  if (isCallable(data)) {
    return <Function value={data} propertyKey={parentKey} />;
  }

  console.warn('Unknown type', data);
  return null;
};
