import {
  TestInputs,
  TestOldTags,
  TestSupportedAudioFormats,
  TestSupportedImageFormats,
  TestSupportedVideoFormats,
  TestSvgFavicon,
} from '@/app/pages/html-tests/components';
import { DROPDOWN_STATE } from '@/utils/constants';

export const sections = [
  {
    name: 'All types of inputs',
    Component: TestInputs,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Old Tags',
    Component: TestOldTags,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Svg favicon',
    Component: TestSvgFavicon,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Supported image formats',
    Component: TestSupportedImageFormats,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Supported video formats',
    Component: TestSupportedVideoFormats,
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Supported audio formats',
    Component: TestSupportedAudioFormats,
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
