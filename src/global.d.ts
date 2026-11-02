import { TDimensions } from '@/types';

declare global {
  const registerPaint: ((name: string, classRef: PaintWorkletImplementer) => void) | undefined;

  interface Window {
    SpeechRecognition?: SpeechRecognition;
    webkitSpeechRecognition?: SpeechRecognition;
    SpeechGrammarList?: SpeechGrammarList;
    webkitSpeechGrammarList?: SpeechGrammarList;
    queryLocalFonts?: () => Promise<FontData[]>;
  }

  interface CookieListItem {
    domain?: string | null;
    path?: string;
    expires?: DOMHighResTimeStamp | null;
    secure?: boolean;
    sameSite?: CookieSameSite;
    partitioned?: boolean;
  }

  interface PaintWorkletImplementer {
    new (): {
      paint(
        ctx: CanvasRenderingContext2D,
        size: TDimensions,
        properties: {
          get: (propertyName: string) => unknown;
        },
        arguments: string[],
      ): void;
    };

    inputProperties?: string[];
    inputArguments?: string[];
  }

  interface IDBVersionChangeEvent extends Event {
    target: IDBOpenDBRequest;
  }

  interface BatteryManager {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;

    onchargingchange: ((event: Event) => void) | null;
    onchargingtimechange: ((event: Event) => void) | null;
    ondischargingtimechange: ((event: Event) => void) | null;
    onlevelchange: ((event: Event) => void) | null;
  }

  interface Navigator {
    deviceMemory?: number;
    getBattery?: () => Promise<BatteryManager>;
    keyboard?: {
      getLayoutMap?: () => Promise<Map<string, string>>;
      lock?: () => Promise<void>;
      unlock?: () => Promise<void>;
    };
    contacts?: {
      select: (
        properties: string[],
        options?: {
          multiple?: boolean;
        },
      ) => Promise<Contact[]>;
      getProperties: () => Promise<string[]>;
    };
  }

  interface Address {
    readonly addressLine: string[];
    readonly country: string;
    readonly city: string;
    readonly dependentLocality: string;
    readonly organization: string;
    readonly phone: string;
    readonly postalCode: string;
    readonly recipient: string;
    readonly region: string;
    readonly sortingCode: string;
  }

  interface Contact {
    address: Address[];
    email: string[];
    icon: Blob[];
    name: string[];
    tel: string[];
  }

  interface ReportBody {
    sourceFile?: string | null;
    lineNumber?: number | null;
    columnNumber?: number | null;
    documentURL?: string | null;
    referrer?: string | null;
    blockedURL?: string | null;
    effectiveDirective?: string | null;
    originalPolicy?: string | null;
    sample?: string | null;
    disposition?: string | null;
    statusCode?: number | null;

    anticipatedRemoval?: boolean | null;
    body?: string | null;
    directive?: string | null;
    id?: string | null;
    message?: string | null;
  }

  interface LayoutShift {
    value: number;
    hadRecentInput: boolean;
    lastInputTime: number;
    sources: LayoutShiftAttribution[];
  }

  interface LayoutShiftAttribution {
    node: Node;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
  }

  interface PerformanceLongTaskTiming {
    attribution: TaskAttributionTiming[];
    entryType: string;
    name: string;
    startTime: number;
    duration: number;
  }

  interface TaskAttributionTiming {
    containerId: string;
    containerName: string;
    containerSrc: string;
    containerType: string;
    duration: number;
    entryType: string;
    name: string;
    startTime: number;
    toJSON: () => unknown;
  }

  interface PerformanceElementTiming {
    duration: number;
    element: Node;
    entryType: string;
    id: string;
    identifier: string;
    intersectionRect: DOMRectReadOnly;
    loadTime: number;
    name: string;
    naturalHeight: number;
    naturalWidth: number;
    renderTime: number;
    startTime: number;
  }

  interface EyeDropper {
    open: () => Promise<{
      sRGBHex: string;
    }>;
  }

  interface IdleDetector {
    start: ({ threshold, signal }: { threshold?: number; signal?: AbortSignal }) => Promise<void>;
    addEventListener: (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) => void;
    screenState: 'locked' | 'unlocked';
    userState: 'active' | 'idle';
    onchange: ((event: Event) => void) | null;
  }

  abstract class Sensor extends EventTarget {
    onreading: ((event: Event) => void) | null;
    onerror: ((event: Event) => void) | null;
    start: () => void;
    stop: () => void;
  }

  abstract class OrientationSensor extends Sensor {
    quaternion: number[] | null;
    populateMatrix: (targetMatrix: Float32Array | Float64Array) => void;
  }

  interface AbsoluteOrientationSensor extends OrientationSensor {}

  interface RelativeOrientationSensor extends OrientationSensor {}

  interface Accelerometer extends Sensor {
    x: number | null;
    y: number | null;
    z: number | null;
  }

  interface AmbientLightSensor extends Sensor {
    illuminance: number | null;
  }

  interface Gyroscope extends Sensor {
    x: number | null;
    y: number | null;
    z: number | null;
  }

  interface GravitySensor extends Accelerometer {}

  interface Magnetometer extends Sensor {
    x: number | null;
    y: number | null;
    z: number | null;
  }

  interface LinearAccelerationSensor extends Accelerometer {}

  interface SpeechGrammar {
    src: string;
    weight?: number;
  }

  interface SpeechGrammarList {
    readonly length: number;

    addFromUri: (src: string) => void;
    addFromString: (string: string, weight?: number) => void;
    item: (index: number) => SpeechGrammar;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    grammars?: SpeechGrammarList;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    serviceURI: string;

    onaudiostart: ((event: Event) => void) | null;
    onaudioend: ((event: Event) => void) | null;
    onend: ((event: Event) => void) | null;
    onerror: ((event: Event) => void) | null;
    onnomatch: ((event: Event) => void) | null;
    onresult: ((event: Event) => void) | null;
    onsoundstart: ((event: Event) => void) | null;
    onsoundend: ((event: Event) => void) | null;
    onspeechend: ((event: Event) => void) | null;
    onspeechstart: ((event: Event) => void) | null;
    onstart: ((event: Event) => void) | null;

    abort: () => void;
    start: () => void;
    stop: () => void;

    addEventListener(
      type:
        | 'audiostart'
        | 'audioend'
        | 'start'
        | 'end'
        | 'soundstart'
        | 'soundend'
        | 'speechstart'
        | 'speechend'
        | 'nomatch',
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    addEventListener(
      type: 'error',
      listener: ((event: SpeechRecognitionErrorEvent) => void) | null,
      options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    addEventListener(
      type: 'result',
      listener: ((event: SpeechRecognitionEvent) => void) | null,
      options?: boolean | AddEventListenerOptions | undefined,
    ): void;
  }

  interface MediaDevices {
    selectAudioOutput?: () => Promise<MediaDeviceInfo>;
  }

  interface FontData {
    family: string;
    fullName: string;
    postscriptName: string;
    style: string;

    blob: () => Promise<Blob>;
  }
}
