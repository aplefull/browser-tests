import styles from './styles.module.scss';
import { ReactNode, useEffect, useState } from 'react';
import { Square } from 'tabler-icons-react';
import { Section } from '@/app/components/Section/Section';

type BatteryManagerHandlers = {
  onchargingchange: () => void;
  onchargingtimechange: () => void;
  ondischargingtimechange: () => void;
  onlevelchange: () => void;
};

type BatteryManagerInfo = {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
};

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

  return value.toString();
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

const Value = ({ value, comma }: { value: TPrimitive | ReactNode; comma?: boolean }) => {
  const wrapperStyle = {
    marginLeft: '1rem',
  };

  return (
    <div style={wrapperStyle}>
      {isPrimitive(value) ? (
        <span>
          {prepareValue(value)}
          {comma ? ',' : ''}
        </span>
      ) : (
        value
      )}
    </div>
  );
};

const objectToHtml = (data: Record<string, unknown>) => {
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
              <SquareBrackets key={index}>
                {value.map((item, index) => {
                  console.log(item);
                  return objectToHtml(item as Record<string, unknown>);
                })}
              </SquareBrackets>
            );
          }

          if (typeof value === 'object') {
            // TODO remove as
            return <KeyValue key={index} propertyKey={key} value={objectToHtml(value as Record<string, unknown>)} />;
          }

          if (typeof value === 'function') {
            return <KeyValue key={index} propertyKey={key} value={value.toString()} />;
          }

          return null;
        })}
      </CurlyBraces>
    </div>
  );
};

export const TestNavigatorFeatures = () => {
  const [batteryManager, setBatteryManager] = useState<BatteryManagerInfo | null>(null);

  const updateBatteryInfo = async () => {
    const battery = await navigator.getBattery();

    setBatteryManager({
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      level: battery.level,
    });
  };

  useEffect(() => {
    const init = async () => {
      const battery = await navigator.getBattery();

      setBatteryManager({
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        level: battery.level,
      });

      battery.onchargingchange = updateBatteryInfo;
      battery.onchargingtimechange = updateBatteryInfo;
      battery.ondischargingtimechange = updateBatteryInfo;
      battery.onlevelchange = updateBatteryInfo;
    };

    init().catch(console.error);
  }, []);

  return (
    <Section className={styles.navigator} title="Navigator features">
      <div>
        <h2>Battery info</h2>
        <pre>{batteryManager && objectToHtml(batteryManager)}</pre>
      </div>
    </Section>
  );
};
