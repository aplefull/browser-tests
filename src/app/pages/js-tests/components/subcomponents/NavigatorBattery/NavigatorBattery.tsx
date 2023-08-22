import { useEffect, useState } from 'react';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

type TBatteryManagerInfo = {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
};

export const NavigatorBattery = () => {
  const [batteryManager, setBatteryManager] = useState<TBatteryManagerInfo | null>(null);

  const getBattery = async (): Promise<BatteryManager | null> => {
    if (!navigator?.getBattery) return null;

    return navigator.getBattery();
  };

  const updateBatteryInfo = async () => {
    const battery = await getBattery();

    if (!battery) return;

    setBatteryManager({
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      level: battery.level,
    });
  };

  useEffect(() => {
    const init = async () => {
      const battery = await getBattery();

      if (!battery) return;

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
    <div>
      <h2>Battery info</h2>
      <pre>{batteryManager ? <Json data={batteryManager} /> : <span>Not supported</span>}</pre>
    </div>
  );
};
