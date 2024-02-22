declare namespace CSS {
  const paintWorklet: PaintWorklet;

  interface PaintWorklet {
    addModule: (url: string, options?: { credentials?: 'omit' | 'same-origin' | 'include' }) => Promise<void>;
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
