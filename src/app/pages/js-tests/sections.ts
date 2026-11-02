import { DROPDOWN_STATE } from '@/utils/constants';
import { lazyNamed } from '@utils';

export const sections = [
  {
    name: 'Interactions with tab',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestTabInteractions/TestTabInteractions'),
      'TestTabInteractions',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different js events',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestEvents/TestEvents'), 'TestEvents'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Navigator features',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestNavigatorFeatures/TestNavigatorFeatures'),
      'TestNavigatorFeatures',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different Web Storage APIs',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestWebStorage/TestWebStorage'),
      'TestWebStorage',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Canvas features',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestCanvas/TestCanvas'), 'TestCanvas'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Crypto API',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestCrypto/TestCrypto'), 'TestCrypto'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Math',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestMath/TestMath'), 'TestMath'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Dates',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestDates/TestDates'), 'TestDates'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Intl',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestIntl/TestIntl'), 'TestIntl'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Web Workers',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestWebWorkers/TestWebWorkers'),
      'TestWebWorkers',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Web GPU',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestWebGpu/TestWebGpu'), 'TestWebGpu'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'WebGL',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestWebGl/TestWebGl'), 'TestWebGl'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Observers',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestObservers/TestObservers'), 'TestObservers'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Eye Dropper',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestEyeDropper/TestEyeDropper'),
      'TestEyeDropper',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Idle detection API',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestIdleDetection/TestIdleDetection'),
      'TestIdleDetection',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Audio output devices',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestAudioOutputDevices/TestAudioOutputDevices'),
      'TestAudioOutputDevices',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Sensor API',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestSensors/TestSensors'), 'TestSensors'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Web Speech API',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestWebSpeech/TestWebSpeech'), 'TestWebSpeech'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Pointer Lock API',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/TestPointerLock/TestPointerLock'),
      'TestPointerLock',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS Custom Highlight API',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/CustomHighlight/CustomHighlight'),
      'CustomHighlight',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Compression Streams API',
    Component: lazyNamed(
      () => import('@/app/pages/js-tests/components/CompressionStreams/CompressionStreams'),
      'CompressionStreams',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Contact Picker API',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/ContactPicker/ContactPicker'), 'ContactPicker'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Cookie Store API',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/CookieStore/CookieStore'), 'CookieStore'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Local Font Access API',
    Component: lazyNamed(() => import('@/app/pages/js-tests/components/TestLocalFonts/TestLocalFonts'), 'LocalFonts'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
