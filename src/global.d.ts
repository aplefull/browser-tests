import { TDimensions } from '@/types';

declare global {
  const registerPaint: ((name: string, classRef: PaintWorkletImplementer) => void) | undefined;

  interface Window {
    registerPaint;
    SpeechRecognition?: SpeechRecognition;
    webkitSpeechRecognition?: SpeechRecognition;
    SpeechGrammarList?: SpeechGrammarList;
    webkitSpeechGrammarList?: SpeechGrammarList;
    cookieStore?: CookieStore;
    queryLocalFonts?: () => Promise<FontData[]>;
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

    onchargingchange: EventHandlerNonNull;
    onchargingtimechange: EventHandlerNonNull;
    ondischargingtimechange: EventHandlerNonNull;
    onlevelchange: EventHandlerNonNull;
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

  interface CanvasRenderingContext2D {
    reset: () => void;
  }

  interface PhotoSettings {
    fillLightMode?: 'auto' | 'off' | 'flash';
    imageHeight?: number;
    imageWidth?: number;
    redEyeReduction?: boolean;
  }

  interface ImageCapture {
    takePhoto: (photoSettings?: PhotoSettings) => Promise<Blob>;
    getPhotoSettings: () => Promise<PhotoSettings>;
    grabFrame: () => Promise<ImageBitmap>;
  }

  interface PaintWorkletGlobalScope {
    registerPaint: (name: string, paintCtor: any) => void;
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
    onchange: EventHandlerNonNull;
  }

  abstract class Sensor extends EventTarget {
    onreading: EventHandlerNonNull;
    onerror: EventHandlerNonNull;
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

  interface Highlight {
    priority: number;
    readonly size: number;
    type: string;

    add: (range: Range) => void;
    clear: () => void;
    delete: (range: Range) => void;
    entries: () => IterableIterator<Highlight>;
    forEach: (callback: (value: Highlight, key: Highlight, map: Map<Highlight, Highlight>) => void) => void;
    has: (range: Range) => boolean;
    keys: () => IterableIterator<Highlight>;
    values: () => IterableIterator<Highlight>;
  }

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

    onaudiostart: EventHandlerNonNull;
    onaudioend: EventHandlerNonNull;
    onend: EventHandlerNonNull;
    onerror: EventHandlerNonNull;
    onnomatch: EventHandlerNonNull;
    onresult: EventHandlerNonNull;
    onsoundstart: EventHandlerNonNull;
    onsoundend: EventHandlerNonNull;
    onspeechend: EventHandlerNonNull;
    onspeechstart: EventHandlerNonNull;
    onstart: EventHandlerNonNull;

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
      listener: (event: SpeechRecognitionErrorEvent) => void | null,
      options?: boolean | AddEventListenerOptions | undefined,
    ): void;

    addEventListener(
      type: 'result',
      listener: (event: SpeechRecognitionEvent) => void | null,
      options?: boolean | AddEventListenerOptions | undefined,
    ): void;
  }

  interface SpeechRecognitionAlternative {
    readonly confidence: number;
    readonly transcript: string;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;

    item: (index: number) => SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;

    item: (index: number) => SpeechRecognitionResult;
  }

  interface MediaDevices {
    selectAudioOutput?: () => Promise<MediaDeviceInfo>;
  }

  interface HTMLAudioElement {
    setSinkId?: (sinkId: string) => Promise<void>;
  }

  interface CookieStore extends EventTarget {
    delete: (name: string) => Promise<void>;
    get: (name: string) => Promise<Cookie | null>;
    getAll: () => Promise<Cookie[]>;
    set: (options: {
      name: string;
      value: string;
      domain?: string;
      expires?: number;
      partitioned?: boolean;
      path?: string;
      sameSite?: 'strict' | 'lax' | 'none';
    }) => Promise<void>;

    addEventListener(
      type: 'change',
      listener: (event: CookieChangeEvent) => void | null,
      options?: boolean | AddEventListenerOptions | undefined,
    ): void;
  }

  interface Cookie {
    domain: string | null;
    expires: number | null;
    name: string;
    partitioned: boolean;
    path: string | null;
    sameSite: 'strict' | 'lax' | 'none' | null;
    secure: boolean;
    value: string;
  }

  interface CookieChangeEvent extends Event {
    changed: Cookie[];
    deleted: Cookie[];
  }

  interface FontData {
    family: string;
    fullName: string;
    postscriptName: string;
    style: string;

    blob: () => Promise<Blob>;
  }
}

export {};
