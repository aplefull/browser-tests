import { DROPDOWN_STATE } from '@/utils/constants';
import { lazyNamed } from '@utils';

export const sections = [
  {
    name: 'All types of inputs',
    Component: lazyNamed(() => import('@/app/pages/html-tests/components/TestInputs/TestInputs'), 'TestInputs'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Old Tags',
    Component: lazyNamed(() => import('@/app/pages/html-tests/components/TestOldTags/TestOldTags'), 'TestOldTags'),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Svg favicon',
    Component: lazyNamed(
      () => import('@/app/pages/html-tests/components/TestSvgFavicon/TestSvgFavicon'),
      'TestSvgFavicon',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Supported image formats',
    Component: lazyNamed(
      () => import('@/app/pages/html-tests/components/TestSupportedImageFormats/TestSupportedImageFormats'),
      'TestSupportedImageFormats',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Supported video formats',
    Component: lazyNamed(
      () => import('@/app/pages/html-tests/components/TestSupportedVideoFormats/TestSupportedVideoFormats'),
      'TestSupportedVideoFormats',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
  {
    name: 'Supported audio formats',
    Component: lazyNamed(
      () => import('@/app/pages/html-tests/components/TestSupportedAudioFormats/TestSupportedAudioFormats'),
      'TestSupportedAudioFormats',
    ),
    initialState: DROPDOWN_STATE.CLOSED,
  },
];
