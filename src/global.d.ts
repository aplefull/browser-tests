declare global {
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
}

export {};
