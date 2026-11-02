declare namespace CSS {
  const paintWorklet: PaintWorklet;

  interface PaintWorklet {
    addModule: (url: string, options?: { credentials?: 'omit' | 'same-origin' | 'include' }) => Promise<void>;
  }
}

declare namespace Intl {
  interface Locale {
    calendars?: string[];
    collations?: string[];
    hourCycles?: string[];
    numberingSystems?: string[];
    textInfo?: TextInfo;
    timeZones?: string[];
    weekInfo?: WeekInfo;
  }
}
