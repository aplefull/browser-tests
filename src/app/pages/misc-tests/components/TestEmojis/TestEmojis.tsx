import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { requestEmojis } from '@/utils/utils';
import { TEmoji } from '@/types';

export const TestEmojis = () => {
  const [useEmojiFont, setUseEmojiFont] = useState(true);
  const [emojiList, setEmojiList] = useState<TEmoji[]>([]);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const init = async () => {
      const rawEmojis = await requestEmojis();
      setEmojiList(rawEmojis.map((emoji) => ({ name: emoji.name, emoji: emoji.char })));
    };

    init().catch(console.error);
  }, []);

  return (
    <div className={styles.emojis}>
      <div className={styles.inputs}>
        <label>
          <input type="checkbox" checked={useEmojiFont} onChange={() => setUseEmojiFont(!useEmojiFont)} />
          Use Noto Color Emoji font. (If used, every emoji should be rendered correctly)
        </label>
        <label>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={fontSize}
            onChange={(event) => setFontSize(parseInt(event.target.value))}
          />
          Font size: {fontSize}px
        </label>
      </div>
      <div
        className={classNames(styles.container, {
          [styles.emojiFont]: useEmojiFont,
        })}
      >
        {emojiList.map((emoji) => (
          <span
            key={emoji.emoji}
            className={styles.emoji}
            style={{
              fontSize: `${fontSize}px`,
            }}
            title={emoji.name}
            aria-label={emoji.name}
          >
            {emoji.emoji}
          </span>
        ))}
      </div>
    </div>
  );
};
