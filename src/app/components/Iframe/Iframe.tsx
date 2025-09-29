import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type TIframeProps = {
  children?: ReactNode;
  className?: string;
  copyParentStyles?: boolean;
};

export const Iframe = ({ children, className, copyParentStyles }: TIframeProps) => {
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
  }, [contentRef, copyParentStyles]);

  return (
    <iframe className={className} ref={setContentRef}>
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
