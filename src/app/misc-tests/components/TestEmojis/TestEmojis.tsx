import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

type TEmoji = {
  name: string;
  emoji: string;
};

type TRawEmoji = {
  category: string;
  char: string;
  codes: string;
  group: string;
  name: string;
  subgroup: string;
};

export const TestEmojis = () => {
  const [useEmojiFont, setUseEmojiFont] = useState(false);
  const [emojiList, setEmojiList] = useState<TEmoji[]>([]);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const init = async () => {
      const emojiListUrl = 'https://unpkg.com/emoji.json@14.0.0/emoji.json';

      const response = await fetch(emojiListUrl);
      const data: TRawEmoji[] = await response.json();

      setEmojiList(data.map((emoji) => ({ name: emoji.name, emoji: emoji.char })));
    };

    init().catch(console.error);
  }, []);

  return (
    <section className={styles.emojis}>
      <h1>All current emojis</h1>
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
    </section>
  );
};
