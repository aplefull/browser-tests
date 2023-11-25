import { SyntheticEvent, useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import transparentWebm from '@assets/videos/bad-apple-transparent.webm';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { ColorPicker } from '@/app/components/ColorPicker/ColorPicker';
import { Button } from '@/app/components/Button/Button';

export const TransparentVideo = () => {
  const [shadow, setShadow] = useState(false);
  const [colorBurn, setColorBurn] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('transparent');

  const onLoadStart = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    video.volume = 0.2;
  };

  return (
    <div className={styles.transparency}>
      <div className={styles.videoContainer}>
        <video
          className={classNames({
            [styles.shadow]: shadow,
            [styles.colorBurn]: colorBurn,
          })}
          style={{ backgroundColor }}
          onLoadStart={onLoadStart}
          controls
          src={transparentWebm}
        />
        <span>It makes sense to use these checkboxes only with default background color.</span>
        <Checkbox checked={shadow} onChange={setShadow} label="Add shadow (looks cool)" />
        <Checkbox
          checked={colorBurn}
          onChange={setColorBurn}
          label="Add color burn (removes white outline, but makes controls barely visible)"
        />
        <div className={styles.colorControl}>
          <span>Pick a background color:</span>
          <ColorPicker onChange={setBackgroundColor} value={backgroundColor} />
          <Button
            className={styles.resetColor}
            variant="dark"
            text="Reset color"
            onClick={() => setBackgroundColor('transparent')}
          />
        </div>
      </div>
    </div>
  );
};
