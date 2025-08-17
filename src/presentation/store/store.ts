import { configureStore } from '@reduxjs/toolkit';
import adminSlice from './slices/adminSlice';
import authSlice from './slices/authSlice';
import bankingSlice from './slices/bankingSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    banking: bankingSlice,
    admin: adminSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;