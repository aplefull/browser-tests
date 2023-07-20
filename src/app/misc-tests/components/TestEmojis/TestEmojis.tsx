import styles from './styles.module.scss';
import { useEffect, useState } from 'react';

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
  const [emojiList, setEmojiList] = useState<TEmoji[]>([]);

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
      <div className={styles.container}>
        {emojiList.map((emoji) => (
          <span key={emoji.emoji} className={styles.emoji} title={emoji.name} aria-label={emoji.name}>
            {emoji.emoji}
          </span>
        ))}
      </div>
    </section>
  );
};
