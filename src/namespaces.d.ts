declare namespace CSS {
  const paintWorklet: PaintWorklet;
  const highlights: HighlightRegistry;

  interface PaintWorklet {
    addModule: (url: string, options?: { credentials?: 'omit' | 'same-origin' | 'include' }) => Promise<void>;
  }

  interface HighlightRegistry {
    size: number;
    clear: () => void;
    delete: (label: string) => void;
    entries: () => IterableIterator<[string, Highlight]>;
    forEach: (callback: (value: Highlight, key: string, map: HighlightRegistry) => void, thisArg?: any) => void;
    get: (label: string) => Highlight | undefined;
    has: (label: string) => boolean;
    keys: () => IterableIterator<string>;
    set: (label: string, highlight: Highlight) => void;
    values: () => IterableIterator<Highlight>;
  }
}

namespace Intl {
  interface Locale extends LocaleOptions {
    getCalendars?(): string[];
    getCollations?(): string[];
    getHourCycles?(): string[];
    getNumberingSystems?(): string[];
    getTextInfo?(): string[];
    getTimeZones?(): string[];
    getWeekInfo?(): string[];

    calendars: string[] | undefined;
    collations: string[] | undefined;
    hourCycles: string[] | undefined;
    numberingSystems: string[] | undefined;
    textInfo: string[] | undefined;
    timeZones: string[] | undefined;
    weekInfo: string[] | undefined;
  }
}
