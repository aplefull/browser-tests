import { DROPDOWN_STATE } from '@/utils/constants';
import {
  TestCanvas,
  TestCrypto,
  TestDates,
  TestEvents,
  TestLabelingLoops,
  TestMath,
  TestNavigatorFeatures,
  TestTabInteractions,
  TestWebStorage,
} from '@/app/pages/js-tests/components';

export const sections = [
  {
    name: 'JS labels',
    Component: TestLabelingLoops,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Interactions with tab',
    Component: TestTabInteractions,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Different js events',
    Component: TestEvents,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Navigator features',
    Component: TestNavigatorFeatures,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Different Web Storage APIs',
    Component: TestWebStorage,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Canvas features',
    Component: TestCanvas,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Crypto API',
    Component: TestCrypto,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Math',
    Component: TestMath,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Dates',
    Component: TestDates,
    initialState: DROPDOWN_STATE.OPEN,
  },
];
