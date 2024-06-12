import { DROPDOWN_STATE } from '@/utils/constants';
import {
  TestCanvas,
  TestCrypto,
  TestDates,
  TestEvents,
  TestIntl,
  TestMath,
  TestNavigatorFeatures,
  TestObservers,
  TestTabInteractions,
  TestWebGpu,
  TestWebStorage,
  TestWebWorkers,
  TestEyeDropper,
  TestIdleDetection,
  TestAudioOutputDevices,
  TestSensors,
  TestWebSpeech,
  TestPointerLock,
  CustomHighlight,
  TestWebGl,
  CompressionStreams,
  ContactPicker,
  CookieStore,
} from '@/app/pages/js-tests/components';

export const sections = [
  {
    name: 'Interactions with tab',
    Component: TestTabInteractions,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different js events',
    Component: TestEvents,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Navigator features',
    Component: TestNavigatorFeatures,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different Web Storage APIs',
    Component: TestWebStorage,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Canvas features',
    Component: TestCanvas,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Crypto API',
    Component: TestCrypto,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Math',
    Component: TestMath,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Dates',
    Component: TestDates,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Intl',
    Component: TestIntl,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Web Workers',
    Component: TestWebWorkers,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Web GPU',
    Component: TestWebGpu,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'WebGL',
    Component: TestWebGl,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Observers',
    Component: TestObservers,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Eye Dropper',
    Component: TestEyeDropper,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Idle detection API',
    Component: TestIdleDetection,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Audio output devices',
    Component: TestAudioOutputDevices,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Sensor API',
    Component: TestSensors,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Web Speech API',
    Component: TestWebSpeech,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Pointer Lock API',
    Component: TestPointerLock,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS Custom Highlight API',
    Component: CustomHighlight,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Compression Streams API',
    Component: CompressionStreams,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Contact Picker API',
    Component: ContactPicker,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Cookie Store API',
    Component: CookieStore,
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
