import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DROPDOWN_STATE } from '@/utils/constants';
import { saveSectionsState } from '@/utils/utils';

type TDropdown = {
  name: string;
  initialState: (typeof DROPDOWN_STATE)[keyof typeof DROPDOWN_STATE];
};

export type TSettingsInitialState = {
  preferUnmount: boolean;
  dropdowns: {
    pages: {
      html: TDropdown[];
      css: TDropdown[];
      js: TDropdown[];
      misc: TDropdown[];
    };
  };
};

const initialState: TSettingsInitialState = {
  preferUnmount: true,
  dropdowns: {
    pages: {
      html: [
        {
          name: 'All types of inputs',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Old Tags',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Svg favicon',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Supported image formats',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Supported video formats',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Supported audio formats',
          initialState: DROPDOWN_STATE.OPEN,
        },
      ],
      css: [
        {
          name: 'Text-overflow',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Selection styling',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'CSS filters',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'CSS blend modes',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Block style tag and contenteditable attribute',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Difficult CSS Grid layouts',
          initialState: DROPDOWN_STATE.CLOSED,
        },
        {
          name: 'Text-fill-color',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Shape-outside',
          initialState: DROPDOWN_STATE.CLOSED,
        },
        {
          name: 'CSS-only collapse with transition to auto height',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: ':has selector',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Writing modes',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Scroll Behaviours',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Gradients',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Object view box',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Colors',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Media queries',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Different svg features',
          initialState: DROPDOWN_STATE.CLOSED,
        },
        {
          name: 'CSS functions',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Contain',
          initialState: DROPDOWN_STATE.OPEN,
        },
      ],
      js: [
        {
          name: 'JS labels',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Interactions with tab',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Masonry',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Different js events',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Navigator features',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Different Web Storage APIs',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Canvas features',
          initialState: DROPDOWN_STATE.OPEN,
        },
        {
          name: 'Crypto API',
          initialState: DROPDOWN_STATE.OPEN,
        },
      ],
      misc: [
        {
          name: 'Very large image',
          initialState: DROPDOWN_STATE.CLOSED,
        },
        {
          name: 'Different Layouts',
          initialState: DROPDOWN_STATE.CLOSED,
        },
        {
          name: 'Difficult strings',
          initialState: DROPDOWN_STATE.CLOSED,
        },
        {
          name: 'All current emojis',
          initialState: DROPDOWN_STATE.CLOSED,
        },
        {
          name: 'Miscellaneous tests',
          initialState: DROPDOWN_STATE.CLOSED,
        },
      ],
    },
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPreferUnmount: (state, action) => {
      state.preferUnmount = action.payload;
    },
    setDropdownState: (
      state,
      action: PayloadAction<{
        page: keyof TSettingsInitialState['dropdowns']['pages'];
        name: string;
        dropdownState: (typeof DROPDOWN_STATE)[keyof typeof DROPDOWN_STATE];
      }>,
    ) => {
      const { page, name, dropdownState: collapseState } = action.payload;

      state.dropdowns.pages[page].forEach((dropdown) => {
        if (dropdown.name === name) {
          dropdown.initialState = collapseState;
        }
      });

      saveSectionsState(state.dropdowns.pages);
    },
    setSectionsState: (state, action: PayloadAction<TSettingsInitialState['dropdowns']['pages']>) => {
      state.dropdowns.pages = action.payload;
    },
  },
});

export const { setPreferUnmount, setDropdownState, setSectionsState } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
