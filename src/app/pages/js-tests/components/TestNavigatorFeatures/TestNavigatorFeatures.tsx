import styles from './styles.module.scss';
import { NavigatorMediaDevices } from '@/app/pages/js-tests/components/subcomponents/NavigatorMediaDevices/NavigatorMediaDevices';
import { NavigatorGeolocation } from '@/app/pages/js-tests/components/subcomponents/NavigatorGeolocation/NavigatorGeolocation';
import { NavigatorBattery } from '@/app/pages/js-tests/components/subcomponents/NavigatorBattery/NavigatorBattery';
import { NavigatorKeyboard } from '@/app/pages/js-tests/components/subcomponents/NavigatorLayoutMap/NavigatorKeyboard';
import { NavigatorMisc } from '@/app/pages/js-tests/components/subcomponents/NavigatorMisc/NavigatorMisc';
import { NavigatorBeacon } from '@/app/pages/js-tests/components/subcomponents/NavigatorBeacon/NavigatorBeacon';

export const TestNavigatorFeatures = () => {
  return (
    <div className={styles.navigator}>
      <NavigatorBattery />
      <NavigatorBeacon />
      <NavigatorGeolocation />
      <NavigatorMediaDevices />
      <NavigatorKeyboard />
      <NavigatorMisc />
    </div>
  );
};
