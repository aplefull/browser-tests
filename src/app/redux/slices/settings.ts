import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DROPDOWN_STATE } from '@/utils/constants';
import { saveSectionsState } from '@/utils/utils';

export type TDropdown = {
  name: string;
  initialState: (typeof DROPDOWN_STATE)[keyof typeof DROPDOWN_STATE];
};

export type TSections = {
  html: TDropdown[];
  css: TDropdown[];
  js: TDropdown[];
  misc: TDropdown[];
};

export type TSettingsInitialState = {
  preferUnmount: boolean;
  dropdowns: {
    pages: TSections;
  };
};

const initialState: TSettingsInitialState = {
  preferUnmount: true,
  dropdowns: {
    pages: {
      html: [],
      css: [],
      js: [],
      misc: [],
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
