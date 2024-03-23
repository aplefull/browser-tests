import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { useRef, useState } from 'react';
import audioSrc from '../../../../../assets/audio/winter.mp3';
import { Audio } from '@/app/components/Audio/Audio';
import { ErrorMessage } from '@/app/components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '@utils';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';

export const TestAudioOutputDevices = () => {
  const [error, setError] = useState('');
  const [device, setDevice] = useState<MediaDeviceInfo>();

  const ref = useRef<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    try {
      if (!navigator.mediaDevices.selectAudioOutput) {
        setError('selectAudioOutput is not supported');
        return;
      }

      const audioDevice = await navigator.mediaDevices.selectAudioOutput();
      setDevice(audioDevice);

      if (ref.current) {
        if (!ref.current.setSinkId) {
          setError('setSinkId is not supported');
          return;
        }

        await ref.current.setSinkId(audioDevice.deviceId);
      }

      setError('');
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className={styles.container}>
      <p>You can select audio device to play audio through:</p>
      <div className={styles.row}>
        <Button className={styles.button} text="Select audio device" onClick={handleClick} />
        <Audio ref={ref} src={audioSrc} defaultLoop defaultVolume={0.5} />
      </div>
      {device && (
        <Json
          data={{
            deviceId: device?.deviceId,
            groupId: device?.groupId,
            kind: device?.kind,
            label: device?.label,
          }}
        />
      )}
      <ErrorMessage message={error} />
    </div>
  );
};
