import { ReactNode } from 'react';
import styles from './styles.module.scss';

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

const prepareValue = (value: TPrimitive) => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (value === '') return '""';

  return value.toString();
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const Brackets = ({ children, type }: { children: ReactNode; type: 'curly' | 'square' }) => {
  const style = {
    opacity: 0.6,
    fontFamily: 'monospace',
    color: '#adadad',
  };

  const openBracket = type === 'curly' ? '{' : '[';
  const closeBracket = type === 'curly' ? '}' : ']';

  return (
    <>
      <span style={style}>{openBracket}</span>
      <div
        style={{
          marginLeft: '1rem',
        }}
      >
        {children}
      </div>
      <span style={style}>{closeBracket}</span>
    </>
  );
};

const SquareBrackets = ({ children }: { children: ReactNode }) => {
  return <Brackets type="square">{children}</Brackets>;
};

const CurlyBraces = ({ children }: { children: ReactNode }) => {
  return <Brackets type="curly">{children}</Brackets>;
};

const Comma = () => {
  const style = {
    opacity: 0.6,
    fontFamily: 'monospace',
    color: '#adadad',
  };

  return <span style={style}>,</span>;
};

const Value = ({ value }: { value: TPrimitive | ReactNode }) => {
  const valueStyle = {
    fontFamily: 'monospace',
  };

  return isPrimitive(value) ? <span style={valueStyle}>{prepareValue(value)}</span> : value;
};

const KeyValue = ({ propertyKey, value }: { propertyKey: string; value: TPrimitive | ReactNode }) => {
  const keyStyle = {
    opacity: 0.6,
    color: '#adadad',
    fontFamily: 'monospace',
  };

  const wrapperStyle = {
    //marginLeft: '1rem',
  };

  return (
    <div style={wrapperStyle}>
      <span style={keyStyle}>{propertyKey}: </span>
      <Value value={value} />
    </div>
  );
};

const Function = ({ value }: { value: Function }) => {
  const valueStyle = {
    fontFamily: 'monospace',
  };

  return <span style={valueStyle}>{value.toString()}</span>;
};

type TJsonProps = {
  data: unknown;
};

export const Json = ({ data }: TJsonProps) => {
  if (isPrimitive(data)) {
    return <Value value={data} />;
  }

  const isArray = Array.isArray(data);

  if (isArray) {
    return (
      <div className={styles.arrayWrapper}>
        <SquareBrackets>
          {data.map((item: unknown, index) => {
            return (
              <div key={index}>
                <Json data={item} />
                {isPrimitive(item) && <Comma />}
              </div>
            );
          })}
        </SquareBrackets>
      </div>
    );
  }

  if (isRecord(data)) {
    const entries = Object.entries(data);

    return (
      <div>
        <CurlyBraces>
          {entries.map(([key, value], index) => {
            return <KeyValue key={index} propertyKey={key} value={<Json data={value} />} />;
          })}
        </CurlyBraces>
      </div>
    );
  }

  if (typeof data === 'function') {
    return <Function value={data} />;
  }

  console.warn('Unknown type', data);
  return null;

};
