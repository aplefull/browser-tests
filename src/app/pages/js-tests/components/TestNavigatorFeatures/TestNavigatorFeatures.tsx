import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';
import { NavigatorMediaDevices } from '@/app/pages/js-tests/components/subcomponents/NavigatorMediaDevices/NavigatorMediaDevices';
import { NavigatorGeolocation } from '@/app/pages/js-tests/components/subcomponents/NavigatorGeolocation/NavigatorGeolocation';
import { NavigatorBattery } from '@/app/pages/js-tests/components/subcomponents/NavigatorBattery/NavigatorBattery';

export const TestNavigatorFeatures = () => {
  return (
    <Section className={styles.navigator} title="Navigator features">
      <NavigatorBattery />
      <NavigatorGeolocation />
      <NavigatorMediaDevices />
    </Section>
  );
};
