import { DROPDOWN_STATE } from '@/utils/constants';
import { lazyNamed } from '@utils';

export const sections = [
  {
    name: 'Text-overflow',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestTextOverflow/TestTextOverflow'),
      'TestTextOverflow',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Selection styling',
    Component: lazyNamed(() => import('@/app/pages/css-tests/components/TestSelection/TestSelection'), 'TestSelection'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS filters',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestCssFilters/TestCssFilters'),
      'TestCssFilters',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS blend modes',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestCssBlendModes/TestCssBlendModes'),
      'TestCssBlendModes',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Block style tag and contenteditable attribute',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestBlockStyleTag/TestBlockStyleTag'),
      'TestBlockStyleTag',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Difficult CSS Grid layouts',
    Component: lazyNamed(() => import('@/app/pages/css-tests/components/TestCssGrid/TestCssGrid'), 'TestCssGrid'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Text-fill-color',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestTextFillColor/TestTextFillColor'),
      'TestTextFillColor',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Shape-outside',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestShapeOutside/TestShapeOutside'),
      'TestShapeOutside',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS-only collapse with transition to auto height',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestCssDropdown/TestCssDropdown'),
      'TestCssDropdown',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: ':has selector',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestHasSelector/TestHasSelector'),
      'TestHasSelector',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Writing modes',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestWritingModes/TestWritingModes'),
      'TestWritingModes',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Scroll Behaviours',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestScrollBehaviours/TestScrollBehaviours'),
      'TestScrollBehaviours',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Gradients',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestCssGradients/TestCssGradients'),
      'TestCssGradients',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Object view box',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestObjectViewBox/TestObjectViewBox'),
      'TestObjectViewBox',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Colors',
    Component: lazyNamed(() => import('@/app/pages/css-tests/components/TestColors/TestColors'), 'TestColors'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Media queries',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestMediaQueries/TestMediaQueries'),
      'TestMediaQueries',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different svg features',
    Component: lazyNamed(() => import('@/app/pages/css-tests/components/TestSvgs/TestSvgs'), 'TestSvgs'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS functions',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestCssFunctions/TestCssFunctions'),
      'TestCssFunctions',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Contain',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestContainRule/TestContainRule'),
      'TestContainRule',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Pseudo-classes',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestPseudoClasses/TestPseudoClasses'),
      'TestPseudoClasses',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Pseudo-elements',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestPseudoElements/TestPseudoElements'),
      'TestPseudoElements',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS Painting API',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestCssPaintingAPI/TestCssPaintingApi'),
      'TestCssPaintingApi',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Cursor',
    Component: lazyNamed(() => import('@/app/pages/css-tests/components/TestCursor/TestCursor'), 'TestCursor'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Field sizing',
    Component: lazyNamed(
      () => import('@/app/pages/css-tests/components/TestFieldSizing/TestFieldSizing'),
      'TestFieldSizing',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
