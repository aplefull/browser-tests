import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      marquee: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      font: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      strike: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      dir: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      math: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      mrow: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      msub: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      mo: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        fence?: 'true' | 'false';
        form?: 'prefix' | 'infix' | 'postfix';
        stretchy?: 'true' | 'false';
        movablelimits?: 'true' | 'false';
        separator?: 'true' | 'false';
      };
      mi: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        mathvariant?: 'normal';
      };
      mn: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      mfrac: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      msubsup: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      msup: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      msqrt: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      munderover: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      mspace: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        width?: string;
      };
      mtext: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      mtd: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      mtr: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      mtable: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        columnalign?: string;
      };
      mroot: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      img: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {
        elementtiming?: string;
      };
      p: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {
        elementtiming?: string;
      };
    }
  }
}
