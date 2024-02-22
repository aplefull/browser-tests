import { DROPDOWN_STATE } from '@/utils/constants';
import {
  TestBlockStyleTag,
  TestColors,
  TestContainRule,
  TestCssBlendModes,
  TestCssDropdown,
  TestCssFilters,
  TestCssFunctions,
  TestCssGradients,
  TestCssGrid,
  TestHasSelector,
  TestMediaQueries,
  TestObjectViewBox,
  TestScrollBehaviours,
  TestSelection,
  TestShapeOutside,
  TestSvgs,
  TestTextFillColor,
  TestTextOverflow,
  TestWritingModes,
  TestPseudoClasses,
  TestCssPaintingApi,
  TestCursor,
  TestFieldSizing,
} from '@/app/pages/css-tests/components';

export const sections = [
  {
    name: 'Text-overflow',
    Component: TestTextOverflow,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Selection styling',
    Component: TestSelection,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS filters',
    Component: TestCssFilters,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS blend modes',
    Component: TestCssBlendModes,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Block style tag and contenteditable attribute',
    Component: TestBlockStyleTag,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Difficult CSS Grid layouts',
    Component: TestCssGrid,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Text-fill-color',
    Component: TestTextFillColor,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Shape-outside',
    Component: TestShapeOutside,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS-only collapse with transition to auto height',
    Component: TestCssDropdown,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: ':has selector',
    Component: TestHasSelector,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Writing modes',
    Component: TestWritingModes,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Scroll Behaviours',
    Component: TestScrollBehaviours,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Gradients',
    Component: TestCssGradients,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Object view box',
    Component: TestObjectViewBox,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Colors',
    Component: TestColors,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Media queries',
    Component: TestMediaQueries,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Different svg features',
    Component: TestSvgs,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS functions',
    Component: TestCssFunctions,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Contain',
    Component: TestContainRule,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Pseudo-classes',
    Component: TestPseudoClasses,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS Painting API',
    Component: TestCssPaintingApi,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Cursor',
    Component: TestCursor,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Field sizing',
    Component: TestFieldSizing,
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
