import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type TIframeProps = {
  children?: ReactNode;
  className?: string;
  copyParentStyles?: boolean;
  addDefaultStyles?: boolean;
};

const defaultStyles = {
  body: {
    margin: 0,
    padding: 0,
  },
  html: {
    height: '100%',
  },
  '*': {
    fontFamily: 'sans-serif',
  },
};

export const Iframe = ({ children, className, copyParentStyles, addDefaultStyles }: TIframeProps) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  useEffect(() => {
    if (copyParentStyles && contentRef) {
      const document = contentRef.parentNode?.getRootNode();

      if (document && document instanceof Document) {
        const styleNodes = document.querySelectorAll('style');

        styleNodes.forEach((node) => {
          const clone = node.cloneNode(true);
          contentRef.contentDocument?.head.appendChild(clone);
        });
      }
    }
  }, [contentRef]);

  useEffect(() => {
    if (addDefaultStyles && contentRef) {
      const style = contentRef.contentDocument?.createElement('style');

      const camelToKebab = (str: string) => str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

      if (style) {
        style.textContent = Object.entries(defaultStyles).reduce((acc, [selector, styles]) => {
          const styleText = Object.entries(styles).reduce((acc, [prop, value]) => {
            return `${acc}${camelToKebab(prop)}:${value};`;
          }, '');

          return `${acc}${selector}{${styleText}}`;
        }, '');

        contentRef.contentDocument?.head.appendChild(style);
      }
    }
  }, [contentRef, addDefaultStyles]);

  return (
    <iframe className={className} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
