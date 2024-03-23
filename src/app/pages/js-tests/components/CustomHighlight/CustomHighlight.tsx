import styles from './styles.module.scss';
import { useEffect, useRef } from 'react';

const createRange = (parentNode: Node, start: number, end: number) => {
  const range = new Range();
  const treeWalker = document.createTreeWalker(parentNode, NodeFilter.SHOW_TEXT);

  const nodes: Node[] = [];

  while (treeWalker.nextNode()) {
    nodes.push(treeWalker.currentNode);
  }

  let current = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const length = node.textContent?.length || 0;

    if (current + length >= start) {
      range.setStart(node, start - current);
      break;
    }

    current += length;
  }

  current = 0;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const length = node.textContent?.length || 0;

    if (current + length >= end) {
      range.setEnd(node, end - current);
      break;
    }

    current += length;
  }

  return range;
};

export const CustomHighlight = () => {
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const textNode = textRef.current;
    if (!textNode) return;

    const rangeIndexes = [
      [0, 5],
      [1, 6],
      [32, 35],
      [44, 47],
      [55, 60],
    ];

    const ranges = rangeIndexes.map(([start, end]) => {
      return createRange(textNode, start, end);
    });

    const highlight = new Highlight(...ranges);

    CSS.highlights.set('ranges-highlight', highlight);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.text} ref={textRef}>
        Lorem ipsum dolor sit amet. ‫Vela‫! arcu nisi
        <span>
          <span>0</span>田中さんにあげて下さい
        </span>
        ﷺ<div>表ポあA鷗ŒéＢ逍Üßªąñ丂㐀𠀀</div>
      </div>
    </div>
  );
};
