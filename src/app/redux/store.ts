import { configureStore } from '@reduxjs/toolkit';
import { settingsReducer } from '@/app/redux/slices/settings';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
