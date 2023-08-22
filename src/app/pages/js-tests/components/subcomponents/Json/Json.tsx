import { ReactNode } from 'react';

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
      {children}
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

const KeyValue = ({ propertyKey, value }: { propertyKey: string; value: TPrimitive | ReactNode }) => {
  const keyStyle = {
    opacity: 0.6,
    color: '#adadad',
    fontFamily: 'monospace',
  };

  const valueStyle = {
    fontFamily: 'monospace',
  };

  const wrapperStyle = {
    marginLeft: '1rem',
  };

  return (
    <div style={wrapperStyle}>
      <span style={keyStyle}>{propertyKey}: </span>
      {isPrimitive(value) ? <span style={valueStyle}>{prepareValue(value)}</span> : value}
    </div>
  );
};

type TJsonProps = {
  data: Record<string, unknown> | unknown[];
};

export const Json = ({ data }: TJsonProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CurlyBraces>
        {Object.entries(data).map(([key, value], index) => {
          if (isPrimitive(value)) {
            return <KeyValue key={index} propertyKey={key} value={value} />;
          }

          if (Array.isArray(value)) {
            return (
              <KeyValue
                key={index}
                propertyKey={key}
                value={
                  <SquareBrackets key={index}>
                    {value.map((item, index) => {
                      return <Json data={item} key={index} />;
                    })}
                  </SquareBrackets>
                }
              />
            );
          }

          if (isRecord(value)) {
            return <KeyValue key={index} propertyKey={key} value={<Json data={value} />} />;
          }

          if (typeof value === 'function') {
            return <KeyValue key={index} propertyKey={key} value={value.toString()} />;
          }

          console.warn('Unknown type', key, value);
          return null;
        })}
      </CurlyBraces>
    </div>
  );
};
