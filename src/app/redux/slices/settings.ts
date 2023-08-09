import { createSlice } from '@reduxjs/toolkit';
import { DROPDOWN_STATE } from '@/utils/constants';

type TDropdown = {
  name: string;
  initialState: typeof DROPDOWN_STATE[keyof typeof DROPDOWN_STATE];
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
          name: 'All inputs',
          initialState: DROPDOWN_STATE.CLOSED
        }
      ],
      css: [],
      js: [],
      misc: [],
    }
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPreferUnmount: (state, action) => {
      state.preferUnmount = action.payload;
    },
  },
});

export const { setPreferUnmount } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
