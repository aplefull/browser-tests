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

declare var IdleDetector: {
  prototype: IdleDetector;
  new ({ signal }?: { signal?: AbortSignal }): IdleDetector;

  requestPermission: () => Promise<string>;
};

declare var AbsoluteOrientationSensor: {
  prototype: AbsoluteOrientationSensor;
  new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }): AbsoluteOrientationSensor;
};

declare var RelativeOrientationSensor: {
  prototype: RelativeOrientationSensor;
  new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }): RelativeOrientationSensor;
};

declare var Accelerometer: {
  prototype: Accelerometer;
  new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }): Accelerometer;
};

declare var AmbientLightSensor: {
  prototype: AmbientLightSensor;
  new (options?: { frequency?: number }): AmbientLightSensor;
};

declare var Gyroscope: {
  prototype: Gyroscope;
  new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }): Gyroscope;
};

declare var GravitySensor: {
  prototype: GravitySensor;
  new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }): GravitySensor;
};

declare var Magnetometer: {
  prototype: Magnetometer;
  new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }): Magnetometer;
};

declare var LinearAccelerationSensor: {
  prototype: LinearAccelerationSensor;
  new (options?: { frequency?: number; referenceFrame?: 'device' | 'screen' }): LinearAccelerationSensor;
};

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

declare var SpeechGrammarList: {
  prototype: SpeechGrammarList;
  new (): SpeechGrammarList;
};

declare var GPUBufferUsage: {
  readonly MAP_READ: GPUFlagsConstant;
  readonly MAP_WRITE: GPUFlagsConstant;
  readonly COPY_SRC: GPUFlagsConstant;
  readonly COPY_DST: GPUFlagsConstant;
  readonly INDEX: GPUFlagsConstant;
  readonly VERTEX: GPUFlagsConstant;
  readonly UNIFORM: GPUFlagsConstant;
  readonly STORAGE: GPUFlagsConstant;
  readonly INDIRECT: GPUFlagsConstant;
  readonly QUERY_RESOLVE: GPUFlagsConstant;
};

declare var GPUTextureUsage: {
  readonly COPY_SRC: GPUFlagsConstant;
  readonly COPY_DST: GPUFlagsConstant;
  readonly TEXTURE_BINDING: GPUFlagsConstant;
  readonly STORAGE_BINDING: GPUFlagsConstant;
  readonly RENDER_ATTACHMENT: GPUFlagsConstant;
};

declare var GPUShaderStage: {
  readonly VERTEX: GPUFlagsConstant;
  readonly FRAGMENT: GPUFlagsConstant;
  readonly COMPUTE: GPUFlagsConstant;
};

declare var GPUMapMode: {
  readonly READ: GPUFlagsConstant;
  readonly WRITE: GPUFlagsConstant;
};

interface HTMLCanvasElement {
  getContext(contextId: 'webgpu'): GPUCanvasContext | null;
}

interface OffscreenCanvas {
  getContext(contextId: 'webgpu'): GPUCanvasContext | null;
}
