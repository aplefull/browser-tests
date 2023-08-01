declare global {
  interface IDBVersionChangeEvent extends Event {
    target: IDBOpenDBRequest;
  }

  interface Navigator {
    getBattery: () => Promise<BatteryManager>;
  }
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.tiff' {
  const content: string;
  export default content;
}

declare module '*.avi' {
  const content: string;
  export default content;
}

declare module '*.3gp' {
  const content: string;
  export default content;
}

declare module '*.mpeg' {
  const content: string;
  export default content;
}

export {};
