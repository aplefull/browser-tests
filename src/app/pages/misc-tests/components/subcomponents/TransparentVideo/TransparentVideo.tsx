import { useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import transparentWebm from '@assets/videos/bad-apple-transparent.webm';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { ColorPicker } from '@/app/components/ColorPicker/ColorPicker';
import { Button } from '@/app/components/Button/Button';
import { Video } from '@/app/components/Video/Video';
import { Color } from '@/app/components/ColorPicker/Color';

export const TransparentVideo = () => {
  const [shadow, setShadow] = useState(false);
  const [colorBurn, setColorBurn] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<Color>(new Color().parse('transparent'));

  return (
    <div className={styles.transparency}>
      <div className={styles.videoContainer}>
        <Video
          className={styles.videoPlayer}
          src={transparentWebm}
          initialVolume={0.2}
          style={{ backgroundColor: backgroundColor.toRGBAString() }}
          videoClassName={classNames({
            [styles.shadow]: shadow,
            [styles.colorBurn]: colorBurn,
          })}
        />
        <span>It makes sense to use these checkboxes only with default background color.</span>
        <Checkbox checked={shadow} onChange={setShadow} label="Add shadow" />
        <Checkbox checked={colorBurn} onChange={setColorBurn} label="Add color burn" />
        <div className={styles.colorControl}>
          <span>Pick a background color:</span>
          <ColorPicker onChange={setBackgroundColor} value={backgroundColor} />
          <Button
            className={styles.resetColor}
            variant="dark"
            text="Reset color"
            onClick={() => setBackgroundColor(new Color().parse('transparent'))}
          />
        </div>
      </div>
    </div>
  );
};
