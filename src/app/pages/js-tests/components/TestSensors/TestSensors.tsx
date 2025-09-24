import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

type TSensorsRef = {
  accelerometer: Accelerometer | null;
  gyroscope: Gyroscope | null;
  magnetometer: Magnetometer | null;
  ambientLight: AmbientLightSensor | null;
  gravity: GravitySensor | null;
  linearAcceleration: LinearAccelerationSensor | null;
  relativeOrientation: RelativeOrientationSensor | null;
  absoluteOrientation: AbsoluteOrientationSensor | null;
};

type TCoordinateReading = {
  x?: number | null;
  y?: number | null;
  z?: number | null;
};

type TQuaternionReading = number[] | null | undefined;

type TAmbientLightReading = { illuminance?: number | null };

const permissionNames = [
  'background-sync',
  'clipboard-read',
  'clipboard-write',
  'compute-pressure',
  'geolocation',
  'local-fonts',
  'microphone',
  'camera',
  'notifications',
  'payment-handler',
  'push',
  'captured-surface-control',
  'display-capture',
  'screen-wake-lock',
  'accelerometer',
  'gyroscope',
  'magnetometer',
  'ambient-light-sensor',
  'storage-access',
  'top-level-storage-access',
  'persistent-storage',
  'bluetooth',
  'midi',
  'window-management',
];

export const TestSensors = () => {
  const [magnetometerData, setMagnetometerData] = useState<TCoordinateReading | null>();
  const [accelerometerData, setAccelerometerData] = useState<TCoordinateReading | null>();
  const [gyroscopeData, setGyroscopeData] = useState<TCoordinateReading | null>();
  const [ambientLightData, setAmbientLightData] = useState<TAmbientLightReading | null>();
  const [gravityData, setGravityData] = useState<TCoordinateReading | null>();
  const [linearAccelerationData, setLinearAccelerationData] = useState<TCoordinateReading | null>();
  const [relativeOrientationData, setRelativeOrientationData] = useState<TQuaternionReading | null>();
  const [absoluteOrientationData, setAbsoluteOrientationData] = useState<TQuaternionReading | null>();

  const dataToFixed = (data?: TCoordinateReading | TQuaternionReading | TAmbientLightReading | null) => {
    if (data === null || data === undefined) {
      return null;
    }

    if (Array.isArray(data)) {
      return data.map((value) => (value === null ? null : value.toFixed(4)));
    }

    if ('illuminance' in data) {
      return {
        illuminance: data.illuminance === null || data.illuminance === undefined ? null : data.illuminance.toFixed(4),
      };
    }

    if ('x' in data && 'y' in data && 'z' in data) {
      return {
        x: data.x === null || data.x === undefined ? null : data.x.toFixed(4),
        y: data.y === null || data.y === undefined ? null : data.y.toFixed(4),
        z: data.z === null || data.z === undefined ? null : data.z.toFixed(4),
      };
    }
  };

  const sensorsRef = useRef<TSensorsRef>({
    accelerometer: null,
    gyroscope: null,
    magnetometer: null,
    ambientLight: null,
    gravity: null,
    linearAcceleration: null,
    relativeOrientation: null,
    absoluteOrientation: null,
  });

  useEffect(() => {
    const sensors = sensorsRef.current;

    const onMagnetometerReading = () => {
      setMagnetometerData({
        x: sensors.magnetometer?.x,
        y: sensors.magnetometer?.y,
        z: sensors.magnetometer?.z,
      });
    };

    const onAccelerometerReading = () => {
      setAccelerometerData({
        x: sensors.accelerometer?.x,
        y: sensors.accelerometer?.y,
        z: sensors.accelerometer?.z,
      });
    };

    const onGyroscopeReading = () => {
      setGyroscopeData({
        x: sensors.gyroscope?.x,
        y: sensors.gyroscope?.y,
        z: sensors.gyroscope?.z,
      });
    };

    const onAmbientLightReading = () => {
      setAmbientLightData({
        illuminance: sensors.ambientLight?.illuminance,
      });
    };

    const onGravityReading = () => {
      setGravityData({
        x: sensors.gravity?.x,
        y: sensors.gravity?.y,
        z: sensors.gravity?.z,
      });
    };

    const onLinearAccelerationReading = () => {
      setLinearAccelerationData({
        x: sensors.linearAcceleration?.x,
        y: sensors.linearAcceleration?.y,
        z: sensors.linearAcceleration?.z,
      });
    };

    const onRelativeOrientationReading = () => {
      setRelativeOrientationData(sensors.relativeOrientation?.quaternion);
    };

    const onAbsoluteOrientationReading = () => {
      setAbsoluteOrientationData(sensors.absoluteOrientation?.quaternion);
    };

    const isPermissionName = (name: string): name is PermissionName => {
      return permissionNames.includes(name);
    };

    const init = async () => {
      const names = ['accelerometer', 'magnetometer', 'gyroscope', 'ambient-light-sensor'];

      const permissionPromises = names.map((name) => {
        if (isPermissionName(name)) {
          return navigator.permissions.query({ name });
        }

        throw new Error(`Permission ${name} is not a valid PermissionName`);
      });

      const permissions = await Promise.allSettled(permissionPromises);

      permissions.forEach((promiseResult, index) => {
        if (promiseResult.status === 'fulfilled' && promiseResult.value.state !== 'granted') {
          switch (names[index]) {
            case 'accelerometer':
              setAccelerometerData(null);
              break;

            case 'magnetometer':
              setMagnetometerData(null);
              break;

            case 'gyroscope':
              setGyroscopeData(null);
              break;

            case 'ambient-light-sensor':
              setAmbientLightData(null);
              break;
          }
        }
      });

      try {
        const sensor = new Magnetometer();

        sensor.addEventListener('reading', onMagnetometerReading);
        sensor.start();

        sensors.magnetometer = sensor;
      } catch (error) {
        setMagnetometerData(null);
      }

      try {
        const sensor = new Accelerometer();

        sensor.addEventListener('reading', onAccelerometerReading);
        sensor.start();

        sensors.accelerometer = sensor;
      } catch (error) {
        setAccelerometerData(null);
      }

      try {
        const sensor = new Gyroscope();

        sensor.addEventListener('reading', onGyroscopeReading);
        sensor.start();

        sensors.gyroscope = sensor;
      } catch (error) {
        setGyroscopeData(null);
      }

      try {
        const sensor = new AmbientLightSensor();

        sensor.addEventListener('reading', onAmbientLightReading);
        sensor.start();

        sensors.ambientLight = sensor;
      } catch (error) {
        setAmbientLightData(null);
      }

      try {
        const sensor = new GravitySensor();

        sensor.addEventListener('reading', onGravityReading);
        sensor.start();

        sensors.gravity = sensor;
      } catch (error) {
        setGravityData(null);
      }

      try {
        const sensor = new LinearAccelerationSensor();

        sensor.addEventListener('reading', onLinearAccelerationReading);
        sensor.start();

        sensors.linearAcceleration = sensor;
      } catch (error) {
        setLinearAccelerationData(null);
      }

      try {
        const sensor = new RelativeOrientationSensor();
        sensor.onreading = onRelativeOrientationReading;
        sensor.addEventListener('reading', onRelativeOrientationReading);
        sensor.start();

        sensors.relativeOrientation = sensor;
      } catch (error) {
        setRelativeOrientationData(null);
      }

      try {
        const sensor = new AbsoluteOrientationSensor({
          frequency: 60,
          referenceFrame: 'device',
        });

        sensor.addEventListener('reading', onAbsoluteOrientationReading);
        sensor.start();

        sensors.absoluteOrientation = sensor;
      } catch (error) {
        setAbsoluteOrientationData(null);
      }
    };

    init().catch(console.error);

    return () => {
      const sensors = sensorsRef.current;

      sensors.magnetometer?.stop();
      sensors.magnetometer?.removeEventListener('reading', onMagnetometerReading);

      sensors.accelerometer?.stop();
      sensors.accelerometer?.removeEventListener('reading', onAccelerometerReading);

      sensors.gyroscope?.stop();
      sensors.gyroscope?.removeEventListener('reading', onGyroscopeReading);

      sensors.ambientLight?.stop();
      sensors.ambientLight?.removeEventListener('reading', onAmbientLightReading);

      sensors.gravity?.stop();
      sensors.gravity?.removeEventListener('reading', onGravityReading);

      sensors.linearAcceleration?.stop();
      sensors.linearAcceleration?.removeEventListener('reading', onLinearAccelerationReading);

      sensors.relativeOrientation?.stop();
      sensors.relativeOrientation?.removeEventListener('reading', onRelativeOrientationReading);

      sensors.absoluteOrientation?.stop();
      sensors.absoluteOrientation?.removeEventListener('reading', onAbsoluteOrientationReading);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <span>Magnetometer:</span>
        {magnetometerData === null || magnetometerData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(magnetometerData)} />
        )}
      </div>
      <div className={styles.group}>
        <span>Accelerometer:</span>
        {accelerometerData === null || accelerometerData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(accelerometerData)} />
        )}
      </div>
      <div className={styles.group}>
        <span>Gyroscope:</span>
        {gyroscopeData === null || gyroscopeData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(gyroscopeData)} />
        )}
      </div>
      <div className={styles.group}>
        <span>Ambient Light Sensor:</span>
        {ambientLightData === null || ambientLightData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(ambientLightData)} />
        )}
      </div>
      <div className={styles.group}>
        <span>Gravity Sensor:</span>
        {gravityData === null || gravityData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(gravityData)} />
        )}
      </div>
      <div className={styles.group}>
        <span>Linear Acceleration:</span>
        {linearAccelerationData === null || linearAccelerationData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(linearAccelerationData)} />
        )}
      </div>
      <div className={styles.group}>
        <span>Relative Orientation:</span>
        {relativeOrientationData === null || relativeOrientationData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(relativeOrientationData)} />
        )}
      </div>
      <div className={styles.group}>
        <span>Absolute Orientation:</span>
        {absoluteOrientationData === null || absoluteOrientationData === undefined ? (
          <span>Unavailable</span>
        ) : (
          <Json data={dataToFixed(absoluteOrientationData)} />
        )}
      </div>
    </div>
  );
};
