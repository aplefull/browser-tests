import { TDimensions } from '@/types';
import { HTMLAttributes } from 'react';

declare global {
  const registerPaint: ((name: string, classRef: PaintWorkletImplementer) => void) | undefined;

  interface Window {
    registerPaint;
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
}

export {};
