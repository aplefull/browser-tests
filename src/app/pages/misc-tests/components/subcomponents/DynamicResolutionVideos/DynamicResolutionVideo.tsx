import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import dynamicResolutionWebmCalm from '@assets/videos/out_smooth.webm';
import dynamicResolutionWebmCrazy from '@assets/videos/out_random.webm';
import { Select } from '@/app/components/Select/Select';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { getVideoResolution, map } from '@/utils/utils';
import styles from './styles.module.scss';
import { TResolution, TSelectOption } from '@/types';

const WEBM_OPTIONS = [
  {
    label: 'Calm',
    value: dynamicResolutionWebmCalm,
  },
  {
    label: 'Crazy',
    value: dynamicResolutionWebmCrazy,
  },
];

const CONSTRAIN_OPTIONS = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Width',
    value: 'width',
  },
  {
    label: 'Height',
    value: 'height',
  },
  {
    label: 'Both',
    value: 'both',
  },
];

export const DynamicResolutionVideos = () => {
  const [dynamicWebm, setDynamicWebm] = useState({
    label: 'Calm',
    value: dynamicResolutionWebmCalm,
  });
  const [constraint, setConstraint] = useState<any>('none');
  const [resolution, setResolution] = useState<TResolution | null>(null);
  const [forcedVideoCurrentTime, setForcedVideoCurrentTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.target;

    if (video instanceof HTMLVideoElement) {
      setForcedVideoCurrentTime(map(video.currentTime, 0, video.duration, 0, 100));
    }
  };

  const handleWebmChange = (_: string, option: TSelectOption) => {
    const label = option.label;
    const value = option.value;

    if (typeof value === 'string') {
      setDynamicWebm({
        label,
        value,
      });
      setForcedVideoCurrentTime(0);
    }
  };

  const handleConstraintChange = (_: string, option: TSelectOption) => {
    setConstraint(option.value);
  };

  const handleProgressChange = (val: number) => {
    setForcedVideoCurrentTime(val);

    if (videoRef.current) {
      videoRef.current.currentTime = map(val, 0, 100, 0, videoRef.current.duration);
    }
  };

  useEffect(() => {
    const getAspectRatio = async () => {
      const resolution = await getVideoResolution(dynamicWebm.value);
      setResolution(resolution);
    };

    getAspectRatio().catch(console.error);
  }, [dynamicWebm]);

  const aspectRatioStyle = {
    aspectRatio:
      resolution && constraint === CONSTRAIN_OPTIONS[3].value ? `${resolution.width} / ${resolution.height}` : 'unset',
  };

  return (
    <div>
      <div className={styles.dynamicResolution}>
        <video
          controls
          ref={videoRef}
          src={dynamicWebm.value}
          style={aspectRatioStyle}
          onTimeUpdate={handleTimeUpdate}
          className={styles[constraint]}
        />
      </div>
      <div className={styles.dynamicResolutionControls}>
        <span>Video type:</span>
        <Select options={WEBM_OPTIONS} onChange={handleWebmChange} value={dynamicWebm.label} />
        <span>Constraint:</span>
        <Select options={CONSTRAIN_OPTIONS} onChange={handleConstraintChange} value={constraint} />
        <span>Control video:</span>
        <RangeInput value={forcedVideoCurrentTime} min={0} max={100} onChange={handleProgressChange} />
      </div>
    </div>
  );
};
