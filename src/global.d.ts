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
    getBattery?: () => Promise<BatteryManager>;
  }

  interface CanvasRenderingContext2D {
    reset: () => void;
  }
}

export {};
