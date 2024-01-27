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
} from '@/app/pages/css-tests/components';

export const sections = [
  {
    name: 'Text-overflow',
    Component: TestTextOverflow,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Selection styling',
    Component: TestSelection,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'CSS filters',
    Component: TestCssFilters,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'CSS blend modes',
    Component: TestCssBlendModes,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Block style tag and contenteditable attribute',
    Component: TestBlockStyleTag,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Difficult CSS Grid layouts',
    Component: TestCssGrid,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Text-fill-color',
    Component: TestTextFillColor,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Shape-outside',
    Component: TestShapeOutside,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS-only collapse with transition to auto height',
    Component: TestCssDropdown,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: ':has selector',
    Component: TestHasSelector,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Writing modes',
    Component: TestWritingModes,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Scroll Behaviours',
    Component: TestScrollBehaviours,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Gradients',
    Component: TestCssGradients,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Object view box',
    Component: TestObjectViewBox,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Colors',
    Component: TestColors,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Media queries',
    Component: TestMediaQueries,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Different svg features',
    Component: TestSvgs,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'CSS functions',
    Component: TestCssFunctions,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Contain',
    Component: TestContainRule,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'Pseudo-classes',
    Component: TestPseudoClasses,
    initialState: DROPDOWN_STATE.OPEN,
  },
  {
    name: 'CSS Painting API',
    Component: TestCssPaintingApi,
    initialState: DROPDOWN_STATE.OPEN,
  },
];
