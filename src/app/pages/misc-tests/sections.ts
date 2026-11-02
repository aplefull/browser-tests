import { DROPDOWN_STATE } from '@/utils/constants';
import { lazyNamed } from '@utils';

export const sections = [
  {
    name: 'Very large image',
    Component: lazyNamed(
      () => import('@/app/pages/misc-tests/components/TestLargeImage/TestLargeImage'),
      'TestLargeImage',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different Layouts',
    Component: lazyNamed(() => import('@/app/pages/misc-tests/components/TestLayouts/TestLayouts'), 'TestLayouts'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Difficult strings',
    Component: lazyNamed(
      () => import('@/app/pages/misc-tests/components/TestDifficultStrings/TestDifficultStrings'),
      'TestDifficultStrings',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'All current emojis',
    Component: lazyNamed(() => import('@/app/pages/misc-tests/components/TestEmojis/TestEmojis'), 'TestEmojis'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Videos',
    Component: lazyNamed(() => import('@/app/pages/misc-tests/components/TestVideos/TestVideos'), 'TestVideos'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'MathML',
    Component: lazyNamed(() => import('@/app/pages/misc-tests/components/TestMathML/TestMathML'), 'TestMathMl'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Miscellaneous tests',
    Component: lazyNamed(() => import('@/app/pages/misc-tests/components/TestMisc/TestMisc'), 'TestMisc'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
