declare global {
  interface IDBVersionChangeEvent extends Event {
    target: IDBOpenDBRequest;
  }

  interface Navigator {
    getBattery: () => Promise<BatteryManager>;
  }

  interface CanvasRenderingContext2D {
    reset: () => void;
  }
}

export {};
