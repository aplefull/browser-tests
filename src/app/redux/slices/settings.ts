import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DROPDOWN_STATE } from '@/utils/constants';

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
          initialState: DROPDOWN_STATE.CLOSED,
        },
      ],
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
      console.log(page, name, collapseState);
      state.dropdowns.pages[page].forEach((dropdown) => {
        if (dropdown.name === name) {
          dropdown.initialState = collapseState;
        }
      });
    },
  },
});

export const { setPreferUnmount, setDropdownState } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
