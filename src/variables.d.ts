declare var ImageCapture: {
  prototype: ImageCapture;
  new (track: MediaStreamTrack): ImageCapture;
};

declare var LayoutShift: {
  prototype: LayoutShift;
  new (): LayoutShift;
};

declare var PerformanceLongTaskTiming: {
  prototype: PerformanceLongTaskTiming;
  new (): PerformanceLongTaskTiming;
};

declare var PerformanceElementTiming: {
  prototype: PerformanceElementTiming;
  new (): PerformanceElementTiming;
};

declare var EyeDropper: {
  prototype: EyeDropper;
  new ({ signal }?: { signal?: AbortSignal }): EyeDropper;
};
