import { DROPDOWN_STATE } from '@/utils/constants';
import {
  TestCanvas,
  TestCrypto,
  TestDates,
  TestEvents,
  TestIntl,
  TestLabelingLoops,
  TestMath,
  TestNavigatorFeatures,
  TestObservers,
  TestTabInteractions,
  TestWebGpu,
  TestWebStorage,
  TestWebWorkers,
  TestEyeDropper,
} from '@/app/pages/js-tests/components';

export const sections = [
  {
    name: 'JS labels',
    Component: TestLabelingLoops,
    initialState: DROPDOWN_STATE.CLOSED,
  },
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
    name: 'Observers',
    Component: TestObservers,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Eye Dropper',
    Component: TestEyeDropper,
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
