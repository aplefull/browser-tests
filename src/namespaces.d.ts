declare namespace CSS {
  const paintWorklet: PaintWorklet;

  interface PaintWorklet {
    addModule: (url: string, options?: { credentials?: 'omit' | 'same-origin' | 'include' }) => Promise<void>;
  }
}
