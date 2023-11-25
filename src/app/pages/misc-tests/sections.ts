import {
  TestDifficultStrings,
  TestEmojis,
  TestLargeImage,
  TestLayouts,
  TestVideos,
  TestMisc,
  TestMathMl,
} from '@/app/pages/misc-tests/components';
import { DROPDOWN_STATE } from '@/utils/constants';

export const sections = [
  {
    name: 'Very large image',
    Component: TestLargeImage,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different Layouts',
    Component: TestLayouts,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Difficult strings',
    Component: TestDifficultStrings,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'All current emojis',
    Component: TestEmojis,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Videos',
    Component: TestVideos,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'MathML',
    Component: TestMathMl,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Miscellaneous tests',
    Component: TestMisc,
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
