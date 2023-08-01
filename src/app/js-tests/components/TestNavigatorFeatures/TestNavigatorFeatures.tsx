import styles from './styles.module.scss';
import { useEffect, useState } from 'react';

// TODO move to separate file
declare global {
  interface Navigator {
    getBattery: () => Promise<BatteryManager>;
  }
}

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
type BatteryManager = BatteryManagerInfo & BatteryManagerHandlers;

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
    <section className={styles.navigator}>
      <h1>Navigator features</h1>
      <div>
        Battery info:
        <pre>{JSON.stringify(batteryManager, null, 2)}</pre>
      </div>
    </section>
  );
};
